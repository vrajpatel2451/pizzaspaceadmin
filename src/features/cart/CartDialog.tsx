import Dialog from "@/components/compound/Dialog";
import Spinner from "@/components/compound/spinner/Spinner";
import { cartApiService } from "@/infrastructure/CartApiService";
import type {
  CartCreateData,
  CartQueryParams,
  CartResponse,
  CartUpdateData,
} from "@/types/cart.types";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { toast } from "sonner";
import { v4 } from "uuid";
import StoreDropdown from "../company-management/components/StoreDropdown";
import CartList from "./compontents/CartList";
import ItemListGridView from "./compontents/ItemListGridView";
import { useFetchCartList } from "./hooks";
import type { OnAddToCart, OnEditToCart } from "./types/cart.types";
import type { PricingForCartParamsForAdmin } from "@/types/pricing.types";
import { AddressDropdown, UserDropdown } from "../user";
import CartSummaryCheckoutWrapper from "./compontents/CartSummaryCheckoutWrapper";
import ApplicableDiscountDropdown from "../discount/ApplicableDiscountDropdown";

type Props = {
  isOpen: boolean;
  close: () => void;
};

const CartDialog: FC<Props> = (props) => {
  const { close, isOpen } = props;
  const [storeId, setStoreId] = useState("");
  const params = useMemo<CartQueryParams>(
    () => ({
      storeId,
      all: true,
      fromWeb: false,
    }),
    [storeId],
  );
  const { data, isFetching } = useFetchCartList(params);
  const { data: dCartList } = data || {};
  const [cartList, setCartList] = useState<CartResponse[]>([]);
  const [userId, setUserId] = useState("");
  const [addressId, setAddressId] = useState("");
  const [discountId, setDiscountId] = useState("");

  const cartState = useMemo<PricingForCartParamsForAdmin>(
    () =>
      ({
        addressId: addressId,
        cartIds: cartList.map((e) => e._id),
        discountIds: discountId ? [discountId] : [],
        storeId,
      }) as any,
    [cartList, storeId, addressId, discountId],
  );
  useEffect(() => {
    setCartList(dCartList || []);
  }, [dCartList]);

  const onAddToCart: OnAddToCart = useCallback(
    async (
      itemId,
      categoryId,
      quantity,
      selectedVariantId,
      selectedPricingIds,
    ) => {
      const cartExists = cartList?.find(
        (e) => e.storeId === storeId && itemId === e.itemId,
      );
      if (cartExists) {
        toast.warning("Item is already in the cart");
      } else {
        const addData: CartCreateData = {
          fromWeb: false,
          itemId,
          categoryId,
          pricing: selectedPricingIds,
          quantity,
          sessionId: v4(),
          storeId,
          variantId: selectedVariantId,
        };
        const { success, data, errorMessage } =
          await cartApiService.addToCart(addData);
        if (success) {
          setCartList((prev) => [...prev, data]);
          toast.success("Item added successfully");
          return true;
        } else {
          toast.error(errorMessage || "Something went wrong");
        }
      }
      return false;
    },
    [cartList, storeId],
  );
  const onEditToCart: OnEditToCart = useCallback(
    async (cartId, itemId, quantity, selectedVariantId, selectedPricingIds) => {
      const editData: CartUpdateData = {
        itemId,
        pricing: selectedPricingIds,
        quantity,
        variantId: selectedVariantId,
      };
      const { success, data, errorMessage } =
        await cartApiService.updateCartItem(editData, cartId);
      if (success) {
        setCartList((prev) => prev.map((e) => (e._id === data._id ? data : e)));
        toast.success("Item updated successfully");
        return true;
      } else {
        toast.error(errorMessage || "Something went wrong");
      }
      return false;
    },
    [],
  );
  const onDeleteCart = useCallback(async (cartId: string) => {
    const { success, errorMessage } =
      await cartApiService.removeFromCart(cartId);
    if (success) {
      setCartList((prev) => prev.filter((e) => e._id !== cartId));
      toast.success("Item updated successfully");
      return true;
    } else {
      toast.error(errorMessage || "Something went wrong");
    }
    return false;
  }, []);

  return (
    <Dialog
      isOpen={isOpen}
      close={close}
      title={
        <div className="flex items-center gap-4">
          <h5 className="text-nl-700 dark:text-nd-50 font-medium">POS for</h5>
          <StoreDropdown
            storeId={storeId}
            onChange={setStoreId}
            variant="minimal"
          />
        </div>
      }
      size="full"
    >
      <div className="flex h-[90vh] items-center">
        <div className="h-full w-[70%]">
          <ItemListGridView
            selectedStoreId={storeId}
            onAddToCart={onAddToCart}
          />
        </div>
        <div className="bg-nl-50 flex h-full w-[30%] flex-col">
          {isFetching && <Spinner />}
          {!isFetching && (
            <>
              <div className="w-full flex-1">
                <CartList
                  cartList={cartList}
                  onEditToCart={onEditToCart}
                  onRemoveToCart={onDeleteCart}
                />
              </div>
              <div className="px-4">
                <UserDropdown
                  onChange={(id) => {
                    setUserId(id);
                    setAddressId("");
                  }}
                  userId={userId}
                  label="Customer"
                />
              </div>
              {userId && (
                <div className="px-4 pt-4">
                  <AddressDropdown
                    addressId={addressId}
                    onChange={setAddressId}
                    userId={userId}
                    label="User Address"
                  />
                </div>
              )}
              {userId && (
                <div className="px-4 pt-4">
                  <ApplicableDiscountDropdown
                    userId={userId}
                    cartIds={cartList?.map((e) => e._id) || []}
                    storeId={storeId}
                    selectedDiscountId={discountId}
                    onSelectDiscount={setDiscountId}
                    label="Discount"
                  />
                </div>
              )}
              <div className="w-full pt-4">
                {Boolean(
                  userId && addressId && cartList?.length && storeId,
                ) && <CartSummaryCheckoutWrapper query={cartState} />}
              </div>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default CartDialog;
