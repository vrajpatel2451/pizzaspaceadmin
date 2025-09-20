import { useAuth } from "@/hooks/useAuth";
import React, { useMemo } from "react";
import {
  Navigate,
  Outlet,
  useLocation,
  type NavigateProps,
} from "react-router-dom";
import { routeConstants } from "./routeConstants";

const PrivateRoute: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { pathname, search } = useLocation();
  if (isLoggedIn) {
    return <Outlet />;
  }
  return <LoginRedirect redirectFrom={pathname + search} />;
};

type Props = {
  redirectFrom?: string;
};
export const LoginRedirect: React.FC<Props> = (props) => {
  const { redirectFrom } = props;
  const newUrl = useMemo<NavigateProps["to"]>(() => {
    const newUrl: NavigateProps["to"] = {
      pathname: routeConstants.login,
      search: redirectFrom
        ? `?redirectTo=${encodeURIComponent(redirectFrom)}`
        : "",
    };
    return newUrl;
  }, [redirectFrom]);

  return <Navigate to={newUrl} />;
};

export default PrivateRoute;
