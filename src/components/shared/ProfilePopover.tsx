import Avatar from "../compound/Avatar";
import MenuItem from "../compound/MenuItem";
import { useAuth } from "@/hooks/useAuth";
import type { StaffRole } from "@/types/user.types";

const roleConfig: Record<StaffRole, { label: string; className: string }> = {
  admin: {
    label: "Owner",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  manager: {
    label: "Store Manager",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  delivery_boy: {
    label: "Delivery",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  kitchen: {
    label: "Kitchen",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
};

interface ProfilePopoverProps {
  onLogoutClick: () => void;
}

const ProfilePopover: React.FC<ProfilePopoverProps> = (props) => {
  const { onLogoutClick } = props;
  const { user, isFetching } = useAuth();

  if (isFetching) {
    return (
      <div className="flex gap-3 p-2">
        <div className="shimmer size-10 shrink-0 !rounded-full" />
        <div className="flex w-full flex-col gap-y-1">
          <div className="shimmer h-5 w-full" />
          <div className="shimmer h-4 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-48">
      <div className="flex items-center gap-x-3 p-2 pb-0">
        <Avatar
          size="lg"
          fallback={user?.name?.[0] || "F"}
          classname="bg-t-peach"
        />
        <div>
          <h6 className="text-nl-700 dark:text-nd-50 font-semibold">
            {user?.name}
          </h6>
          {user?.role && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${roleConfig[user.role]?.className || "bg-gray-100 text-gray-800"}`}
            >
              {roleConfig[user.role]?.label || user.role}
            </span>
          )}
        </div>
      </div>
      <div className="menu-items mt-4">
        <MenuItem startIcon="User">Account</MenuItem>
        <MenuItem onClick={onLogoutClick} startIcon="LogOut">
          Sign Out
        </MenuItem>
      </div>
    </div>
  );
};

export default ProfilePopover;
