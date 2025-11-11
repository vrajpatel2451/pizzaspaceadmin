import { ShoppingCart } from "lucide-react";
import type { FC } from "react";

type Props = {
  totalAmount: number;
  itemCount: number;
};

const CartHeaderSection: FC<Props> = ({ totalAmount, itemCount }) => {
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(totalAmount);

  return (
    <div className="border-b border-nl-200 bg-white px-4 py-3 dark:border-nd-700 dark:bg-nd-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart
            size={20}
            className="text-primary-600 dark:text-primary-400"
          />
          <h3 className="text-base font-semibold text-nl-700 dark:text-nd-50">
            Current Order
          </h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {formattedAmount}
          </div>
          {itemCount > 0 && (
            <div className="text-xs text-nl-500 dark:text-nd-400">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartHeaderSection;
