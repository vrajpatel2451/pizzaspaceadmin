import Dialog from "@/components/compound/Dialog";
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
import CartList from "./components/CartList";
import ItemListGridView from "./components/ItemListGridView";
import { useFetchCartList } from "./hooks";
import type { OnAddToCart, OnEditToCart } from "./types/cart.types";
import type { PricingForCartParamsForAdmin } from "@/types/pricing.types";
import CartHeaderSection from "./components/CartHeaderSection";
import CustomerDetailsSection from "./components/CustomerDetailsSection";
import DiscountSection from "./components/DiscountSection";
import { useFetchCartSummary } from "./hooks/useFetchCartSummary";
import CartSummaryWithCheckout from "./components/CartSummaryWithCheckout";

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
  const { data } = useFetchCartList(params);
  const { data: dCartList } = data || {};
  const [cartList, setCartList] = useState<CartResponse[]>([]);
  const [userId, setUserId] = useState("");
  const [addressId, setAddressId] = useState("");
  const [discountId, setDiscountId] = useState("");

  const cartState = useMemo<PricingForCartParamsForAdmin>(
    () => ({
      addressId: addressId,
      cartIds: cartList.map((e) => e._id),
      discountIds: discountId ? [discountId] : [],
      storeId,
    }),
    [cartList, storeId, addressId, discountId],
  );

  // Fetch cart summary
  const { data: summaryData, isFetching: isSummaryFetching } =
    useFetchCartSummary(cartState);

  useEffect(() => {
    setCartList(dCartList || []);
  }, [dCartList]);

  // Calculate total from summary
  const totalAmount = summaryData?.total || 0;

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
      toast.success("Item removed successfully");
      return true;
    } else {
      toast.error(errorMessage || "Something went wrong");
    }
    return false;
  }, []);

  const onClearAll = useCallback(async () => {
    if (cartList.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to remove all ${cartList.length} items from the cart?`,
    );

    if (!confirmed) return;

    // Delete all cart items
    const deletePromises = cartList.map((cart) =>
      cartApiService.removeFromCart(cart._id),
    );

    try {
      const results = await Promise.all(deletePromises);
      const allSuccess = results.every((result) => result.success);

      if (allSuccess) {
        setCartList([]);
        toast.success("Cart cleared successfully");
      } else {
        toast.error("Some items could not be removed");
      }
    } catch {
      toast.error("Failed to clear cart");
    }
  }, [cartList]);

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
      <div className="flex h-[90vh]">
        {/* Left Panel - Product Grid */}
        <div className="h-full w-[70%] overflow-hidden">
          <ItemListGridView
            selectedStoreId={storeId}
            onAddToCart={onAddToCart}
          />
        </div>

        {/* Right Panel - Cart & Checkout */}
        <div className="dark:bg-nd-900 border-nl-100 flex h-full w-[30%] flex-col overflow-hidden rounded-xl border bg-white shadow-lg">
          {/* Cart Header with Total */}
          <CartHeaderSection
            totalAmount={totalAmount}
            itemCount={cartList.length}
          />

          {/* Cart Items List */}
          <div className="flex-1 overflow-hidden">
            <CartList
              cartList={cartList}
              onEditToCart={onEditToCart}
              onRemoveToCart={onDeleteCart}
              onClearAll={onClearAll}
            />
          </div>

          {/* Customer Details Section */}
          <CustomerDetailsSection
            userId={userId}
            addressId={addressId}
            onUserChange={setUserId}
            onAddressChange={setAddressId}
            defaultOpen={true}
          />

          {/* Discount Section */}
          <DiscountSection
            userId={userId}
            cartIds={cartList.map((e) => e._id)}
            storeId={storeId}
            selectedDiscountId={discountId}
            initDiscount={undefined}
            onSelectDiscount={setDiscountId}
            defaultOpen={false}
          />

          {/* Bill Breakdown and Complete Order */}
          <CartSummaryWithCheckout
            summary={summaryData || null}
            isFetching={isSummaryFetching}
            userId={userId}
            addressId={addressId}
            cartListLength={cartList.length}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default CartDialog;
