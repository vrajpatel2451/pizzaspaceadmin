# Pizza Admin Panel

React + TypeScript admin panel for FoodBoss pizza/food delivery business, built with Vite. Manages inventory, orders, discounts, stores, staff, customers, and website configuration.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit, Zustand
- **Forms**: react-hook-form + Zod validation
- **API**: Axios with custom BaseApiService
- **Routing**: React Router with custom route registration system
- **Deployment**: Blue-Green deployment via GitHub Actions

## Development

### Prerequisites

- Node.js 20+
- Yarn

### Setup

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview

# Lint code
yarn lint
```

### Environment Variables

Create a `.env` file:

```env
VITE_SERVER_URL=http://localhost:3000/api/v1
VITE_BACKEND_URL=http://localhost:3000
```

## Deployment

This project uses **blue-green deployment strategy** for zero-downtime deployments.

### How It Works

1. **Build in CI**: GitHub Actions builds the app with production environment variables
2. **Archive & Upload**: Build artifacts are compressed and uploaded to server
3. **Versioned Releases**: Each deployment creates a timestamped release directory
4. **Atomic Symlink Switch**: Nginx serves from a symlink that switches instantly to new release
5. **Automatic Cleanup**: Keeps last 5 releases for quick rollback
6. **Zero Downtime**: Users never experience deployment interruptions

### Deployment Flow

```
┌─────────────────────┐
│  Push to main       │
└──────────┬──────────┘
           │
┌──────────▼──────────────────┐
│  GitHub Actions             │
│  - Build React app          │
│  - Create build.tar.gz      │
└──────────┬──────────────────┘
           │
┌──────────▼──────────────────┐
│  Server                     │
│  /root/pizza-admin/         │
│  ├── releases/              │
│  │   ├── 20250118_140000/   │
│  │   ├── 20250118_145000/   │
│  │   └── 20250118_150000/ ← New │
│  └── dist → releases/...    │ (Symlink)
└─────────────────────────────┘
```

### GitHub Configuration

**Required Secrets** (Settings → Secrets and variables → Actions → Secrets):
- `SERVER_HOST` - Your server IP/hostname
- `SERVER_USER` - SSH user (typically `root`)
- `SSH_PRIVATE_KEY` - SSH private key for authentication
- `SERVER_PORT` - SSH port (optional, defaults to 22)

**Required Variables** (Settings → Secrets and variables → Actions → Variables):
- `VITE_SERVER_URL` - Production API URL (e.g., `https://api.pizzaspace.co.uk/api/v1`)
- `VITE_BACKEND_URL` - Production backend URL (e.g., `https://api.pizzaspace.co.uk`)

### Server Requirements

**Nginx Configuration**:
```nginx
server {
    server_name admin.pizzaspace.co.uk;

    # Points to symlink that switches between releases
    root /root/pizza-admin/dist;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache index.html
    location = /index.html {
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        expires 0;
    }

    # ... SSL configuration
}
```

### Manual Rollback

If a deployment fails, SSH to server and rollback:

```bash
ssh root@YOUR_SERVER

# List releases
ls -lt /root/pizza-admin/releases/

# Switch to previous release
ln -sfn /root/pizza-admin/releases/PREVIOUS_TIMESTAMP/dist /root/pizza-admin/dist

# Reload Nginx
nginx -s reload
```

### Deployment Workflow

See `.github/workflows/deploy.yml` for full implementation.

**Key Features**:
- Builds in CI (not on production server)
- 15-minute timeout protection
- Yarn caching for faster builds
- Automatic old release cleanup
- Permission management (www-data)
- Nginx config validation before reload

## Project Structure

```
src/
├── components/
│   ├── base/              # Primitive components (Button, Input, etc.)
│   ├── compound/          # Complex reusables (Dialog, Table, Card)
│   └── common-form-fields/
├── features/              # Domain-organized features
│   ├── inventory/
│   ├── orders/
│   ├── discount/
│   └── ...
├── infrastructure/        # API services (BaseApiService, etc.)
├── routes/               # Custom route registration system
├── store/                # Redux Toolkit store
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
└── logger/               # Logging + Sentry integration
```

## Key Architectural Patterns

### Custom Route Registration
Routes are centrally managed via `routeHandler` singleton with metadata for conditional UI rendering (sidebar, header, back button).

### API Layer
All API services extend `BaseApiService` which automatically injects auth tokens and handles common error cases.

### Data Fetching
Custom `useDataFetch` hook provides consistent API call patterns with loading/error states.

## Additional Documentation

- **Component Catalog**: See `docs/COMPONENT_CATALOG.md` for all 60+ components
- **Development Guide**: See `CLAUDE.md` for detailed architecture patterns

## License

Proprietary - FoodBoss Admin Panel
