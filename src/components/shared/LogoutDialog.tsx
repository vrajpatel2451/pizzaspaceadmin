import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { TokenUtil } from "@/utils/tokenUtil";
import { useRouter } from "@tanstack/react-router";
import Dialog from "../compound/Dialog";

interface LogoutProps {
  isOpen: boolean;
  close: () => void;
}

const LogoutDialog: React.FC<LogoutProps> = (props) => {
  const { close, isOpen } = props;

  const loginFail = useAuthStore((s) => s.loginFail);
  const clearUser = useAuthStore((s) => s.clearUser);
  const router = useRouter();

  const handleLogout = () => {
    TokenUtil.removeToken();
    clearUser();
    loginFail();
    router.navigate({ to: ROUTES.LOGIN });
  };

  return (
    <Dialog
      isOpen={isOpen}
      close={close}
      title="Logout?"
      actions={{
        primary: {
          label: "Logout",
          onClick: handleLogout,
        },
        secondary: {
          label: "Cancel",
          onClick: close,
          variant: "ghost",
        },
      }}
    >
      <h6 className="text-nl-500 dark:text-nd-200">
        Are you sure you want to logout?
      </h6>
    </Dialog>
  );
};

export default LogoutDialog;
