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
- **MotorsportReg Integration** - Fetch events and calendars from MotorsportReg.com
- **Event Calendar** - View upcoming events for organizations
- **Event Details** - Comprehensive event information

### Administration
- **Global Admin** - Platform-wide administration
  - Organization management
  - User management
  - Feature flag configuration per organization
- **Tenant Admin** - Organization-specific administration
  - Organization settings
  - User management within organization
  - Feature flag toggles (PAX Results, Work/Run Order)

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

```
src/
├── app/                          # Next.js App Router
│   ├── (global-admin)/          # Global admin routes
│   │   └── admin/
│   ├── (public)/                # Public routes
│   │   └── page.tsx            # Landing page
│   └── (tenants)/               # Tenant-scoped routes
│       └── t/[orgSlug]/
│           ├── live/            # Live timing system
│           │   ├── api/        # Data fetching
│           │   ├── components/ # React components
│           │   ├── context/    # React Context
│           │   ├── hooks/      # Custom hooks
│           │   └── lib/        # Utilities & feature flags
│           └── page.tsx        # Tenant home page
├── components/                   # Shared React components
│   ├── admin/                   # Admin components
│   ├── library/ui/              # UI component library
│   └── shared/                  # Shared components
├── db/                          # Database
│   ├── tables/                  # Drizzle table definitions
│   ├── repositories/            # Data access layer
│   └── seed.ts                  # Database seeding
├── dto/                         # Data Transfer Objects
├── services/                    # Business logic
│   ├── motorsportreg/           # MotorsportReg API service
│   ├── organizations/           # Organization service
│   ├── feature-flags/           # Feature flags service
│   ├── tenants/                 # Tenant service
│   └── users/                   # User service
├── lib/                         # Shared utilities
└── context/                     # React Context providers
```

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
- **Tenant routes**: `/t/[orgSlug]/*`
- **Tenant admin**: `/t/[orgSlug]/admin/*`
- **Global admin**: `/(global-admin)/admin/*`
- **Route guards**: Enforced in `layout.tsx` files

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
   ```

4. **Set up the database**
   ```bash
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
1. Navigate to global admin: `/(global-admin)/admin/organizations`
2. Click "Create Organization"
3. Fill in organization details
4. Set MotorsportReg ID if applicable

#### Managing Organization Settings
1. Navigate to tenant admin: `/t/[orgSlug]/admin`
2. Update organization settings
3. Manage users within the organization

#### Configuring Feature Flags
1. Navigate to global admin: `/(global-admin)/admin/organizations/[slug]`
2. Scroll to the "Feature Flags" section
3. Toggle features on/off for the organization:
   - **Enable PAX Results** - Shows PAX navigation and statistics
   - **Enable Work/Run Order** - Shows Work/Run navigation and assignments
4. Click "Save" to apply changes

## 🔧 Development

### Scripts

```bash
# Development
pnpm dev              # Start development server

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint

# Database
pnpm seed             # Seed database with sample data
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with Next.js and Prettier
- **Prettier**: Code formatting
- **Tailwind CSS**: Utility-first styling

### Architecture Guidelines

- **Server Components by Default**: Prefer server components
- **Client Components When Necessary**: Only use `"use client"` when needed
- **Isolated Computation**: Heavy computation (scoring, parsing) isolated from request/response
- **Minimal DB Writes**: Live timing uses in-memory/Redis state
- **Explicit Types**: Clear, explicit TypeScript types
- **No Magic Globals**: Avoid global state inference
- **Tenant Context**: Always passed via headers, never inferred from URL

### Database

#### Migrations
```bash
# Generate migration
pnpm drizzle-kit generate

# Apply migration
pnpm drizzle-kit push
```

#### Schema
- **Organizations** (`orgs`): Organization data
- **Users** (`users`): User accounts
- **Roles** (`roles`): User roles and permissions
- **Feature Flags** (`feature_flags`): Organization-level feature toggles

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

### Live Timing API

Live timing data is fetched from external API endpoints configured in:
- `src/app/(tenants)/t/[orgSlug]/live/lib/config.ts`

## 🧪 Testing

### Manual Testing Checklist

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
3. Ensure code passes linting
4. Test thoroughly
5. Submit a pull request

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
