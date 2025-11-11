import { MapPin, User } from "lucide-react";
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
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-nl-600 dark:text-nd-400">
            <User size={14} />
            <span>Customer *</span>
          </div>
          <UserDropdown
            onChange={(id) => {
              onUserChange(id);
              if (!id) {
                onAddressChange("");
              }
            }}
            userId={userId}
            label=""
            variant="minimal"
          />
        </div>

        {userId && (
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-nl-600 dark:text-nd-400">
              <MapPin size={14} />
              <span>Delivery Address *</span>
            </div>
            <AddressDropdown
              addressId={addressId}
              onChange={onAddressChange}
              userId={userId}
              label=""
              variant="minimal"
            />
          </div>
        )}

        {!userId && (
          <div className="rounded-md bg-nl-100 p-3 text-xs text-nl-600 dark:bg-nd-800 dark:text-nd-400">
            Select a customer to choose delivery address
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
};

export default CustomerDetailsSection;
