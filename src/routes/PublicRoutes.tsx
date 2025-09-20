import LoginScreen from "@/features/auth/LoginScreen";
import { routeConstants } from "./routeConstants";
import { routeHandler } from "./routeHendler";
import { LoginRedirect } from "./PrivateRoute";
import RegisterScreen from "@/features/auth/RegisterScreen";

export const createPublicRoutes = async () => {
  routeHandler.registerPublicRoute({
    path: routeConstants.login,
    Component: LoginScreen,
  });
  routeHandler.registerPublicRoute({
    path: routeConstants.register,
    Component: RegisterScreen,
  });
  routeHandler.registerPublicRoute({
    path: routeConstants.root,
    Component: LoginRedirect,
    index: true,
  });
};
