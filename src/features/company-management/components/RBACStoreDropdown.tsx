import { usePermissions } from "@/hooks/usePermissions";
import type { FC } from "react";
import StoreDropdown from "./StoreDropdown";
import type { StoreResponse } from "../types/StoreTypes";
import type { CustomSelectProps } from "@/components/base/Select";

type RBACStoreDropdownProps = {
  intStore?: StoreResponse;
  storeId: string;
  onChange: (storeId: string) => void;
  error?: string;
  variant?: CustomSelectProps["variant"];
  label?: string;
  allowAll?: boolean;
};

/**
 * RBAC-aware store dropdown wrapper
 * - Hidden for managers (they use their assigned store)
 * - Visible for owners (can select any store)
 *
 * Use this component in screens that have store filters.
 * For managers, this returns null and the parent component should
 * use the useStoreFilter hook to get the effective storeId.
 */
const RBACStoreDropdown: FC<RBACStoreDropdownProps> = (props) => {
  const { hideStoreFilter } = usePermissions();

  // Don't render for managers - they use their assigned store
  if (hideStoreFilter) {
    return null;
  }

  return <StoreDropdown {...props} />;
};

export default RBACStoreDropdown;
