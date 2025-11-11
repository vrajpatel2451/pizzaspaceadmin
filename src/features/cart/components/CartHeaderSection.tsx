import { CurrencyUtils } from "@/utils/currencyUtils";
import { ShoppingCart } from "lucide-react";
import type { FC } from "react";

type Props = {
  totalAmount: number;
  itemCount: number;
};

const CartHeaderSection: FC<Props> = ({ totalAmount, itemCount }) => {
  const formattedAmount = CurrencyUtils.formatCurrency(totalAmount);
  return (
    <div className="border-nl-200 dark:border-nd-700 dark:bg-nd-900 border-b bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart
            size={20}
            className="text-primary-600 dark:text-primary-400"
          />
          <h3 className="text-nl-700 dark:text-nd-50 text-base font-semibold">
            Current Order
          </h3>
        </div>
        <div className="text-right">
          <div className="text-primary-600 dark:text-primary-400 text-2xl font-bold">
            {formattedAmount}
          </div>
          {itemCount > 0 && (
            <div className="text-nl-500 dark:text-nd-400 text-xs">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartHeaderSection;
