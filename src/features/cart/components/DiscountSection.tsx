import { Tag, X } from "lucide-react";
import type { FC } from "react";
import type { DiscountResponse } from "@/types/discount.types";
import ApplicableDiscountDropdown from "../../discount/ApplicableDiscountDropdown";
import CollapsibleSection from "./CollapsibleSection";

type Props = {
  userId: string;
  cartIds: string[];
  storeId: string;
  selectedDiscountId: string;
  initDiscount?: DiscountResponse;
  onSelectDiscount: (discountId: string) => void;
  defaultOpen?: boolean;
};

const DiscountSection: FC<Props> = ({
  userId,
  cartIds,
  storeId,
  selectedDiscountId,
  initDiscount,
  onSelectDiscount,
  defaultOpen = false,
}) => {
  const isEnabled = Boolean(userId && cartIds.length > 0 && storeId);
  const hasDiscount = Boolean(selectedDiscountId);

  return (
    <CollapsibleSection
      title="Apply Discount"
      icon={<Tag size={18} />}
      defaultOpen={defaultOpen}
      isDisabled={!isEnabled}
    >
      <div className="space-y-3">
        {!isEnabled && (
          <div className="rounded-md bg-nl-100 p-3 text-xs text-nl-600 dark:bg-nd-800 dark:text-nd-400">
            {!userId
              ? "Select a customer to apply discounts"
              : "Add items to cart to apply discounts"}
          </div>
        )}

        {isEnabled && (
          <>
            <ApplicableDiscountDropdown
              userId={userId}
              cartIds={cartIds}
              storeId={storeId}
              selectedDiscountId={selectedDiscountId}
              initDiscount={initDiscount}
              onSelectDiscount={onSelectDiscount}
              label=""
              variant="minimal"
            />

            {hasDiscount && initDiscount && (
              <div className="flex items-center justify-between rounded-md bg-green-50 p-3 dark:bg-green-900/20">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-green-600 dark:text-green-400" />
                  <div>
                    <div className="text-sm font-medium text-green-700 dark:text-green-300">
                      {initDiscount.name}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      Code: {initDiscount.couponCode}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectDiscount("")}
                  className="rounded-full p-1 text-green-600 transition-colors hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/40"
                  aria-label="Remove discount"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </CollapsibleSection>
  );
};

export default DiscountSection;
