import { useState, useCallback, useMemo } from "react";
import { usePermissions } from "./usePermissions";
import { useAuth } from "./useAuth";

/**
 * Hook for handling store filtering with RBAC awareness
 *
 * For non-admin roles (manager, delivery_boy, kitchen): automatically uses their assigned storeId
 * For admin (owner): allows selection from dropdown
 *
 * @example
 * ```tsx
 * const { displayStoreId, effectiveStoreId, hideStoreDropdown, onStoreChange } = useStoreFilter();
 *
 * // In query effect:
 * useEffect(() => {
 *   setQuery(prev => ({ ...prev, storeId: effectiveStoreId }));
 * }, [effectiveStoreId]);
 *
 * // In JSX:
 * {!hideStoreDropdown && (
 *   <RBACStoreDropdown storeId={displayStoreId} onChange={onStoreChange} />
 * )}
 * ```
 */
export const useStoreFilter = () => {
  const { hideStoreFilter, getStoreId, userStoreId, isOwner, role } =
    usePermissions();
  const { isAppLoading } = useAuth();
  const [selectedStoreId, setSelectedStoreId] = useState("");

  /**
   * Whether the store filter is ready to be used
   * This prevents double API calls by waiting for auth to load
   */
  const isReady = useMemo(() => {
    return !isAppLoading && role !== undefined;
  }, [isAppLoading, role]);

  /**
   * The effective storeId to use in API calls
   * For non-admin roles: their assigned storeId
   * For admin (owner): the selected storeId or undefined (all stores)
   */
  const effectiveStoreId = useMemo(() => {
    return getStoreId(selectedStoreId);
  }, [getStoreId, selectedStoreId]);

  /**
   * Handler for StoreDropdown onChange
   * Only admin can change store - all other roles have fixed storeId
   */
  const onStoreChange = useCallback(
    (storeId: string) => {
      if (isOwner) {
        setSelectedStoreId(storeId);
      }
    },
    [isOwner]
  );

  /**
   * Reset the selected store filter
   * Only works for admin (owner) role
   */
  const resetStoreFilter = useCallback(() => {
    if (isOwner) {
      setSelectedStoreId("");
    }
  }, [isOwner]);

  return {
    /**
     * The storeId to display in dropdown
     * For non-admin roles: their assigned storeId (though dropdown is hidden)
     * For admin (owner): the currently selected storeId
     */
    displayStoreId: isOwner ? selectedStoreId : userStoreId || "",

    /**
     * The storeId to use in API calls
     * This is the value that should be passed to query params
     */
    effectiveStoreId,

    /**
     * Whether to hide the store dropdown
     * True for all non-admin roles (they use their assigned store)
     */
    hideStoreDropdown: hideStoreFilter,

    /**
     * Handler for store selection change
     */
    onStoreChange,

    /**
     * Reset function for clearing store filter
     */
    resetStoreFilter,

    /**
     * Raw selected value (for internal use)
     */
    selectedStoreId,

    /**
     * Whether the store filter is ready (auth loaded)
     * Use this to prevent fetching until store filter is initialized
     */
    isReady,
  };
};
