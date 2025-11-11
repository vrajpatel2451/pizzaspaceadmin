import { User } from "lucide-react";
import type { FC } from "react";
import { AddressDropdown, UserDropdown } from "../../user";
import CollapsibleSection from "./CollapsibleSection";

type Props = {
  userId: string;
  addressId: string;
  onUserChange: (userId: string) => void;
  onAddressChange: (addressId: string) => void;
  defaultOpen?: boolean;
};

const CustomerDetailsSection: FC<Props> = ({
  userId,
  addressId,
  onUserChange,
  onAddressChange,
  defaultOpen = true,
}) => {
  return (
    <CollapsibleSection
      title="Customer Details"
      icon={<User size={18} />}
      defaultOpen={defaultOpen}
    >
      <div className="space-y-4">
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

        {userId && (
          <div>
            <AddressDropdown
              addressId={addressId}
              onChange={onAddressChange}
              userId={userId}
              label="Delivery Address*"
            />
          </div>
        )}

        {!userId && (
          <div className="bg-nl-100 text-nl-600 dark:bg-nd-800 dark:text-nd-400 rounded-md p-3 text-xs">
            Select a customer to choose delivery address
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
};

export default CustomerDetailsSection;
