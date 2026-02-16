# Race Results Platform

A multi-tenant motorsports results and live-timing platform built with Next.js, providing real-time race results, event management, and organization administration.

## 🎯 Overview

This platform enables motorsports organizations to:

- Display live timing and results for autocross and rallycross events
- Manage multiple organizations (tenants) with isolated data
- Integrate with MotorsportReg.com for event data
- Provide personalized driver statistics dashboards
- Administer organizations and users at global and tenant levels

## ✨ Features

### Live Timing System

- **Class Results** - View results grouped by car class with expandable run details
- **PAX Results** - PAX-adjusted standings across all classes (configurable per organization)
- **Raw Results** - Raw time standings for all drivers
- **Work/Run Order** - Display work and run assignments by class (configurable per organization)
- **Personal Stats Dashboard** - Individual driver statistics with visualizations
    - Position tracking (Class, PAX, Raw)
    - Run statistics (total runs, clean runs, cones, DNFs)
    - Time distribution charts
    - Class times visualization
- **Feature Flags** - Organization-level feature toggles for customizing available functionality

### Multi-Tenancy

- **Organization Isolation** - Each organization has isolated data and configuration
- **Path-based Routing** - `/t/[orgSlug]` for tenant-scoped routes
- **Global Configuration** - Shared settings with org-specific overrides
- **Tenant Guards** - Automatic tenant validation and routing

### Event Management

- **Organization Events** - Admins can create, edit, and delete events per organization (single-day or multi-day) via the Calendar tab in org admin
- **Tenant Event Schedule** - Organization pages (`/t/[orgSlug]`) show **Upcoming** and **Past** events; org events are merged with MotorsportReg when the org has a MotorsportReg ID (org data takes precedence for same-date matches)
- **Public Events** - `/events` lists upcoming and past events from all organizations in one view, with each event labeled by organization
- **MotorsportReg Integration** - Fetch events and calendars from MotorsportReg.com; merged with org events for a unified schedule

### Administration

- **Global Admin** (`/admin`) - Platform-wide administration with org-scoped sidebar
    - **Organization** (`/admin`) - Org dashboard: Organization Information (name, slug, description, header image, profile icon, MotorsportReg ID, public visibility). Profile icon appears in the sidebar org switcher and on public/tenant pages.
    - **Calendar** (`/admin/calendar`) - Create, edit, and delete org events; link to MotorsportReg events; schedule shown on the org's tenant page and merged with MotorsportReg when configured
    - **Users** (`/admin/users`) - View all users; edit display names; assign/remove global roles; delete users (soft delete)
    - **API Keys** (`/admin/api-keys`) - Generate, disable, and view API key history per organization
    - **Feature Flags** (`/admin/feature-flags`) - Toggle PAX Results and Work/Run Order per organization
    - **Base Classes** (`/admin/classes`) - Global car class configuration (admin only)
    - **Class Groups** (`/admin/class-groups`) - Group base classes per organization for event registration and results

### API Access

- **API Key Management** - Secure API access for organizations
    - Generate and manage API keys per organization
    - Enable/disable API access
    - View API key history
    - Secure key validation for API requests

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Authentication**: Clerk
- **Database**: Neon Postgres
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Deployment**: Vercel

### Project Structure

The project follows a **page-centric architecture** where components are organized near the pages that use them, with design system components at the top level.

```
src/
├── ui/                          # Design system components (top level)
│   ├── button.tsx              # Base UI components
│   ├── button-wrapper.tsx      # Wrapper components
│   ├── link-button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...                     # All design system components
├── app/                         # Next.js App Router
│   ├── (global-admin)/         # Global admin routes
│   │   └── admin/
│   │       ├── _lib/components/    # Sidebar, create-org-dialog
│   │       ├── (organization)/     # Org-scoped: same slug from layout
│   │       │   ├── page.tsx        # Organization dashboard (General)
│   │       │   ├── (general)/      # Org info, header + profile icon upload
│   │       │   ├── calendar/       # Org events CRUD, seasons, link MSR
│   │       │   ├── api-keys/      # API key management
│   │       │   ├── feature-flags/ # Feature flag toggles
│   │       │   └── class-groups/  # Class groups for org
│   │       └── (global)/           # Platform-wide (admin only)
│   │           ├── users/          # All users, roles
│   │           └── classes/       # Base classes
│   ├── (global-api)/           # Global API routes (no auth required)
│   │   └── api/
│   │       └── ingest/         # Data ingestion endpoints
│   │           └── [orgSlug]/
│   │               ├── live/    # Live timing data ingestion
│   │               └── results/ # Results data ingestion
│   ├── (public)/                # Public routes
│   │   ├── page.tsx            # Landing page
│   │   └── events/             # Public events (all organizations)
│   │       ├── page.tsx
│   │       └── _lib/
│   │           └── all-clubs-events.ts
│   ├── (tenants)/               # Tenant-scoped routes
│   │   └── t/[orgSlug]/
│   │       ├── live/            # Live timing system
│   │       │   ├── _lib/        # Page-specific code (underscore prevents routing)
│   │       │   │   ├── components/ # Page-specific components
│   │       │   │   ├── config/    # Configuration (API endpoints, feature flags)
│   │       │   │   ├── context/   # React Context
│   │       │   │   ├── data/      # Data fetching utilities
│   │       │   │   ├── hooks/     # Custom hooks
│   │       │   │   ├── types.ts   # TypeScript types
│   │       │   │   └── utils/     # Utility functions
│   │       └── page.tsx        # Tenant home page (Upcoming / Past events)
│   │           └── _lib/
│   │               ├── components/  # EventCard, EventList, EventsSection, etc.
│   │               ├── events/      # merge-events.ts (org + MotorsportReg)
│   │               └── utils/       # date-utils.ts
│   └── components/              # App-level shared components
│       ├── profile-icon-image.tsx  # Shared org profile icon (sidebar, cards, tenant header)
│       ├── confirmation-dialog.tsx
│       └── shared/
│           └── layout/          # Shared layout components
│               ├── app-header.tsx      # Shared header (all pages)
│               ├── app-footer.tsx      # Footer (public pages)
│               ├── configuration-layout.tsx  # Admin layout with sidebar
│               └── sidebar-navigation.tsx     # Sidebar navigation
├── db/                          # Database
│   ├── tables/                  # Drizzle table definitions
│   ├── repositories/            # Data access layer (incl. org-events.repo)
│   ├── seed-data/               # org-events.json, orgs.json, etc.
│   └── seed.ts                  # Database seeding
├── dto/                         # Data Transfer Objects (incl. org-events)
├── services/                    # Business logic
│   ├── motorsportreg/           # MotorsportReg API service
│   ├── organizations/          # Organization service
│   │   ├── organization.service.ts
│   │   └── organization.admin.service.ts  # Admin operations
│   ├── feature-flags/           # Feature flags service
│   ├── tenants/                 # Tenant service
│   └── users/                   # User service
├── hooks/                       # Custom React hooks
│   └── admin/
│       └── use-api-key-actions.ts  # API key management hook
├── lib/                         # Shared utilities
└── context/                     # React Context providers
```

#### Architecture Principles

- **Page-Centric**: Components are organized near the pages that use them
    - Admin components: `app/(global-admin)/admin/_lib/components/`
    - Live timing components: `app/(tenants)/t/[orgSlug]/live/_lib/components/`
    - App-level shared: `app/components/shared/`
- **Design System at Top Level**: All reusable UI components in `/src/ui/`
- **Import Paths**: Use `@/ui/*` for design system, `@/app/*` for page components

### Multi-Tenancy Architecture

#### Tenant Resolution

- **Path-based**: `/t/[orgSlug]` routes
- **Header-based**: `x-tenant-slug` request header
- **Future**: Subdomain-based routing support

#### Data Isolation

- `org_id = NULL` represents global/default configuration
- Org-specific rows override global rows
- Tenant context passed via headers, never inferred from URL in components

#### Routing Conventions

- **Tenant routes**: `/t/[orgSlug]/*` (home page shows Upcoming / Past events)
- **Tenant admin**: `/t/[orgSlug]/admin/*`
- **Public events**: `/events` - All organizations’ events in one list
- **Global admin**: `/(global-admin)/admin/*`
- **Global API**: `/(global-api)/api/*` - Public API endpoints for data ingestion
- **Route guards**: Enforced in `layout.tsx` files as well as `proxy.ts`

### Shared Layout System

The application uses a consistent header across all pages for unified navigation and branding:

- **AppHeader** (`app/components/shared/layout/app-header.tsx`):
    - Shared header component used by all layouts
    - Includes branding, navigation links, admin button, and user authentication
    - Supports optional sidebar trigger for mobile navigation
- **Layout Structure**:
    - **Public Layout**: Header + Footer (for public pages)
    - **Tenant Layout**: Header only (for tenant pages)
    - **Admin Layout**: Header + Sidebar (for admin pages with mobile support)
- **Responsive Design**:
    - Mobile sidebar trigger integrated into header
    - Sidebar positioned below header (no overlap)
    - Consistent navigation across all screen sizes

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Neon Postgres database
- Clerk account (for authentication)
- (Optional) MotorsportReg API credentials

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd race-results
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env.local
    ```

    Required environment variables:

    ```env
    # Database
    DATABASE_URL=postgresql://...

    # Clerk Authentication
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
    CLERK_SECRET_KEY=sk_...

    # MotorsportReg (optional)
    MOTORSPORTREG_API_KEY=...
    MOTORSPORTREG_USERNAME=...
    MOTORSPORTREG_PASSWORD=...

    # Upstash Redis connection details (required for live timing pages)
    UPSTASH_REDIS_REST_URL=...
    UPSTASH_REDIS_REST_TOKEN=...

    # A string that gets prepended to all cache keys to prevent clashing between environments (uses a single Redis instance currently)
    CACHE_ENV=...
    ```

4. **Set up the database**

`users.json` seeding data requires `.env` variables containing the values for `authProviderId`.

Envrionment variables will be matched in the format of `AUTHPROVIDER_ID_DisplayName`.

Example:

`users.json`:

```
{
  "displayName": "Ryan F"
}
```

`.env`:

```
AUTHPROVIDER_ID_RyanF=<clerk user id>
```

````bash
# Run migrations
pnpm drizzle-kit push

 # Seed database (optional)
 pnpm seed
 ```

5. **Start the development server**

 ```bash
 pnpm dev
 ```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Live Timing

#### Accessing Live Timing

1. Navigate to `/t/[orgSlug]/live` for a specific organization
2. Use the navigation to switch between:
 - **Class** - Class results
 - **PAX** - PAX standings (if enabled for organization)
 - **Raw** - Raw times
 - **Work/Run** - Work/run assignments (if enabled for organization)
 - **Me** - Personal stats dashboard

**Note**: PAX and Work/Run navigation items only appear if enabled for your organization.

### Events

#### Tenant Organization Page

1. Navigate to `/t/[orgSlug]` for a specific organization
2. **Upcoming Events** and **Past Events** sections show the org’s schedule
3. Events come from org events (admin Calendar) and MotorsportReg when the org has a MotorsportReg ID; same-date matches use org data
4. Use "View results" or sign-up links when available

#### Public Events Page

1. Navigate to `/events`
2. View upcoming and past events from **all** organizations in one list
3. Each event shows its organization name; use the links to go to the org page or event details

#### Personal Stats Dashboard

1. Navigate to `/t/[orgSlug]/live/me`
2. Select your name from the dropdown
3. View your:
 - Positions in class, PAX, and raw
 - Run statistics
 - Time distribution visualizations

#### Class Filtering

- Click class buttons to filter results
- Filter state persists in URL (shareable/bookmarkable)
- Click "Clear" to reset filters

### Organization Management

#### Creating an Organization

1. Navigate to global admin: `/admin`
2. Click "Create Organization"
3. Fill in organization details
4. Set MotorsportReg ID if applicable

#### Managing Organization Events (Calendar)

1. Navigate to global admin: `/admin` and open an organization
2. Open the **Calendar** tab
3. Create events: click "Create event", enter name and date(s), optionally enable multi-day and set end date
4. Edit events: click the pencil icon on a row
5. Delete events: click the trash icon and confirm (errors such as "Event not found or access denied" are shown in the dialog)
6. The schedule is shown on the organization’s tenant page (`/t/[orgSlug]`) and merged with MotorsportReg when the org has a MotorsportReg ID

#### Managing Organization Information (header & profile icon)

1. Navigate to global admin: `/admin` and select an organization (sidebar org switcher)
2. On the **Organization** dashboard, update name, description, MotorsportReg Org ID, and public visibility
3. **Header image**: Upload or remove; used on the public org card and tenant pages
4. **Profile icon**: Upload or remove; shown in the admin sidebar org switcher, public org cards, and tenant page header

#### Managing Users (Global Admin)

1. Navigate to global admin: `/admin/users`
2. View all users in the system
3. Click on a user to edit:
    - Update display name
    - Assign or remove roles (Standard User, Admin, etc.)
    - Delete user (soft delete - prevents self-deletion)
4. Users are automatically created when they register via Clerk webhook
5. All new users are automatically assigned the 'user' role

#### Configuring Feature Flags

1. Navigate to global admin: `/admin` and select an organization
2. Open the **Feature Flags** tab (or sidebar item)
3. Toggle features on/off for the organization:
 - **Enable PAX Results** - Shows PAX navigation and statistics
 - **Enable Work/Run Order** - Shows Work/Run navigation and assignments
4. Click "Save" to apply changes

#### Managing API Keys

1. Navigate to global admin: `/admin` and select an organization
2. Open the **API Keys** tab (or sidebar item)
3. **Generate New Key**: Creates a new API key and disables the previous one
4. **Disable Access**: Generates a new disabled key, revoking API access
5. **View History**: See all previous API keys for the organization
6. **Copy Key**: Click the copy button to copy the current API key to clipboard

**Note**: Only the most recent API key is active. Generating a new key automatically disables the previous one. API keys must be enabled (`api_key_enabled = true`) to work.

#### Using API Keys

API keys are used to authenticate requests to the data ingestion endpoints:

- **Header**: `X-API-Key: <your-api-key>`
- **Endpoints**: `/api/ingest/[orgSlug]/live` and `/api/ingest/[orgSlug]/results`
- **Security**: Keys are validated against the organization slug and must be enabled

## 🔧 Development

### Scripts

```bash
# Development
pnpm dev              # Start development server

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm precheck         # Run all quality checks (format, lint, prettier check, and tests)
pnpm lint             # Run ESLint, TypeScript check, and Prettier check
pnpm prettier:fix     # Format code with Prettier
pnpm prettier:check   # Check code formatting

# Testing
pnpm test             # Run tests once
pnpm test:watch       # Run tests in watch mode
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Run tests with coverage

# Database
pnpm seed             # Seed database with sample data
pnpm db:studio        # Open Drizzle Studio for database management
````

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with Next.js and Prettier
- **Prettier**: Code formatting
- **Tailwind CSS**: Utility-first styling

### Code Quality Checks

Before committing, it's recommended to run the following checks manually:

```bash
# Format code
pnpm prettier:fix

# Run linting and type checking
pnpm lint

# Run tests
pnpm test
```

These checks help maintain code quality and prevent broken code from being committed.

### Architecture Guidelines

- **Page-Centric Structure**: Organize components near the pages that use them
    - Page-specific components live alongside their pages
    - Shared components at app level: `app/components/shared/`
    - Design system components at top level: `ui/`
- **Shared Layout Components**:
    - `AppHeader` - Consistent header across all pages (public, tenant, admin)
    - `AppFooter` - Footer for public pages
    - `ConfigurationLayout` - Admin layout with sidebar and header
    - All layouts use the shared header for consistency
- **Server Components by Default**: Prefer server components
- **Client Components When Necessary**: Only use `"use client"` when needed
- **Isolated Computation**: Heavy computation (scoring, parsing) isolated from request/response
- **Minimal DB Writes**: Live timing uses Redis state
- **Explicit Types**: Clear, explicit TypeScript types
- **No Magic Globals**: Avoid global state inference
- **Tenant Context**: Always passed via headers, never inferred from URL
- **Import Conventions**:
    - Design system: `@/ui/*`
    - Page components: `@/app/(route-group)/path/components/*`
    - Shared components: `@/app/components/shared/*`

### Database

#### Migrations

```bash
# Generate migration
pnpm drizzle-kit generate

# Apply migration
pnpm drizzle-kit push
```

#### Schema

- **Organizations** (`orgs`): Organization data; `header_image_url` and `profile_icon_url` store Vercel Blob URLs for header and profile icon
- **Organization Events** (`org_events`): Per-organization event schedule (name, start_at, end_at); shown on tenant page and merged with MotorsportReg when org has MotorsportReg ID
- **Users** (`users`): User accounts (soft-deletable via `deletedAt`)
- **Roles** (`roles`): User roles and permissions
- **User Global Roles** (`user_global_roles`): Global role assignments for users
- **User Org Roles** (`user_org_roles`): Organization-specific role assignments
- **Feature Flags** (`feature_flags`): Organization-level feature toggles
- **Organization API Keys** (`org_api_keys`): API keys for organization authentication
- **Car Classes** (`classes_*`): Car class configuration

## 🔌 API Integration

### MotorsportReg Service

The platform integrates with MotorsportReg.com for event data.

#### Configuration

```typescript
import { motorsportRegService } from "@/services/motorsportreg/motorsportreg.service";

// Get organization calendar
const calendar = await motorsportRegService.getOrganizationCalendar(orgId, {
    exclude_cancelled: true,
});
```

See [MotorsportReg Service README](./src/services/motorsportreg/README.md) for full documentation.

### Live Timing Results API

The platform provides API endpoints for retrieving live timing results data:

#### Endpoints

- **GET** `/api/[orgSlug]/live/results/class` - Get class results
- **GET** `/api/[orgSlug]/live/results/indexed` - Get PAX (indexed) results
- **GET** `/api/[orgSlug]/live/results/raw` - Get raw results
- **GET** `/api/[orgSlug]/live/runwork` - Get work/run assignments

#### Authentication

These endpoints use Clerk authentication via cookies. When called from server components:

- Cookies are automatically forwarded from the incoming request
- Same-domain requests ensure cookies work properly
- Local development uses `http://localhost:3000` automatically
- Production uses the configured `APP_URL` or `VERCEL_URL`

#### Data Source

Results are served by `liveResultsService` which provides cached data from ingested live timing snapshots.

#### Usage

These endpoints are primarily used internally by the live timing pages, but can be accessed directly:

```typescript
// Example: Fetch class results
const response = await fetch("/api/my-org/live/results/class", {
    headers: {
        Cookie: document.cookie, // Include cookies for authentication
    },
});
const classResults = await response.json();
```

#### Configuration

The live timing system supports multiple data sources:

- **Local Files** (Development): Set `USE_LOCAL_FILES=true` to use JSON files from `/datasets/live-results/live/results/`
- **API Routes** (Production): Default behavior, fetches from the API routes listed above

See `src/app/(tenants)/t/[orgSlug]/live/README.md` for detailed configuration options.

#### Previous Configuration

Previously, live timing data was fetched from external API endpoints configured in:

- `src/app/(tenants)/t/[orgSlug]/live/lib/config.ts`

### Organization API

Organizations can access their data via API using API keys:

#### Authentication

API requests must include a valid API key in the request header:

```
X-API-Key: <api-key>
```

#### API Key Validation

The platform validates API keys by:

- Checking the organization slug matches the key
- Verifying the key is the most recent key for the organization
- Ensuring the key is enabled (`api_key_enabled = true`)

See `src/db/repositories/organizations.api.repo.ts` for validation logic.

### Data Ingestion API

The platform provides public API endpoints for ingesting live timing and results data:

#### Endpoints

- **POST** `/api/ingest/[orgSlug]/live` - Ingest live timing data
- **POST** `/api/ingest/[orgSlug]/results` - Ingest results data

#### Authentication

These endpoints require API key authentication via the `X-API-Key` header. The API key must:

- Match the organization slug in the URL path
- Be the most recent key for that organization
- Be enabled (`api_key_enabled = true`)

**Note**: API key validation is enforced by middleware in `src/proxy.ts` before requests reach the route handlers.

#### Usage

```typescript
// Example: Ingest live timing data
const response = await fetch("/api/ingest/my-org/live", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-API-Key": "rr_api_key_<your-api-key>",
    },
    body: JSON.stringify(liveTimingData),
});
```

See `src/app/(global-api)/api/ingest/` for implementation details.

## 🧪 Testing

The project has comprehensive test coverage. Tests are co-located with the files they test and follow best practices for React and Next.js testing.

### Test Framework

- **Vitest** - Fast unit and integration testing
- **React Testing Library** - Component testing with user-centric approach
- **MSW (Mock Service Worker)** - API mocking for integration tests
- **Playwright** - End-to-end testing

### Test Coverage

The test suite provides coverage for:

- Page and layout components
- Utility functions and hooks
- Services and repositories
- Context providers
- UI components
- Middleware and API routes

### End-to-End Testing

The project includes end-to-end tests using Playwright located in the `e2e/` directory:

- **`live-timing.spec.ts`** - Comprehensive smoke test for the live timing system
    - Tests all live timing pages (Class, PAX, Raw, Me, Work/Run)
    - Verifies navigation and URL persistence
    - Tests refresh functionality
    - Validates responsive design
    - Designed as a single smoke test to minimize server calls

#### Running E2E Tests

```bash
# Run all e2e tests
pnpm test:e2e

# Run specific test file
pnpm test:e2e e2e/live-timing.spec.ts

# Run in UI mode (interactive test runner)
pnpm test:e2e:ui

# Run in debug mode (step through tests)
pnpm test:e2e:debug
```

The e2e tests are configured to automatically start the development server before running tests. See `playwright.config.ts` for configuration details.

### Reusable Test Mocks

The project includes reusable mock data in `src/__tests__/mocks/`:

- **`mock-users.ts`** - User and admin mocks (`mockUser`, `mockAdminUser`, `createMockUserWithExtendedDetails`); uses `defaultOrg` from test-utils for org shape in `user.orgs`
- **`mock-clerk.tsx`** - Clerk authentication mocks
- **`mock-db.ts`** - Database mocks
- **`mock-handlers.ts`** - MSW API request handlers
- **`mock-server.ts`** - MSW server configuration

For tenant/org context tests, use `defaultOrg` from `@/__tests__/test-utils`.

See `src/__tests__/README.md` for detailed testing guidelines.

### Manual Testing Checklist

- [ ] Tenant page shows Upcoming and Past events correctly
- [ ] Public /events page shows all organizations’ events
- [ ] Org Calendar (admin): create, edit, delete events; dialogs reopen after success; delete errors shown in dialog
- [ ] Live timing pages render correctly
- [ ] Class filtering works with URL persistence
- [ ] Driver selection persists in URL
- [ ] Gap visualizations display correctly
- [ ] Work/run order shows only on event day
- [ ] Responsive design works on mobile/desktop
- [ ] Refresh functionality works
- [ ] Empty states display appropriately
- [ ] Both autocross and rallycross modes work
- [ ] Tenant isolation works correctly
- [ ] Authentication flows work
- [ ] Feature flags correctly show/hide navigation items
- [ ] Feature flags correctly show/hide PAX statistics
- [ ] Feature flags persist across page refreshes
- [ ] API key generation works correctly
- [ ] API key disable/enable functionality works
- [ ] API key validation works for API requests (checks enabled status)
- [ ] Previous API keys are displayed correctly
- [ ] Organization profile icon uploads and displays in sidebar, public cards, and tenant header
- [ ] Organization header image uploads and displays on public org cards
- [ ] User management works correctly
- [ ] User roles can be assigned and removed
- [ ] User deletion works (soft delete)
- [ ] Self-deletion is prevented
- [ ] Shared header appears on all pages
- [ ] Mobile sidebar trigger works correctly
- [ ] Responsive design works across all pages

## ⚠️ Known Issues / Technical Debt

### Type Compatibility: @hookform/resolvers with Zod v4

**Issue**: `@hookform/resolvers` v5.2.2 has incomplete TypeScript type support for Zod v4, even though runtime behavior works correctly.

**Current Workaround**: Using type assertions (`zodResolver(schema as any)`) in form components to bypass TypeScript errors.

**Affected Files**:

- Anything using react hook form with a zod schema

**TODO**:

- Monitor `@hookform/resolvers` releases for improved Zod v4 type support
- Remove type assertions once the library fully supports Zod v4 types
- Consider alternative validation libraries if support doesn't improve

## 📦 Deployment

### Vercel Deployment

1. **Connect repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy**: Automatic deployments on push to main

### Environment Variables

Ensure all required environment variables are set in your deployment environment.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run code quality checks before committing:
    ```bash
    pnpm prettier:fix  # Format code
    pnpm lint          # Run linting and type checking
    pnpm test          # Run tests
    ```
4. If checks fail, fix the issues and try again
5. Submit a pull request

**Note**: Make sure all checks pass before pushing your changes.

### Code Review Guidelines

- Follow existing code patterns
- Maintain TypeScript strict mode compliance
- Ensure responsive design works
- Test multi-tenancy scenarios
- Verify authentication flows

## 📝 License

[Add your license here]

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Authentication by [Clerk](https://clerk.com/)

---

For questions or issues, please open an issue on GitHub.
