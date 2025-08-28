import {
  PermissionTypeEnum,
  type PermissionFeaturesEnum,
} from "@/features/roles-permissions/types";
import type { UserPermissions } from "@/features/roles-permissions/types/roles.types";

export const hasAccess = (
  feature: PermissionFeaturesEnum,
  permissions: UserPermissions,
  actionTypes: PermissionTypeEnum[],
): boolean => {
  const featurePermissions = permissions[feature];
  if (!featurePermissions) return false;
  return actionTypes.some(
    (actionType) => featurePermissions[actionType] === true,
  );
};

export const getFeaturePermissions = (
  feature: PermissionFeaturesEnum,
  permissions: UserPermissions,
) => ({
  canRead: hasAccess(feature, permissions, [PermissionTypeEnum.read]),
  canWrite: hasAccess(feature, permissions, [
    PermissionTypeEnum.read,
    PermissionTypeEnum.write,
  ]),
  canDelete: hasAccess(feature, permissions, [
    PermissionTypeEnum.read,
    PermissionTypeEnum.delete,
  ]),
  canDoEverything: hasAccess(feature, permissions, [
    PermissionTypeEnum.read,
    PermissionTypeEnum.write,
    PermissionTypeEnum.delete,
  ]),
});
