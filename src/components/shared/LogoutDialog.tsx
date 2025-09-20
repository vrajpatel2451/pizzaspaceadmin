import Dialog from "../compound/Dialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { routeConstants } from "@/routes/routeConstants";

interface LogoutProps {
  isOpen: boolean;
  close: () => void;
}

const LogoutDialog: React.FC<LogoutProps> = (props) => {
  const { close, isOpen } = props;

  const { logoutSubmit, logoutInProgress } = useAuth();
  const nav = useNavigate();

  const handleLogoutAll = () => {
    logoutSubmit(true, () => {
      nav(routeConstants.login);
    });
  };
  const handleLogout = () => {
    logoutSubmit(false, () => {
      nav(routeConstants.login);
    });
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
          loading: logoutInProgress,
          disabled: logoutInProgress,
        },
        secondary: {
          label: "Logout From All Device",
          onClick: handleLogoutAll,
          loading: logoutInProgress,
          disabled: logoutInProgress,
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
