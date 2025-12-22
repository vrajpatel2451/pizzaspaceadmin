import { routeConstants } from "@/routes/routeConstants";
import type { NavItemTypes } from "../components/shared/sidebar/NavItem";
import { hasPermission, NAV_PATH_PERMISSIONS } from "@/config/permissions";
import type { StaffRole } from "@/types/user.types";

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

/**
 * Filters navigation items based on user role permissions
 * - For items with paths: checks if role has permission for that path
 * - For parent items with children: filters children and hides parent if no children remain
 *
 * @param items - The navigation items to filter
 * @param role - The user's role
 * @returns Filtered navigation items based on role permissions
 */
export const filterNavItemsByRole = (
  items: NavItemTypes[],
  role: StaffRole
): NavItemTypes[] => {
  return items
    .map((item) => {
      // Check if this item has children (expandable menu)
      if (item.children && item.children.length > 0) {
        // Filter children based on permissions
        const filteredChildren = item.children.filter((child) => {
          // Only check items with paths
          if ("path" in child) {
            const permission = NAV_PATH_PERMISSIONS[child.path];
            if (!permission) return true; // No permission required
            return hasPermission(role, permission);
          }
          return true; // No path means no permission check needed
        });

        // If no children remain after filtering, hide the parent
        if (filteredChildren.length === 0) {
          return null;
        }

        // Return parent with filtered children
        return {
          ...item,
          children: filteredChildren,
        };
      }

      // For top-level items with paths, check permission directly
      if ("path" in item) {
        const permission = NAV_PATH_PERMISSIONS[item.path];
        if (!permission) return item; // No permission required
        if (hasPermission(role, permission)) return item;
        return null; // No permission, hide item
      }

      return item;
    })
    .filter((item): item is NavItemTypes => item !== null);
};
