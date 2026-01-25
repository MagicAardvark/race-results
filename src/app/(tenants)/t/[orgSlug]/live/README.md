# Live Timing System

## Overview

A comprehensive live timing system for race events, allowing real-time viewing of class results, PAX standings, raw times, work/run assignments, and a personalized "Me" dashboard.

## 🎯 Features

### Pages

#### 1. **Class Results** (`/live`)

- Displays results grouped by car class
- Supports both autocross and rallycross display modes
- Interactive class filtering with URL-persisted state
- Expandable run details showing individual run times, cones, and DNFs
- Visual gap display showing position relative to other drivers
- Highlights PAX leaders

#### 2. **PAX Results** (`/live/pax`)

- PAX-adjusted standings across all classes
- Shows PAX time, raw time, and gaps to first/next
- Visual gap visualization for easy comparison

#### 3. **Raw Results** (`/live/raw`)

- Raw time standings across all drivers
- Position, total time, and gap information
- Consistent visual design with other result pages

#### 4. **Work/Run Order** (`/live/workrun`)

- Displays work and run assignments by class
- Shows number of heats for the event
- Only available on the day of the event
- Clear instructions for multi-heat events

#### 5. **Personal Stats Dashboard** (`/live/me`) ⭐

- **Driver Selection**: Searchable dropdown to select yourself
- **Position Cards**:
    - Class position with best time
    - PAX position and time
    - Raw position and time
- **Run Statistics**: Total runs, clean runs, cone count, DNF count
- **Visualizations**:
    - Class times distribution chart (horizontal histogram)
    - Individual class times visualization
- **URL-based persistence**: Driver selection stored in URL search params (encoded)
- **Responsive design**: Optimized for both mobile and desktop

### Shared Components & Features

- **Gap Visualization**: Visual timeline showing driver position relative to others
- **Result Cards**: Consistent card-based layout across all result types
- **Refresh Button**: Manual refresh capability in navigation
- **Empty States**: User-friendly messages when no data is available
- **Responsive Design**: Mobile-first approach with desktop optimizations

## 🏗️ Architecture

### Data Flow

- **Server-side data fetching**: All results fetched in parallel on the server
- **React Context**: `LiveResultsProvider` provides data to all client components
- **Custom Hooks**:
    - `useLiveData()` - Access to all live results data and utilities
    - `useUrlFilters()` - URL search param management

### State Management

- **URL Search Params**: Used for class filters and driver selection (shareable/bookmarkable)
- **React Context**: Global state for live results data
- **Local State**: Component-specific UI state (expanded runs, etc.)

### API Integration

- **Data Source**: Fetches directly from `liveResultsService` (in-memory cache)
- **Service**: `liveResultsService` provides cached results data
- **API Routes**: Available at `/api/[orgSlug]/live/results/*` for external clients
- Supports autocross and rallycross modes
- Handles missing/null data gracefully

## 🔧 Code Organization

### Components

- **ClassResultEntry**: Unified component for displaying class results (supports both autocross and rallycross)
- **FilterButtons**: Shared filter button component for class filtering
- **Shared UI Components**: PositionBadge, DriverInfo, TimeValue, etc. used across result pages

### Hooks

- **`useLiveData()`**: Provides access to all live results data and utility functions
- **`useUrlFilters()`**: Manages URL search params for filters and driver selection

### Utilities (`_lib/utils/`)

- **`gap-calculator.ts`**: Calculates time gaps between drivers
- **`is-today.ts`**: Date utilities for work/run order visibility
- **`key-generators.ts`**: Generates consistent React keys for driver identification
- **`navigation.ts`**: Generates navigation pages based on feature flags
- **`rallycross-calculator.ts`**: Calculates rallycross times and positions
- **`tenant-guard.ts`**: Validates tenant context and redirects if invalid

### Configuration (`_lib/config/`)

- **`config.ts`**: API endpoint configuration and defaults
- **`feature-flags.ts`**: Feature flag key constants

## 📁 File Structure

```
live/
├── _lib/            # Page-specific code (underscore prefix prevents Next.js routing)
│   ├── components/   # React components (page-specific)
│   │   ├── class-results/    # Class results display
│   │   ├── my-stats/         # Personal stats dashboard
│   │   ├── pax-results/      # PAX results display
│   │   ├── raw-results/      # Raw results display
│   │   ├── shared/           # Shared components within live timing
│   │   └── work-run/         # Work/run order display
│   ├── config/      # Configuration files
│   │   ├── config.ts         # API endpoint configuration
│   │   └── feature-flags.ts  # Feature flag constants
│   ├── context/     # React Context providers
│   │   └── live-results-context.tsx  # Provides data to all pages
│   ├── hooks/       # Custom React hooks
│   │   ├── useLiveData.ts    # Access live results data
│   │   └── useUrlFilters.ts  # URL search param management
│   ├── types.ts     # TypeScript type definitions
│   └── utils/       # Utility functions
│       ├── gap-calculator.ts     # Time gap calculations
│       ├── is-today.ts           # Date utilities
│       ├── key-generators.ts     # React key generation
│       ├── navigation.ts         # Navigation page definitions
│       ├── rallycross-calculator.ts  # Rallycross time calculations
│       └── tenant-guard.ts       # Tenant validation
├── layout.tsx       # Server layout (data fetching)
├── page.tsx         # Class results page
├── me/              # Personal stats page
├── pax/             # PAX results page
├── raw/             # Raw results page
└── workrun/         # Work/run order page
```

## 🔧 Implementation Details

### Data Fetching

- All data is fetched server-side in `layout.tsx` using `Promise.all` for parallel requests
- Data is fetched directly from `liveResultsService` methods:
    - `liveResultsService.getClassResults(orgSlug)`
    - `liveResultsService.getIndexedResults(orgSlug)`
    - `liveResultsService.getRawResults(orgSlug)`
- Data includes: class results, PAX results, raw results, run work (currently null), and feature flags
- Data is provided to client components via `LiveResultsProvider` context

#### Data Sources

The system fetches data directly from the `liveResultsService`:

- **Service Cache**: All data is retrieved from the in-memory cache maintained by `liveResultsService`
- **Cache Population**: Data is populated via the ingest endpoint at `/api/ingest/[orgSlug]/live/results`
- **No HTTP Requests**: The client code calls service methods directly, avoiding HTTP overhead

#### API Route Structure (for external clients)

The following API routes are available for external clients but are not used by the live timing pages:

- `/api/[orgSlug]/live/results/class` - Class results
- `/api/[orgSlug]/live/results/indexed` - PAX (indexed) results
- `/api/[orgSlug]/live/results/raw` - Raw results
- `/api/[orgSlug]/live/results/runwork` - Work/run assignments

These routes are served by the `liveResultsService` which provides cached results data.

### Display Modes

The system supports two display modes:

- **Autocross**: Standard autocross timing with individual run times
- **Rallycross**: Rallycross timing with calculated times

Display mode is currently hardcoded but can be configured per event/tenant.

### Driver Identification

Drivers are identified by a combination of:

- Name
- Number
- Car Class

This creates a unique `driverId` for each driver across all result types.

## 🎨 UI/UX Features

### Visual Elements

- **Gap Timeline**: Visual representation of time gaps with car icons
- **Position Badges**: Clear position indicators
- **Color-coded drivers**: Car colors displayed consistently
- **Interactive cards**: Expandable run details
- **Responsive grids**: Adapts to screen size

### User Experience

- **Shareable URLs**: Filter states and driver selection in URL
- **Smooth transitions**: React transitions for URL updates
- **Loading states**: Refresh button with spinner
- **Empty states**: Helpful messages when no data
- **Mobile-optimized**: Touch-friendly interface

## 🔄 Related Features

### Feature Flags

The live timing system respects organization-level feature flags:

- `feature.liveTiming.paxEnabled` - Controls PAX results visibility
- `feature.liveTiming.workRunEnabled` - Controls work/run order visibility

These flags are configured in the global admin panel and affect navigation visibility and data display.

## 🧪 Testing Considerations

- [x] All result pages render correctly
- [x] Class filtering works with URL persistence
- [x] Driver selection persists in URL
- [x] Gap visualizations display correctly
- [x] Work/run order shows only on event day
- [x] Responsive design works on mobile/desktop
- [x] Refresh functionality works
- [x] Empty states display appropriately
- [x] Both autocross and rallycross modes work

## 🚀 Setup & Configuration

### Configuration

The `_lib/config/config.ts` file provides `getApiUrl()` for reference and test mocks, but is not used by the live timing pages. Data is fetched directly from `liveResultsService` in `layout.tsx`.

### Data Source

The system fetches data directly from the `liveResultsService` in `layout.tsx`:

- **Service Methods**:
    - `liveResultsService.getClassResults(orgSlug)` - Class results
    - `liveResultsService.getIndexedResults(orgSlug)` - PAX (indexed) results
    - `liveResultsService.getRawResults(orgSlug)` - Raw results
- **Cache**: Data is stored in an in-memory cache managed by the service
- **Cache Population**: Data is populated via the ingest endpoint at `/api/ingest/[orgSlug]/live/results`
- **No HTTP Overhead**: Direct service calls avoid HTTP request overhead
- **Run Work**: Currently returns `null` (TODO: Add to service when available)

#### Local Development

- Data is fetched from the service cache (same as production)
- Tests should mock `liveResultsService` methods directly

#### Production Deployment

- Data is fetched from the service cache
- Cache is shared across serverless function invocations (when available)
- API routes at `/api/[orgSlug]/live/results/*` are available for external clients

## 📝 Technical Details

### Dependencies

- `recharts` - Added for data visualization
- Existing Next.js, React, Tailwind CSS stack

### Browser Support

- Modern browsers with ES6+ support
- URL search params API
- CSS Grid and Flexbox

### Performance

- Server-side rendering for initial load
- Client-side hydration for interactivity
- Memoized calculations prevent unnecessary re-renders
- Efficient React key generation

## 🎯 Future Enhancements

Potential improvements:

- Real-time updates via WebSocket
- Export functionality
- Additional chart types
- Performance metrics dashboard
- Event-specific display mode configuration
- Customizable refresh intervals
