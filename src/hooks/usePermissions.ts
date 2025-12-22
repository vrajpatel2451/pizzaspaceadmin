import { useCallback, useMemo } from "react";
import { useAuth } from "./useAuth";
import {
  canAccessRoute,
  getEffectiveStoreId,
  hasPermission,
  shouldHideStoreFilter,
  type Permission,
} from "@/config/permissions";

/**
 * Hook for checking user permissions based on their role
 * Provides utilities for permission checking, route access, and store filtering
 */
export const usePermissions = () => {
  const { user } = useAuth();
  const role = user?.role;
  const userStoreId = user?.storeId;

  /**
   * Check if the current user has a specific permission
   */
  const checkPermission = useCallback(
    (permission: Permission): boolean => {
      return hasPermission(role, permission);
    },
    [role],
  );

  /**
   * Check if the current user can access a specific route
   */
  const checkRouteAccess = useCallback(
    (routePath: string): boolean => {
      return canAccessRoute(role, routePath);
    },
    [role],
  );

  /**
   * Whether the store filter dropdown should be hidden for this user
   */
  const hideStoreFilter = useMemo(() => {
    return shouldHideStoreFilter(role);
  }, [role]);

  /**
   * Get the effective storeId to use in API calls
   * For managers: always returns their assigned storeId
   * For owners: returns the provided selectedStoreId
   */
  const getStoreId = useCallback(
    (selectedStoreId: string): string | undefined => {
      return getEffectiveStoreId(role, userStoreId, selectedStoreId);
    },
    [role, userStoreId],
  );

  // Role convenience flags
  const isOwner = useMemo(() => role === "admin", [role]);
  const isManager = useMemo(() => role === "manager", [role]);
  const isDeliveryBoy = useMemo(() => role === "delivery_boy", [role]);
  const isKitchen = useMemo(() => role === "kitchen", [role]);

  return {
    /** Current user's role */
    role,
    /** Current user's assigned store ID (for managers) */
    userStoreId,
    /** Check if user has a specific permission */
    checkPermission,
    /** Check if user can access a route */
    checkRouteAccess,
    /** Whether to hide the store filter dropdown */
    hideStoreFilter,
    /** Get effective storeId for API calls */
    getStoreId,
    /** Is user an admin (owner) */
    isOwner,
    /** Is user a store manager */
    isManager,
    /** Is user a delivery boy */
    isDeliveryBoy,
    /** Is user kitchen staff */
    isKitchen,
  };
};
