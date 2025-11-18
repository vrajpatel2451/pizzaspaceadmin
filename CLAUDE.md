# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React + TypeScript admin panel for a pizza/food delivery business (FoodBoss Admin), built with Vite. Manages inventory, orders, discounts, stores, staff, customers, and website configuration.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production (runs tsc -b && vite build)
npm run lint     # Lint code with ESLint
npm run preview  # Preview production build on port 5173
```

## Architecture

### Custom Route Registration System

This app uses a centralized route management system instead of standard React Router patterns:

- **Route Handler** (`src/routes/routeHendler.tsx`): Singleton class that registers all routes with metadata
- Routes are registered via `routeHandler.registerPrivateRoute()` or `routeHandler.registerPublicRoute()` in `src/routes/PrivateRoutes.tsx` and `PublicRoutes.tsx`
- Each route has options: `hideSideBar`, `hideHeader`, `hideBackButton`, `shouldIncludeInNavigation`, `hideCartButton`
- `RouterComponent` dynamically renders registered routes and conditionally shows sidebar/header based on route metadata
- Navigation items (`src/constants/navItems.ts`) are separate from route definitions

**Adding a new route:**

1. Add constant to `src/routes/routeConstants.ts`
2. Register in `src/routes/PrivateRoutes.tsx` with `routeHandler.registerPrivateRoute()`
3. If sidebar item needed, add to `src/constants/navItems.ts`

### API Layer Pattern

Centralized API infrastructure with automatic token injection:

- **BaseApiService** (`src/infrastructure/BaseApi.ts`): Axios wrapper with request interceptors
  - Automatically adds `Authorization: Bearer {token}` header from localStorage (`staff_access_token`)
  - Configured via `VITE_SERVER_URL` environment variable
  - Provides typed methods: `get()`, `post()`, `put()`, `patch()`, `delete()`
- Domain-specific services extend BaseApiService (e.g., `ProductApiService`, `StoreApiService`, `CartApiService`)
- All API services instantiated as singletons and exported

**Pattern for new API service:**

```typescript
class NewApiService extends BaseApiService {
  constructor() {
    super(apiConfig);
  }

  getItems = (params) => this.get<ResponseType>("/endpoint", params);
  createItem = (data) => this.post<ResponseType>("/endpoint", data);
}

export const newApiService = new NewApiService();
```

### Data Fetching Convention

Custom `useDataFetch` hook (`src/hooks/useDataFetch.ts`) wraps all API calls:

- Returns: `{ data, isFetching, isError, isSuccess, errorMessage, refetch, setData }`
- Auto-fetches on mount unless `disableAutoFetch` is true
- Handles unmounting to prevent state updates
- Feature-specific hooks (in `src/features/{domain}/hooks/`) wrap API services with `useDataFetch`

**Example pattern:**

```typescript
export const useFetchItems = (params) => {
  const fetchFn = useCallback(
    () => itemApiService.getItems(params),
    [params]
  );

  return useDataFetch(fetchFn, { data: [], isFetching: false, ... });
};
```

### Feature Organization

Features are domain-organized with consistent structure:

```
src/features/{domain}/
  ├── {Domain}Screen.tsx        # Main screen
  ├── components/               # Domain-specific components
  ├── hooks/                    # Data fetching hooks (useFetch*, use*)
  └── types/                    # Domain types (optional, usually in src/types/)
```

Examples: `src/features/inventory/`, `src/features/discount/`, `src/features/cart/`

### State Management

- **Redux Toolkit** (`src/store/store.ts`): Global state for `auth` and `imageZoom`
  - Use `useAppSelector` and `useAppDispatch` (typed hooks)
  - Reducers in `src/store/reducers/`, types in `src/store/types/`
- **Zustand**: Available for local state (check specific features)
- **react-hook-form**: Form state with Zod validation

### Component Hierarchy

1. **Base** (`src/components/base/`): Primitives (Button, Input, Select, Checkbox, Switch)
2. **Compound** (`src/components/compound/`): Reusable composites (Dialog, Table, Card, MediaPicker, Pagination)
3. **Feature** (`src/features/{domain}/`): Domain screens and components

### Component Documentation

Comprehensive component catalog available at [`docs/COMPONENT_CATALOG.md`](./docs/COMPONENT_CATALOG.md). This catalog documents all 60+ components with:

- Detailed prop interfaces and types
- Component descriptions and purposes
- Usage examples and patterns
- Key features and behaviors
- Related component references

**Component Categories:**

- Base Components (10) - Button, Input, Select, Checkbox, Switch, etc.
- Compound Components (40+) - Dialog, Table, Card, Tabs, Sheet, Popover, etc.
- Common Form Fields (1) - AmountTypeInput
- Shared/Layout (6) - Header, Sidebar, NavItem, etc.
- Icons & Utilities - WindowsFileIcon, getButtonColor

This catalog serves as an MCP resource for understanding the complete component library and their APIs.

### Logging System

Custom logger integrated with Sentry (`src/logger/`):

- Use `logger.info()`, `logger.error()`, `logger.warn()`, `logger.debug()`, `logger.critical()`
- API calls auto-logged via Axios interceptor (`src/logger/interceptor.ts`)
- Logs sent to console (dev) and Sentry (prod)
- App wrapped in `ErrorBoundary` (`src/logger/ErrorBoundry`)

### Drag and Drop

Uses `@dnd-kit` for reordering:

- Implemented in Menu screen for categories/products/subcategories
- See `*DragSection` components in `src/features/inventory/components/`

## Key Technical Patterns

### Authentication

- JWT token stored as `staff_access_token` in localStorage
- `useAuth` hook manages auth state and validation
- `PrivateRoute` component protects authenticated routes

### Forms

- `react-hook-form` + Zod schemas (`@hookform/resolvers/zod`)
- Common fields in `src/components/common-form-fields/`
- Pattern: `{Entity}Form.tsx` components

### Types

- Response types: `BaseApiResponse<T>` (`src/types/baseApi.types.ts`)
- Domain types organized in `src/types/{domain}.types.ts`
- Path alias: `@/` → `src/`

### Styling

- Tailwind CSS v4
- Utilities: `clsx`, `tailwind-merge`

## Environment Variables

Required in `.env`:

- `VITE_SERVER_URL`: API base URL (e.g., `http://localhost:3000/api/v1`)
- `VITE_BACKEND_URL`: Backend base URL (e.g., `http://localhost:3000`)

## Deployment

### Blue-Green Deployment Strategy

This project uses **blue-green deployment** via GitHub Actions for zero-downtime deployments.

**Key Characteristics:**
- Builds in CI (GitHub Actions), not on production server
- Creates timestamped release directories: `/root/pizza-admin/releases/YYYYMMDD_HHMMSS/`
- Uses atomic symlink switching for instant cutover
- Keeps last 5 releases for quick rollback
- Deployment time: ~30-40 seconds (vs ~5 minutes with git-based builds)

**Workflow** (`.github/workflows/deploy.yml`):
1. Triggered on push to `main` branch
2. Builds React app with production env vars from GitHub Variables
3. Creates `build.tar.gz` archive
4. Uploads to server `/tmp/` via SCP
5. SSH script extracts to new release directory
6. Sets permissions (`www-data:www-data`)
7. Atomic symlink switch: `ln -sfn NEW_RELEASE/dist /root/pizza-admin/dist`
8. Cleans up old releases (keeps last 5)
9. Reloads Nginx

**Server Structure:**
```
/root/pizza-admin/
├── .git/                    # Git repo (for convenience)
├── releases/                # Timestamped release directories
│   ├── 20250118_140000/
│   │   └── dist/           # Built React app
│   ├── 20250118_145000/
│   │   └── dist/
│   └── 20250118_150000/    # Latest
│       └── dist/
└── dist → releases/20250118_150000/dist  # Symlink (Nginx serves this)
```

**GitHub Secrets Required:**
- `SERVER_HOST` - Server IP/hostname
- `SERVER_USER` - SSH user (root)
- `SSH_PRIVATE_KEY` - SSH private key
- `SERVER_PORT` - SSH port (optional, defaults to 22)

**GitHub Variables Required:**
- `VITE_SERVER_URL` - Production API URL (e.g., `https://api.pizzaspace.co.uk/api/v1`)
- `VITE_BACKEND_URL` - Production backend URL (e.g., `https://api.pizzaspace.co.uk`)

**Nginx Configuration:**
- Points to symlink: `root /root/pizza-admin/dist;`
- The symlink is switched atomically during deployment
- No Nginx downtime or connection drops

**Rollback Process:**
```bash
# SSH to server
ssh root@SERVER

# List releases
ls -lt /root/pizza-admin/releases/

# Switch symlink to previous release
ln -sfn /root/pizza-admin/releases/PREVIOUS_TIMESTAMP/dist /root/pizza-admin/dist

# Reload Nginx
nginx -s reload
```

**Advantages over Git-Based Deployment:**
- ✅ Zero server load during build (builds in CI)
- ✅ Consistent builds (same environment every time)
- ✅ Instant rollback capability
- ✅ No `node_modules` on production server
- ✅ Faster deployments (30s vs 5min)
- ✅ Better for shared CPU environments

## Adding a New Feature Domain

1. Create `src/features/{domain}/` directory
2. Create API service: `src/infrastructure/{Domain}ApiService.ts` extending `BaseApiService`
3. Add types: `src/types/{domain}.types.ts`
4. Create data hooks: `src/features/{domain}/hooks/useFetch*.tsx` using `useDataFetch`
5. Create screen: `src/features/{domain}/{Domain}Screen.tsx`
6. Register route in `src/routes/PrivateRoutes.tsx`
7. Add navigation item to `src/constants/navItems.ts` if needed

### Additional Resources

1. Component Catalog - [.docs/COMPONENT_CATALOG.md] - listed all components here.
