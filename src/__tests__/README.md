# Testing Guide

This directory contains testing utilities, mocks, and setup files for the test suite.

## Structure

```
__tests__/
├── setup.tsx            # Vitest setup and global mocks
├── test-utils.tsx       # Custom render with providers
├── mocks/
│   ├── mock-clerk.tsx   # Clerk authentication mocks
│   ├── mock-db.ts       # Database mocks
│   ├── mock-handlers.ts # MSW API handlers
│   ├── mock-server.ts   # MSW server setup
│   ├── mock-tenants.ts  # Reusable tenant mocks
│   ├── mock-class-results.ts  # Class results mock data
│   ├── mock-pax-results.ts    # PAX results mock data
│   ├── mock-raw-results.ts    # Raw results mock data
│   └── mock-run-work.ts       # Run/work mock data
└── README.md            # This file

# Test files are co-located with the files they test
# Example: filter-buttons.test.tsx next to filter-buttons.tsx
```

## Testing Guidelines

### 1. Use `toBeVisible()` over `toBeInDocument()`

```typescript
// ✅ Good
expect(screen.getByRole("button", { name: /submit/i })).toBeVisible();

// ❌ Avoid
expect(screen.getByTestId("submit-button")).toBeInDocument();
```

### 2. Test as a user would

```typescript
// ✅ Good - Query by what user sees
screen.getByRole("button", { name: /save/i });
screen.getByText(/welcome/i);
screen.getByLabelText(/email/i);

// ❌ Avoid - Test IDs and classes
screen.getByTestId("save-button");
screen.getByClassName("btn-primary");
```

### 3. Mock minimally

```typescript
// ✅ Good - Mock only external dependencies
vi.mock("@clerk/nextjs");
vi.mock("@/db");

// ❌ Avoid - Don't mock internal utilities
// vi.mock("@/lib/utils");
```

### 4. Keep tests DRY

```typescript
// ✅ Good - Reusable test utilities
import { renderWithProviders } from "@/__tests__/test-utils";

// ✅ Good - Reusable mocks
import { mockValidTenant } from "@/__tests__/mocks/mock-tenants";
import { mockClerk } from "@/__tests__/mocks/mock-clerk";
```

### 5. Create reusable mocks

All reusable mocks are in `src/__tests__/mocks/`:

- `mock-clerk.tsx` - Clerk authentication mocks
- `mock-db.ts` - Database mocks
- `mock-handlers.ts` - MSW API request handlers
- `mock-server.ts` - MSW server configuration
- `mock-tenants.ts` - Reusable tenant mocks (ValidTenant, GlobalTenant, InvalidTenant)
- `mock-class-results.ts` - Class results mock data
- `mock-pax-results.ts` - PAX results mock data
- `mock-raw-results.ts` - Raw results mock data
- `mock-run-work.ts` - Run/work order mock data

#### Using Mock Tenants

The `mock-tenants.ts` file provides properly typed tenant mocks for testing:

```typescript
import {
    mockValidTenant,
    mockGlobalTenant,
    mockInvalidTenant,
} from "@/__tests__/mocks/mock-tenants";

// Use predefined mocks
const tenant = mockValidTenant;

// Or create custom tenants
import { createMockValidTenant } from "@/__tests__/mocks/mock-tenants";
const customTenant = createMockValidTenant({
    name: "Custom Org",
    slug: "custom-org",
});
```

### 6. Co-locate test files

Test files should be placed next to the files they test:

```typescript
// ✅ Good - Test file next to component
src / components / my - component.tsx;
src / components / my - component.test.tsx;

// ❌ Avoid - Separate __tests__ directory
src / components / my - component.tsx;
src / components / __tests__ / my - component.test.tsx;
```

## Usage Examples

### Component Test

```typescript
import { renderWithProviders, screen, userEvent } from "@/__tests__/test-utils";
import { MyComponent } from "./my-component"; // Co-located with test file

test("displays content", () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText(/hello/i)).toBeVisible();
});

test("handles user interaction", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MyComponent />);

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    expect(screen.getByText(/clicked/i)).toBeVisible();
});
```

### Service Test with MSW

```typescript
import { server } from "@/__tests__/mocks/mock-server";
import { http, HttpResponse } from "msw";

test("fetches data", async () => {
    server.use(
        http.get("/api/data", () => {
            return HttpResponse.json({ data: "test" });
        })
    );

    const result = await fetchData();
    expect(result).toEqual({ data: "test" });
});
```

## Running Tests

```bash
# Run all tests (single run)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

## Test Coverage

The project maintains comprehensive test coverage across:

- Page and layout components
- Utility functions and hooks
- Services and repositories
- Context providers
- UI components
- Middleware and API routes

Tests are automatically run as part of the pre-commit hook to ensure code quality.
