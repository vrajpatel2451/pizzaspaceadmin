import { routeConstants } from "@/routes/routeConstants";
import type { NavItemTypes } from "../components/shared/sidebar/NavItem";
import { hasPermission, NAV_PATH_PERMISSIONS } from "@/config/permissions";
import type { StaffRole } from "@/types/user.types";

export interface NavGroup {
  group: string;
  items: NavItemTypes[];
}

export const GROUPED_NAV_ITEMS: NavGroup[] = [
  {
    group: "Overview",
    items: [
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
    ],
  },
  {
    group: "Menu & Orders",
    items: [
      {
        label: "Inventory",
        icon: "UtensilsCrossed",
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
        icon: "ShoppingBag",
        children: [
          {
            label: "Recent Orders",
            path: routeConstants.recentOrders,
          },
          {
            label: "Order History",
            path: routeConstants.orderHistory,
          },
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
        label: "Discounts",
        icon: "Percent",
        path: routeConstants.discounts,
      },
    ],
  },
  {
    group: "Customers",
    items: [
      {
        label: "All Customers",
        icon: "Users",
        path: routeConstants.customerList,
      },
      {
        label: "Add Customer",
        icon: "UserPlus",
        path: routeConstants.createCustomer,
      },
      {
        label: "Queries",
        icon: "MessageSquare",
        children: [
          {
            label: "Contact Queries",
            path: routeConstants.contactQueries,
          },
          {
            label: "Reservations",
            path: routeConstants.reservationQueries,
          },
        ],
      },
    ],
  },
  {
    group: "Business",
    items: [
      {
        label: "Stores",
        icon: "Store",
        path: routeConstants.stores,
      },
      {
        label: "Staff",
        icon: "UserCog",
        path: routeConstants.staff,
      },
      {
        label: "Delivery Reviews",
        icon: "Bike",
        path: routeConstants.deliveryBoyReviews,
      },
      {
        label: "Website",
        icon: "Globe",
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
            label: "Ratings",
            path: routeConstants.generalRatings,
          },
        ],
      },
    ],
  },
  {
    group: "Settings",
    items: [
      {
        label: "Gallery",
        icon: "Image",
        path: routeConstants.gallery,
      },
    ],
  },
];

// Flatten grouped items for backward compatibility
export const NAV_ITEMS: NavItemTypes[] = GROUPED_NAV_ITEMS.flatMap(
  (group) => group.items
);

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

/**
 * Filters grouped navigation items based on user role permissions
 */
export const filterGroupedNavItemsByRole = (
  groups: NavGroup[],
  role: StaffRole
): NavGroup[] => {
  return groups
    .map((group) => ({
      ...group,
      items: filterNavItemsByRole(group.items, role),
    }))
    .filter((group) => group.items.length > 0);
};
