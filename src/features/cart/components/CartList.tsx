import type { CartResponse } from "@/types/cart.types";
import { ShoppingBag } from "lucide-react";
import { type FC } from "react";
import type { OnEditToCart } from "../types/cart.types";
import CartProductEditView from "./CartProductEditView";

type Props = {
  cartList: CartResponse[];
  onEditToCart: OnEditToCart;
  onRemoveToCart: (cartId: string) => Promise<boolean>;
  onClearAll: () => void;
};

const CartList: FC<Props> = (props) => {
  const { cartList, onEditToCart, onRemoveToCart, onClearAll } = props;

  const itemCount = cartList?.length || 0;

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-nl-200 px-4 py-3 dark:border-nd-700">
        <h4 className="text-sm font-medium text-nl-700 dark:text-nd-50">
          Items ({itemCount})
        </h4>
        {itemCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cart Items or Empty State */}
      <div className="flex h-full w-full flex-1 flex-col gap-4 overflow-auto p-4">
        {itemCount === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <ShoppingBag
              size={48}
              className="text-nl-300 dark:text-nd-600"
              strokeWidth={1.5}
            />
            <div className="text-sm text-nl-500 dark:text-nd-400">
              Your cart is empty
            </div>
            <div className="text-xs text-nl-400 dark:text-nd-500">
              Select items from the menu to begin
            </div>
          </div>
        ) : (
          cartList.map((prod) => (
            <CartProductEditView
              onAddToCart={onEditToCart}
              onRemove={onRemoveToCart}
              cart={prod}
              key={prod._id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CartList;
