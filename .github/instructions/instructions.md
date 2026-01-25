---
applyTo: '**'
---
You are assisting with the development of a multi-tenant motorsports results and live-timing platform built with:

- Next.js (App Router, src/app/)
- TypeScript
- Clerk authentication
- Postgres (Neon)
- Drizzle ORM
- Hosted on Vercel

**Planned/Future:**
- Redis (Upstash) for caching and live timing state
- Realtime updates (Pusher/Ably) for live timing push notifications

PROJECT CONTEXT
---------------
This application supports:
- Multi-tenant organizations ("orgs") with both global and org-specific configuration
- Events, seasons, segments (Day 1 / Day 2 / Combined)
- Autocross-style timing with classes, indexed (PAX/RTP) and raw results
- Live timing that reuses scoring logic without excessive DB writes
- HTML file ingestion from third-party systems
- Public global views and tenant-scoped admin views

MULTI-TENANCY RULES
------------------
- Tenant resolution is handled via middleware
- Tenant is passed via the `x-tenant-slug` request header
- URLs support:
  - `/t/[orgSlug]` (path-based, for vercel.app)
  - `[orgSlug].domain.com` (future subdomain-based routing)
- `org_id = NULL` represents global/default configuration
- Org-specific rows override global rows

ROUTING CONVENTIONS
-------------------
- All org-scoped routes live under `/t/[orgSlug]`
- Org administration lives under `/t/[orgSlug]/admin`
- Global platform administration lives under `/(global-admin)`
- Authorization guards (like `requireRole`) are called from `layout.tsx` files to protect route trees

ARCHITECTURE GUIDELINES
-----------------------
- Prefer server components by default
- Client components only when necessary
- Heavy computation (scoring, parsing) must be isolated from request/response
- Live timing should use Redis state and publish via a realtime service (when implemented)
- Database writes should be minimized during live timing

CODING EXPECTATIONS
-------------------
- Use clear, explicit TypeScript types
- Avoid premature abstraction
- No magic globals
- Tenant context must never be inferred directly from the URL inside components
- Always assume future support for:
  - Multiple seasons
  - Per-event scoring modes
  - Org-specific overrides

TESTING GUIDELINES
------------------
**What to Test:**
- Complex user interactions (forms, dialogs, multi-step flows)
- Stateful components with conditional rendering or behavior
- Context providers (contract, error boundaries, state propagation)
- Components with business logic or data transformation
- Error states and validation flows
- User event handlers and callbacks

**What NOT to Test:**
- Thin server components that only fetch data and render children
- Static presentation with no logic or state
- Orchestration components that just compose other components
- Page components that only call services (test the services instead)
- Implementation details of dependencies

**Testing Principles:**
- Test behavior, not implementation details
- Test at the right abstraction layer (mock the dependency you use, not its internals)
- Write interaction tests, not just rendering tests
- Verify complete user flows (open dialog → fill form → submit → verify result)
- Use `beforeEach` to clear mocks and avoid test pollution
- When mocking Next.js `redirect()`, make it throw to simulate real behavior
- Keep tests simple, logical, and meaningful

**Test Organization:**
- Place tests next to the files they test (`.test.tsx`)
- Use `renderWithProviders` from test-utils for components needing context
- Mock server actions and external dependencies
- Prefer `userEvent` over `fireEvent` for realistic interactions

**Red Flags (indicates test may not be valuable):**
- Test only verifies a service method was called
- Test checks if static text renders
- Test mocks all child components
- Test has redundant assertions that don't add value
- Test becomes outdated when copy changes

ASSISTANT BEHAVIOR
------------------
- Default to pragmatic, production-ready solutions
- Explain tradeoffs when relevant
- Prefer evolvable designs over clever ones
- Ask clarifying questions only when truly necessary
- Do not invent libraries or APIs that do not exist

GOAL
----
Help incrementally build a maintainable, scalable platform with clean boundaries between:
- global vs org logic
- admin vs public views
- live vs persisted data
