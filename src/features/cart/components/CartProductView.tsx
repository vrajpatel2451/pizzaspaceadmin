import { Button } from "@/components/base/Button";
import ImageComponent from "@/components/compound/ImageComponent";
import { useToggle } from "@/hooks/useToggle";
import type { ProductResponse } from "@/types/product.types";
import { Plus } from "lucide-react";
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
    <div className="border-pl-50 flex flex-col overflow-hidden rounded-xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
      {isOpen && (
        <AddToCartDialog
          close={close}
          isOpen
          itemId={product?._id}
          onAddToCart={onAddToCart}
        />
      )}

      {/* Top Section - Light Purple Background with Image */}
      <div className="bg-pl-50 relative w-full flex-1">
        {/* Price Badge - Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-pl-500 rounded-full px-3 py-1 text-sm font-medium text-white">
            ₹{product.basePrice}
          </div>
        </div>

        {/* Image Section */}
        <div className="h-full w-full">
          <ImageComponent
            src={product.photoList[0] || ""}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Bottom Section - White Background with Text and Button */}
      <div className="flex flex-col gap-1 bg-white p-4">
        <div className="text-nl-800 text-lg font-semibold">{product.name}</div>
        <div className="text-nl-500 text-sm">
          +₹{product.packagingCharges} packing
        </div>

        {/* Action Button */}
        <Button
          variant="filled"
          color="primary"
          startIcon={<Plus className="text-white" />}
          fullWidth
          className="mt-3"
          onClick={open}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default CartProductView;
