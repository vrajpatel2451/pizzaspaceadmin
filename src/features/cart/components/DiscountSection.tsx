import type { DiscountResponse } from "@/types/discount.types";
import { Tag } from "lucide-react";
import type { FC } from "react";
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

  return (
    <CollapsibleSection
      title="Apply Discount"
      icon={<Tag size={18} />}
      defaultOpen={defaultOpen}
      isDisabled={!isEnabled}
    >
      <div className="space-y-3">
        {!isEnabled && (
          <div className="bg-nl-100 text-nl-600 dark:bg-nd-800 dark:text-nd-400 rounded-md p-3 text-xs">
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
            />
          </>
        )}
      </div>
    </CollapsibleSection>
  );
};

export default DiscountSection;
