import type { NavItemTypes } from "../components/shared/sidebar/NavItem";
import { ROUTES } from "./routes";

export const NAV_ITEMS: NavItemTypes[] = [
  {
    label: "Dashboard",
    path: ROUTES.DASHBOARD,
    icon: "LayoutDashboard",
  },
  {
    label: "Category",
    icon: "Layers",
    children: [
      {
        label: "Parent Category",
        path: ROUTES.CATEGORY.PARENT_CATEGORY.ROOT,
      },
      {
        label: "Child Category",
        path: ROUTES.CATEGORY.CHILD_CATEGORY.ROOT,
      },
    ],
  },
  {
    label: "Settings",
    icon: "Settings",
    children: [
      {
        label: "Staff",
        path: ROUTES.SETTINGS.STAFF.ROOT,
      },
      {
        label: "Roles & Permissions",
        path: ROUTES.SETTINGS.ROLES_PERMISSIONS.ROOT,
      },
    ],
  },
];
