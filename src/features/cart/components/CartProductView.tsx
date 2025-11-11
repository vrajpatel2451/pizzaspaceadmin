import { Button } from "@/components/base/Button";
import ImageComponent from "@/components/compound/ImageComponent";
import { useToggle } from "@/hooks/useToggle";
import type { ProductResponse } from "@/types/product.types";
import { type FC } from "react";
import AddToCartDialog from "./AddToCartDialog";
import type { OnAddToCart } from "../types/cart.types";

type Props = {
  item: ProductResponse;
  onAddToCart: OnAddToCart;
};

const CartProductView: FC<Props> = (props) => {
  const { item: product, onAddToCart } = props;
  const { close, isOpen, open } = useToggle();
  return (
    <div className="border-nl-100 flex w-full items-center gap-4 border-b bg-white p-4">
      {isOpen && (
        <AddToCartDialog
          close={close}
          isOpen
          itemId={product?._id}
          onAddToCart={onAddToCart}
        />
      )}
      <ImageComponent
        src={product.photoList[0] || ""}
        alt={product.name}
        className="h-12 w-12"
      />
      <div className="flex flex-col gap-2">
        <div className="text-lg font-medium">{product.name}</div>
        <div className="flex items-center gap-4">
          <div className="text-pl-500 text-lg">${product.basePrice}</div>
          <div className="text-sm">
            ${product.packagingCharges} packing charges
          </div>
        </div>
      </div>
      <div className="flex-1" />
      <Button onClick={open}>Add To Cart</Button>
    </div>
  );
};

export default CartProductView;
