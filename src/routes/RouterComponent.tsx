import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/sidebar/Sidebar";
import { NAV_ITEMS } from "@/constants/navItems";
import React, { useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import ProtectedRoute from "./ProtectedRoute";
import { createPrivateRoutes } from "./PrivateRoutes";
import { createPublicRoutes } from "./PublicRoutes";
import RouteChecker, { NotFoundPage } from "./RouteChecker";
import { routeHandler } from "./routeHendler";

export const createRoutes = () => {
  createPublicRoutes();
  createPrivateRoutes();
};

type Props = {
  isUserLoggedIn: boolean;
};

const RouterComponent: React.FC<Props> = (props) => {
  const { isUserLoggedIn } = props;
  const { pathname } = useLocation();
  const [routeRegistered, setRouteRegistered] = useState(false);
  useEffect(() => {
    createRoutes();
    setRouteRegistered(true);
  }, []);

  const privateRoutes = useMemo(() => {
    const routes = routeRegistered ? routeHandler.getPrivateRoutes() : [];
    return routes.map((routeConfig, idx) => {
      const { Component, element, ...restProps } = routeConfig.props;
      const routeElement = element || (Component ? <Component /> : null);

      return (
        <Route
          path={routeConfig.props.path}
          element={<PrivateRoute />}
          key={idx}
        >
          <Route
            {...restProps}
            element={<ProtectedRoute>{routeElement}</ProtectedRoute>}
          />
        </Route>
      );
    });
  }, [routeRegistered]);

  const publicRoutes = useMemo(() => {
    const routes = routeRegistered ? routeHandler.getPublicRoutes() : [];
    return routes.map((props, idx) => <Route key={idx} {...props.props} />);
  }, [routeRegistered]);

  const routeComponents = useMemo(
    () => (
      <Routes>
        {privateRoutes}
        {publicRoutes}
        {!isUserLoggedIn && <Route Component={RouteChecker} />}
        <Route path="*" Component={NotFoundPage} />
      </Routes>
    ),
    [isUserLoggedIn, privateRoutes, publicRoutes],
  );

  const appComponent = useMemo(() => {
    if (routeRegistered) {
      const { options } = routeHandler.getRouteByMatch(pathname) || {};
      console.log(options, pathname, "calledOptions");

      const { hideSideBar = true, hideHeader = true } = options || {};
      return (
        <div className="relative h-full w-full">
          {/* {!hideCartButton && (
            <div className="absolute right-[50px] bottom-[50px]">
              <CartButton />
            </div>
          )} */}
          <div className="h-full w-full">
            <div className="flex h-full w-full">
              {!hideSideBar && <Sidebar navItems={NAV_ITEMS} />}
              <div className="flex h-full flex-1 flex-col overflow-hidden">
                {!hideHeader && <Header />}
                <div className="w-full flex-1 overflow-hidden bg-[#FAFAFA]">
                  <div className="h-full w-full overflow-scroll">
                    {routeComponents}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <></>;
  }, [pathname, routeComponents, routeRegistered]);

  return appComponent;
};

export default RouterComponent;
