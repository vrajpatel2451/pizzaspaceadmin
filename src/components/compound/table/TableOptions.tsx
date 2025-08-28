// import * as LucideIcons from "lucide-react";
// import MenuItem from "../MenuItem";
// import { Popover } from "../Popover";
// import { IconButton } from "@/components/base/IconButton";
// import {
//   PermissionTypeEnum,
//   type PermissionFeaturesEnum,
// } from "@/features/roles-permissions/types";

// type ActionType = "view" | "edit" | "delete";

// type PermissionsMap = {
//   [feature in PermissionFeaturesEnum]: {
//     [permission in PermissionTypeEnum]?: boolean;
//   };
// };

// const ActionPermissions: Record<ActionType, PermissionTypeEnum> = {
//   view: PermissionTypeEnum.read,
//   edit: PermissionTypeEnum.write,
//   delete: PermissionTypeEnum.delete,
// };

// const hasPermission = (
//   permissions: PermissionsMap,
//   feature: PermissionFeaturesEnum,
//   type: PermissionTypeEnum,
// ): boolean => {
//   return permissions?.[feature]?.[type] ?? false;
// };

// export interface TableOptionsProps {
//   feature: PermissionFeaturesEnum;
//   permissions: PermissionsMap;

//   onView?: () => void;
//   onEdit?: () => void;
//   onDelete?: () => void;
// }

// const TableOptions = ({
//   feature,
//   permissions,
//   onView,
//   onEdit,
//   onDelete,
// }: TableOptionsProps) => {
//   const actions: {
//     key: ActionType;
//     label: string;
//     onClick?: () => void;
//     icon: keyof typeof LucideIcons;
//   }[] = [
//     { key: "view", label: "View", onClick: onView, icon: "Eye" },
//     { key: "edit", label: "Edit", onClick: onEdit, icon: "Pencil" },
//     { key: "delete", label: "Delete", onClick: onDelete, icon: "Trash" },
//   ];

//   const availableActions = actions.filter(({ key, onClick }) => {
//     const requiredPermission = ActionPermissions[key];
//     return onClick && hasPermission(permissions, feature, requiredPermission);
//   });

//   if (availableActions.length === 0) return null;

//   return (
//     <Popover trigger={<IconButton icon={LucideIcons.Ellipsis} noDefaultFill />}>
//       <div className="menu-items">
//         {availableActions.map(({ key, label, onClick, icon }) => (
//           <MenuItem key={key} onClick={onClick} startIcon={icon}>
//             {label}
//           </MenuItem>
//         ))}
//       </div>
//     </Popover>
//   );
// };

// export default TableOptions;
