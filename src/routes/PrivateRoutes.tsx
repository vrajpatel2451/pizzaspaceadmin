import StaffDetailsScreen from "@/features/company-management/StaffDetailsScreen";
import StaffListScreen from "@/features/company-management/StaffList";
import StoreDetails from "@/features/company-management/StoreDetails";
import StoreListScreen from "@/features/company-management/StoreList";
import DashboardScreen from "@/features/dashboard/DashboardScreen";
import ReportsScreen from "@/features/reports/ReportsScreen";
import { FileGalleryScreen } from "@/features/gallery/FileGalleryScreen";
import AddonScreen from "@/features/inventory/addons/AddonScreen";
import CategoryScreen from "@/features/inventory/CategoryScreen";
import MenuScreen from "@/features/inventory/MenuScreen";
import SubCategoryScreen from "@/features/inventory/SubCategoryScreen";
import { Navigate } from "react-router-dom";
import { routeConstants } from "./routeConstants";
import { routeHandler } from "./routeHendler";
import DiscountListScreen from "@/features/discount/DiscountListScreen";
import DiscountDetailsScreen from "@/features/discount/details/DiscountDetailsScreen";
import StoreViewScreen from "@/features/company-management/StoreViewScreen";
import RecentOrdersScreen from "@/features/orders/RecentOrdersScreen";
import OrderHistoryScreen from "@/features/orders/OrderHistoryScreen";
import OrderDetailsScreen from "@/features/orders/OrderDetailsScreen";
import OrderReviewsScreen from "@/features/reviews/OrderReviewsScreen";
import ProductReviewsScreen from "@/features/reviews/ProductReviewsScreen";
import DeliveryBoyReviewsScreen from "@/features/reviews/DeliveryBoyReviewsScreen";
import OrderTicketsScreen from "@/features/tickets/OrderTicketsScreen";
import CustomerListScreen from "@/features/customers/CustomerListScreen";
import CustomerDetailsScreen from "@/features/customers/CustomerDetailsScreen";
// Website Management
import ContactInfoScreen from "@/features/contact-info/ContactInfoScreen";
import OpeningHoursScreen from "@/features/opening-hours/OpeningHoursScreen";
import SocialMediaScreen from "@/features/social-media/SocialMediaScreen";
import LogoScreen from "@/features/logos/LogoScreen";
import PoliciesScreen from "@/features/policies/PoliciesScreen";
import PolicyEditScreen from "@/features/policies/PolicyEditScreen";
import GeneralRatingsScreen from "@/features/general-ratings/GeneralRatingsScreen";
// Customer Queries
import ContactQueriesScreen from "@/features/contact-queries/ContactQueriesScreen";
import ReservationQueriesScreen from "@/features/reservation-queries/ReservationQueriesScreen";

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
  // reports
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.reports,
      Component: ReportsScreen,
    },
    {
      name: "Reports",
      hideBackButton: true,
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
      path: routeConstants.storesView,
      Component: StoreViewScreen,
    },
    {
      name: "Store View",
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
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.discounts,
      Component: DiscountListScreen,
    },
    {
      name: "Discounts/Offers",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.discountDetails,
      Component: DiscountDetailsScreen,
    },
    {
      name: "Discount Details",
      hideBackButton: false,
      shouldIncludeInNavigation: true,
    },
  );

  // orders
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.recentOrders,
      Component: RecentOrdersScreen,
    },
    {
      name: "Recent Orders",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.orderHistory,
      Component: OrderHistoryScreen,
    },
    {
      name: "Order History",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.orderDetails,
      Component: OrderDetailsScreen,
    },
    {
      name: "Order Details",
      shouldIncludeInNavigation: false,
    },
  );

  // reviews
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.orderReviews,
      Component: OrderReviewsScreen,
    },
    {
      name: "Order Reviews",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.productReviews,
      Component: ProductReviewsScreen,
    },
    {
      name: "Product Reviews",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.deliveryBoyReviews,
      Component: DeliveryBoyReviewsScreen,
    },
    {
      name: "Delivery Boy Reviews",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );

  // tickets
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.orderTickets,
      Component: OrderTicketsScreen,
    },
    {
      name: "Order Tickets",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );

  // customers
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.customerList,
      Component: CustomerListScreen,
    },
    {
      name: "Customers",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.createCustomer,
      Component: CustomerDetailsScreen,
    },
    {
      name: "Create Customer",
      shouldIncludeInNavigation: false,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.customerDetails,
      Component: CustomerDetailsScreen,
    },
    {
      name: "Customer Details",
      shouldIncludeInNavigation: false,
    },
  );

  // Website Management
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.contactInfo,
      Component: ContactInfoScreen,
    },
    {
      name: "Contact Info",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.openingHours,
      Component: OpeningHoursScreen,
    },
    {
      name: "Opening Hours",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.socialMedia,
      Component: SocialMediaScreen,
    },
    {
      name: "Social Media",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.logos,
      Component: LogoScreen,
    },
    {
      name: "Logos",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.policies,
      Component: PoliciesScreen,
    },
    {
      name: "Policies",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.policyCreate,
      Component: PolicyEditScreen,
    },
    {
      name: "Create Policy",
      shouldIncludeInNavigation: false,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.policyEdit,
      Component: PolicyEditScreen,
    },
    {
      name: "Edit Policy",
      shouldIncludeInNavigation: false,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.generalRatings,
      Component: GeneralRatingsScreen,
    },
    {
      name: "General Ratings",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );

  // Customer Queries
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.contactQueries,
      Component: ContactQueriesScreen,
    },
    {
      name: "Contact Queries",
      hideBackButton: true,
      shouldIncludeInNavigation: true,
    },
  );
  routeHandler.registerPrivateRoute(
    {
      path: routeConstants.reservationQueries,
      Component: ReservationQueriesScreen,
    },
    {
      name: "Reservation Queries",
      hideBackButton: true,
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
