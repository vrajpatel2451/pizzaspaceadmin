export const ROUTES = {
  DASHBOARD: "/dashboard",
  CATEGORY: {
    PARENT_CATEGORY: {
      ROOT: `/category/parent-category`,
      ADD: `/category/parent-category/add`,
      EDIT: (categoryId: string) =>
        `/category/parent-category/edit/${categoryId}`,
    },
    CHILD_CATEGORY: {
      ROOT: `/category/child-category`,
      ADD: `/category/child-category/add`,
      EDIT: (categoryId: string) =>
        `/category/child-category/edit/${categoryId}`,
    },
  },
  SETTINGS: {
    ROOT: `/settings`,
    STAFF: {
      ROOT: `/settings/staff`,
      ADD: `/settings/staff/add`,
      EDIT: (staffId: string) => `/settings/staff/edit/${staffId}`,
    },
    ROLES_PERMISSIONS: {
      ROOT: `/settings/roles-permissions`,
      ADD: `/settings/roles-permissions/add`,
      EDIT: (roleId: string) => `/settings/roles-permissions/edit/${roleId}`,
    },
  },
  UNAUTHORIZED: "/unauthorized",
  LOGIN: `/login`,
};
