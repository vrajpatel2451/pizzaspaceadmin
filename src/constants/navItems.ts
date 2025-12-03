import { routeConstants } from "@/routes/routeConstants";
import type { NavItemTypes } from "../components/shared/sidebar/NavItem";

export const NAV_ITEMS: NavItemTypes[] = [
  {
    label: "Dashboard",
    path: routeConstants.dashboard,
    icon: "LayoutDashboard",
  },
  {
    label: "Reports",
    path: routeConstants.reports,
    icon: "TrendingUp",
  },
  {
    label: "Inventory",
    icon: "HandPlatter",
    children: [
      {
        label: "Categories",
        path: routeConstants.categories,
      },
      {
        label: "Sub Categories",
        path: routeConstants.subCategories,
      },
      {
        label: "Menu & Products",
        path: routeConstants.menuAndProducts,
      },
      {
        label: "Reviews",
        path: routeConstants.productReviews,
      },
    ],
  },
  {
    label: "Orders",
    icon: "Boxes",
    children: [
      {
        label: "Recent Orders",
        path: routeConstants.recentOrders,
      },
      {
        label: "Order History",
        path: routeConstants.orderHistory,
      },
      // {
      //   label: "Create Order",
      //   path: routeConstants.createOrder,
      // },
      {
        label: "Reviews",
        path: routeConstants.orderReviews,
      },
      {
        label: "Tickets",
        path: routeConstants.orderTickets,
      },
    ],
  },
  {
    label: "Customers",
    icon: "UsersRound",
    children: [
      {
        label: "Customers List",
        path: routeConstants.customerList,
      },
      {
        label: "Create Customer",
        path: routeConstants.createCustomer,
      },
      {
        label: "Contact Queries",
        path: routeConstants.contactQueries,
      },
      {
        label: "Reservation Queries",
        path: routeConstants.reservationQueries,
      },
    ],
  },
  {
    label: "Discounts",
    icon: "BadgePercent",
    path: routeConstants.discounts,
  },
  {
    label: "Company Management",
    icon: "Store",
    children: [
      {
        label: "Stores",
        path: routeConstants.stores,
      },
      {
        label: "Staff",
        path: routeConstants.staff,
      },
      {
        label: "Delivery Boy Reviews",
        path: routeConstants.deliveryBoyReviews,
      },
    ],
  },
  {
    label: "Website Management",
    icon: "MonitorCog",
    children: [
      {
        label: "Contact Info",
        path: routeConstants.contactInfo,
      },
      {
        label: "Opening Hours",
        path: routeConstants.openingHours,
      },
      {
        label: "Social Media",
        path: routeConstants.socialMedia,
      },
      {
        label: "Logos",
        path: routeConstants.logos,
      },
      {
        label: "Policies",
        path: routeConstants.policies,
      },
      {
        label: "General Ratings",
        path: routeConstants.generalRatings,
      },
    ],
  },
  {
    label: "Settings",
    icon: "Settings",
    children: [
      // {
      //   label: "Account",
      //   path: routeConstants.account,
      // },
      {
        label: "Gallery",
        path: routeConstants.gallery,
      },
    ],
  },
];
