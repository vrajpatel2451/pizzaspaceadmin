import { User } from "lucide-react";
import type { FC } from "react";
import { AddressDropdown, UserDropdown } from "../../user";
import CollapsibleSection from "./CollapsibleSection";
import RadioGroup from "@/components/compound/RadioGroup";
import type { OrderDeliveryType } from "@/types/cart.types";

type Props = {
  userId: string;
  addressId: string;
  deliveryType: OrderDeliveryType;
  onUserChange: (userId: string) => void;
  onAddressChange: (addressId: string) => void;
  onDeliveryTypeChange: (deliveryType: OrderDeliveryType) => void;
  defaultOpen?: boolean;
};

const CustomerDetailsSection: FC<Props> = ({
  userId,
  addressId,
  deliveryType,
  onUserChange,
  onAddressChange,
  onDeliveryTypeChange,
  defaultOpen = true,
}) => {
  const deliveryTypeOptions = [
    { label: "Dine In", value: "dineIn" },
    { label: "Pickup", value: "pickup" },
    { label: "Delivery", value: "delivery" },
  ];

  return (
    <CollapsibleSection
      title="Customer Details"
      icon={<User size={18} />}
      defaultOpen={defaultOpen}
    >
      <div className="space-y-4">
        {/* Delivery Type Selector */}
        <div>
          <label className="text-nl-700 dark:text-nd-200 mb-2 block text-sm font-medium">
            Order Type*
          </label>
          <RadioGroup
            options={deliveryTypeOptions}
            value={deliveryType}
            onChange={(value) => {
              onDeliveryTypeChange(value as OrderDeliveryType);
              // Clear address when switching away from delivery
              if (value !== "delivery" && addressId) {
                onAddressChange("");
              }
            }}
            size="sm"
            orientation="horizontal"
          />
        </div>

        {/* Customer Selection */}
        <div>
          <UserDropdown
            onChange={(id) => {
              onUserChange(id);
              if (!id) {
                onAddressChange("");
              }
            }}
            userId={userId}
            label="Customer*"
          />
        </div>

        {/* Address Selection - Only for Delivery */}
        {deliveryType === "delivery" && userId && (
          <div>
            <AddressDropdown
              addressId={addressId}
              onChange={onAddressChange}
              userId={userId}
              label="Delivery Address*"
            />
          </div>
        )}

        {/* Helper Messages */}
        {deliveryType === "delivery" && !userId && (
          <div className="bg-nl-100 text-nl-600 dark:bg-nd-800 dark:text-nd-400 rounded-md p-3 text-xs">
            Select a customer to choose delivery address
          </div>
        )}

        {deliveryType !== "delivery" && userId && (
          <div className="bg-pl-50 text-pl-700 dark:bg-pd-900 dark:text-pd-200 rounded-md p-3 text-xs">
            Delivery address not required for {deliveryType === "dineIn" ? "dine-in" : "pickup"} orders
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
};

export default CustomerDetailsSection;
