import StaffDetailsScreen from "@/features/company-management/StaffDetailsScreen";
import StaffListScreen from "@/features/company-management/StaffList";
import StoreDetails from "@/features/company-management/StoreDetails";
import StoreListScreen from "@/features/company-management/StoreList";
import DashboardScreen from "@/features/dashboard/DashboardScreen";
import { FileGalleryScreen } from "@/features/gallery/FileGalleryScreen";
import AddonScreen from "@/features/inventory/addons/AddonScreen";
import CategoryScreen from "@/features/inventory/CategoryScreen";
import MenuScreen from "@/features/inventory/MenuScreen";
import SubCategoryScreen from "@/features/inventory/SubCategoryScreen";
import { Navigate } from "react-router-dom";
import { routeConstants } from "./routeConstants";
import { routeHandler } from "./routeHendler";

export const createPrivateRoutes = async () => {
  // dashboard
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.dashboard,
      Component: DashboardScreen,
    },
    {
      name: "Dashboard",
      hideBackButton: true,
      // icon: <Home color="inherit" />,
      shouldIncludeInNavigation: true,
    },
  );
  // company management
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.stores,
      Component: StoreListScreen,
    },
    {
      name: "Stores",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.storesDetails,
      Component: StoreDetails,
    },
    {
      name: "Store Details",
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.staff,
      Component: StaffListScreen,
    },
    {
      name: "Staff",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.staffDetails,
      Component: StaffDetailsScreen,
    },
    {
      name: "Staff Details",
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.gallery,
      Component: FileGalleryScreen,
    },
    {
      name: "Gallery",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.categories,
      Component: CategoryScreen,
    },
    {
      name: "Categories",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.subCategories,
      Component: SubCategoryScreen,
    },
    {
      name: "Sub Categories",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.menuAndProducts,
      Component: MenuScreen,
    },
    {
      name: "Menu & Products",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.addons,
      Component: AddonScreen,
    },
    {
      name: "Add-ons",
      shouldIncludeInNavigation: true,
    },
  );

  // root
  routeHandler.registerPrivateRoute({
    path: routeConstants.root,
    Component: HomePageRedirect,
    index: true,
  });
};

export const HomePageRedirect = () => (
  <Navigate to={routeConstants.dashboard} replace />
);
