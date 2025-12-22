import type { StaffRole } from "@/types/user.types";
import { routeConstants } from "@/routes/routeConstants";

/**
 * Permission types for all features in the admin panel
 */
export type Permission =
  | "dashboard:view"
  | "reports:view"
  | "categories:view"
  | "subcategories:view"
  | "menu:view"
  | "product_reviews:view"
  | "orders:view"
  | "order_history:view"
  | "order_reviews:view"
  | "order_tickets:view"
  | "customers:view"
  | "contact_queries:view"
  | "reservation_queries:view"
  | "discounts:view"
  | "stores:view"
  | "staff:view"
  | "delivery_boy_reviews:view"
  | "website_management:view"
  | "gallery:view"
  | "addons:view";

/**
 * Role to permissions mapping
 * Defines which permissions each role has access to
 */
export const ROLE_PERMISSIONS: Record<StaffRole, Permission[]> = {
  admin: [
    // Full access to all features
    "dashboard:view",
    "reports:view",
    "categories:view",
    "subcategories:view",
    "menu:view",
    "product_reviews:view",
    "orders:view",
    "order_history:view",
    "order_reviews:view",
    "order_tickets:view",
    "customers:view",
    "contact_queries:view",
    "reservation_queries:view",
    "discounts:view",
    "stores:view",
    "staff:view",
    "delivery_boy_reviews:view",
    "website_management:view",
    "gallery:view",
    "addons:view",
  ],
  manager: [
    // Limited access - no categories, customers, stores, website management
    "dashboard:view",
    "reports:view",
    "menu:view",
    "product_reviews:view",
    "orders:view",
    "order_history:view",
    "order_reviews:view",
    "order_tickets:view",
    "discounts:view",
    "staff:view",
    "delivery_boy_reviews:view",
    "gallery:view",
    "addons:view",
  ],
  delivery_boy: [
    // Only recent orders access
    "orders:view",
  ],
  kitchen: [
    // Only recent orders access (preparing orders)
    "orders:view",
  ],
};

/**
 * Route to permission mapping
 * Maps URL paths to required permissions
 */
export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  // Dashboard & Reports
  [routeConstants.dashboard]: "dashboard:view",
  [routeConstants.reports]: "reports:view",

  // Inventory
  [routeConstants.categories]: "categories:view",
  [routeConstants.subCategories]: "subcategories:view",
  [routeConstants.menuAndProducts]: "menu:view",
  [routeConstants.productDetails]: "menu:view",
  [routeConstants.productReviews]: "product_reviews:view",
  [routeConstants.addons]: "addons:view",

  // Orders
  [routeConstants.recentOrders]: "orders:view",
  [routeConstants.orderHistory]: "order_history:view",
  [routeConstants.orderDetails]: "orders:view",
  [routeConstants.createOrder]: "orders:view",
  [routeConstants.orderReviews]: "order_reviews:view",
  [routeConstants.orderTickets]: "order_tickets:view",

  // Customers
  [routeConstants.customerList]: "customers:view",
  [routeConstants.createCustomer]: "customers:view",
  [routeConstants.customerDetails]: "customers:view",
  [routeConstants.contactQueries]: "contact_queries:view",
  [routeConstants.reservationQueries]: "reservation_queries:view",

  // Discounts
  [routeConstants.discounts]: "discounts:view",
  [routeConstants.discountDetails]: "discounts:view",

  // Company Management
  [routeConstants.stores]: "stores:view",
  [routeConstants.storesView]: "stores:view",
  [routeConstants.storesDetails]: "stores:view",
  [routeConstants.staff]: "staff:view",
  [routeConstants.staffDetails]: "staff:view",
  [routeConstants.deliveryBoyReviews]: "delivery_boy_reviews:view",

  // Website Management
  [routeConstants.contactInfo]: "website_management:view",
  [routeConstants.openingHours]: "website_management:view",
  [routeConstants.socialMedia]: "website_management:view",
  [routeConstants.logos]: "website_management:view",
  [routeConstants.policies]: "website_management:view",
  [routeConstants.policyCreate]: "website_management:view",
  [routeConstants.policyEdit]: "website_management:view",
  [routeConstants.generalRatings]: "website_management:view",

  // Settings
  [routeConstants.gallery]: "gallery:view",
};

/**
 * Navigation path to permission mapping
 * Used for filtering sidebar items based on their route path
 */
export const NAV_PATH_PERMISSIONS: Record<string, Permission> = {
  // Top-level items
  [routeConstants.dashboard]: "dashboard:view",
  [routeConstants.reports]: "reports:view",
  [routeConstants.discounts]: "discounts:view",

  // Inventory children
  [routeConstants.categories]: "categories:view",
  [routeConstants.subCategories]: "subcategories:view",
  [routeConstants.menuAndProducts]: "menu:view",
  [routeConstants.productReviews]: "product_reviews:view",

  // Orders children
  [routeConstants.recentOrders]: "orders:view",
  [routeConstants.orderHistory]: "order_history:view",
  [routeConstants.orderReviews]: "order_reviews:view",
  [routeConstants.orderTickets]: "order_tickets:view",

  // Customers children
  [routeConstants.customerList]: "customers:view",
  [routeConstants.createCustomer]: "customers:view",
  [routeConstants.contactQueries]: "contact_queries:view",
  [routeConstants.reservationQueries]: "reservation_queries:view",

  // Company Management children
  [routeConstants.stores]: "stores:view",
  [routeConstants.staff]: "staff:view",
  [routeConstants.deliveryBoyReviews]: "delivery_boy_reviews:view",

  // Website Management children
  [routeConstants.contactInfo]: "website_management:view",
  [routeConstants.openingHours]: "website_management:view",
  [routeConstants.socialMedia]: "website_management:view",
  [routeConstants.logos]: "website_management:view",
  [routeConstants.policies]: "website_management:view",
  [routeConstants.generalRatings]: "website_management:view",

  // Settings children
  [routeConstants.gallery]: "gallery:view",
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (
  role: StaffRole | undefined,
  permission: Permission
): boolean => {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

/**
 * Check if a role can access a specific route
 * Handles dynamic routes by matching base patterns
 */
export const canAccessRoute = (
  role: StaffRole | undefined,
  routePath: string
): boolean => {
  if (!role) return false;

  // First check for exact match
  const permission = ROUTE_PERMISSIONS[routePath];
  if (permission) {
    return hasPermission(role, permission);
  }

  // For dynamic routes (e.g., /orders/123), check parent patterns
  // Match routes like /menu-and-products/edit/123 to /menu-and-products/:action/:productId
  for (const [pattern, perm] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pattern.includes(":")) {
      // Convert pattern to regex: /menu-and-products/:action/:productId -> /menu-and-products/[^/]+/[^/]+
      const regexPattern = pattern.replace(/:[^/]+/g, "[^/]+");
      const regex = new RegExp(`^${regexPattern}$`);
      if (regex.test(routePath)) {
        return hasPermission(role, perm);
      }
    }
  }

  // If no permission is defined for the route, allow access
  // This handles routes like /account that should be accessible to all
  return true;
};

/**
 * Check if the store filter dropdown should be hidden for this role
 * All non-admin roles should auto-use their assigned storeId
 * Only admin (owner) can see and use the store filter dropdown
 */
export const shouldHideStoreFilter = (role: StaffRole | undefined): boolean => {
  // Only admin can see the store filter, all other roles use their assigned store
  return role !== "admin";
};

/**
 * Get the effective storeId to use in API calls
 * For non-admin roles (manager, delivery_boy, kitchen): always use their assigned storeId
 * For admin (owner): use the selected storeId from dropdown
 */
export const getEffectiveStoreId = (
  role: StaffRole | undefined,
  userStoreId: string | undefined,
  selectedStoreId: string
): string | undefined => {
  // All non-admin roles use their assigned store
  if (role !== "admin" && userStoreId) {
    return userStoreId;
  }
  return selectedStoreId || undefined;
};
