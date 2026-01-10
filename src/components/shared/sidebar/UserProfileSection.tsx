import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

interface UserProfileSectionProps {
  collapsed?: boolean;
  onLogoutClick?: () => void;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  collapsed,
  onLogoutClick,
}) => {
  const { user } = useAuth();

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-semibold text-white">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 font-semibold text-white">
        {user?.name?.[0]?.toUpperCase() || "U"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">
          {user?.name || "User"}
        </p>
        <p className="truncate text-xs capitalize text-slate-400">
          {user?.role?.replace(/_/g, " ") || "Staff"}
        </p>
      </div>
      {onLogoutClick && (
        <button
          onClick={onLogoutClick}
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default UserProfileSection;
