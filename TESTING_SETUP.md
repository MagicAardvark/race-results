# Testing Setup Complete ✅

## What's Been Set Up

### 1. **Vitest** - Unit & Integration Testing

- Fast, ESM-first test runner
- Built-in coverage reporting
- Configured with React support

### 2. **React Testing Library** - Component Testing

- User-centric testing approach
- `toBeVisible()` matchers configured
- Custom render utilities with providers

### 3. **MSW (Mock Service Worker)** - API Mocking

- Network-level mocking
- Reusable handlers for API endpoints
- Works in both unit and E2E tests

### 4. **Playwright** - E2E Testing

- Full browser testing
- Multiple browser support
- Mobile device testing

## Installation

Run this command to install all dependencies:

```bash
pnpm add -D vitest @vitest/ui @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event msw playwright @playwright/test jsdom happy-dom @vitejs/plugin-react
```

Then install Playwright browsers:

```bash
pnpm exec playwright install
```

## Test Scripts

```bash
# Run unit/integration tests (single run)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Debug E2E tests
pnpm test:e2e:debug
```

## File Structure

```
src/
├── __tests__/
│   ├── setup.ts              # Global test setup
│   ├── test-utils.tsx        # Custom render with providers
│   ├── mocks/
│   │   ├── clerk.ts         # Clerk mocks
│   │   ├── db.ts            # Database mocks
│   │   ├── handlers.ts      # MSW API handlers
│   │   └── server.ts        # MSW server setup
│   └── README.md             # Testing guidelines
├── app/
│   └── .../
│       └── components/
│           └── __tests__/   # Component tests
e2e/
└── *.spec.ts                 # E2E tests
```

## Example Test

See `src/app/(tenants)/t/[orgSlug]/live/components/shared/__tests__/filter-buttons.test.tsx` for a complete example following all guidelines:

- ✅ Uses `toBeVisible()`
- ✅ Tests as a user would (by role/text)
- ✅ Minimal mocking
- ✅ DRY and concise
- ✅ Reusable test utilities

## Coverage Goals

Current thresholds set to 70% for:

- Lines
- Functions
- Branches
- Statements

View coverage reports:

```bash
pnpm test:coverage
# Open coverage/index.html in browser
```

## Next Steps

1. Install dependencies (command above)
2. Run `pnpm test` to verify setup
3. Start writing tests for your components!
4. See `src/__tests__/README.md` for detailed guidelines
