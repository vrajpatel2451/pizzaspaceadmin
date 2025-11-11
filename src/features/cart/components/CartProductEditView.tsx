import { Button } from "@/components/base/Button";
import ImageComponent from "@/components/compound/ImageComponent";
import { useToggle } from "@/hooks/useToggle";
import { useCallback, useMemo, type FC } from "react";
import AddToCartDialog from "./AddToCartDialog";
import type { OnEditToCart } from "../types/cart.types";
import type { CartResponse } from "@/types/cart.types";
import QuantityButton from "./QuantityButton";
import { IconButton } from "@/components/base/IconButton";
import { Trash } from "lucide-react";
import DeleteDialog from "@/components/compound/DeleteDialog";
import { useFetchProductDetails } from "@/features/inventory/hooks/uaeFetchProductDetails";
import { CartFormattingUtils } from "../utils/CartFormattingUtils";

type Props = {
  // item: ProductResponse;
  cart: CartResponse;
  onAddToCart: OnEditToCart;
  onRemove: (cartId: string) => Promise<boolean>;
};

const CartProductEditView: FC<Props> = (props) => {
  const { onAddToCart, cart, onRemove } = props;
  const { close, isOpen, open } = useToggle();
  const { _id: cartId, quantity, variantId, pricing, itemId } = cart;

  const { data, isFetching } = useFetchProductDetails(itemId);
  const { product } = data || {};

  const onUpdateCart: OnEditToCart = useCallback(
    (...rest) => onAddToCart(...rest),
    [onAddToCart],
  );

  const {
    isOpen: isUpdating,
    open: startUpdating,
    close: stopUpdating,
  } = useToggle();
  const onUpdateQuantity = useCallback(
    async (quantity: number) => {
      startUpdating();
      await onAddToCart(cartId, itemId, quantity);
      stopUpdating();
    },
    [cartId, itemId, onAddToCart, startUpdating, stopUpdating],
  );
  const {
    close: closeDelete,
    isOpen: isDeleteOpen,
    open: openDelete,
  } = useToggle();
  const {
    close: stopDeleting,
    isOpen: isDeleteInProgress,
    open: startDeleting,
  } = useToggle();
  const onDeleteConfirm = useCallback(async () => {
    startDeleting();
    const response = await onRemove(cartId);
    if (response) {
      closeDelete();
    }
    stopDeleting();
  }, [cartId, closeDelete, onRemove, startDeleting, stopDeleting]);

  const [afterDiscount, price] = useMemo(
    () => CartFormattingUtils.getPriceFromSelection(data, cart),
    [cart, data],
  );

  return (
    <div className="border-nl-100 flex w-full items-center gap-4 border-b bg-white p-4">
      {isOpen && (
        <AddToCartDialog
          close={close}
          isOpen
          itemId={product?._id}
          onAddToCart={onUpdateCart}
          quantity={quantity}
          selectedPricingIds={pricing}
          selectedVariantId={variantId}
        />
      )}
      {isDeleteOpen && (
        <DeleteDialog
          close={closeDelete}
          isOpen
          onDelete={onDeleteConfirm}
          isDeleting={isDeleteInProgress}
          title="Remove Item!"
          name={product?.name}
        />
      )}

      <ImageComponent
        src={product?.photoList?.[0] || ""}
        alt={product?.name}
        className="h-12 w-12"
      />
      <div className="flex flex-col gap-2">
        <div className="text-lg font-medium">{product?.name}</div>
        <div className="flex items-center gap-4">
          <div className="text-pl-500 text-lg">${afterDiscount * quantity}</div>
          <div className="text-nl-700 text-sm">${price * quantity}</div>
          <Button
            onClick={open}
            size="sm"
            variant="link"
            disabled={isFetching}
            isLoading={isFetching}
          >
            Edit
          </Button>
        </div>
      </div>
      <div className="flex-1" />
      <QuantityButton
        quantity={quantity}
        onChange={onUpdateQuantity}
        isLoading={isUpdating || isFetching}
      />
      <IconButton icon={Trash} onClick={openDelete} />
    </div>
  );
};

export default CartProductEditView;
