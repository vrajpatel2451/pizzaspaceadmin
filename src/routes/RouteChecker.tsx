import { Route, useLocation } from "react-router-dom";
import { routeHandler } from "./routeHendler";
import { LoginRedirect } from "./PrivateRoute";

const RouteChecker = () => {
  const { pathname, search } = useLocation();
  const url = pathname + search;
  if (routeHandler.hasRoute(pathname)) {
    return <LoginRedirect redirectFrom={url} />;
  }
  return <Route Component={NotFoundPage} />;
};

export const NotFoundPage = () => {
  console.log("called here not found");

  return <div>NotFoundPage</div>;
};

export default RouteChecker;
