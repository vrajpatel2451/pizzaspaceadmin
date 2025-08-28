import RoleNameRenderer from "@/features/staff/components/RoleNameRenderer";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/helpers";
import Avatar from "../compound/Avatar";
import MenuItem from "../compound/MenuItem";
import ThemeToggle from "../compound/ThemeToggle";
import { Sun } from "lucide-react";

interface ProfilePopoverProps {
  onLogoutClick: () => void;
}

const ProfilePopover: React.FC<ProfilePopoverProps> = (props) => {
  const { onLogoutClick } = props;
  const user = useAuthStore((s) => s?.user);
  const isLoggedIn = useAuthStore((s) => s?.isLoggedIn);
  const roleIds = user?.roles || [];

  if (!user && isLoggedIn) {
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
          <div className={cn("text-nl-500 dark:text-nd-200")}>
            <RoleNameRenderer roleIds={roleIds} />
          </div>
        </div>
      </div>
      <div className="menu-items mt-4">
        <div className="flex items-center gap-2 px-2 py-1">
          <Sun size={16} className="dark:text-nd-100 text-nl-600" />
          <p className="text-nl-700 dark:text-nd-100 mr-auto">Theme</p>
          <ThemeToggle />
        </div>
        <MenuItem startIcon="User">Account</MenuItem>
        <MenuItem onClick={onLogoutClick} startIcon="LogOut">
          Sign Out
        </MenuItem>
      </div>
    </div>
  );
};

export default ProfilePopover;
