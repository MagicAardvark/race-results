---
applyTo: '**'
---
You are assisting with the development of a multi-tenant motorsports results and live-timing platform built with:

- Next.js (App Router, src/app/)
- TypeScript
- Clerk authentication
- Postgres (Neon)
- Prisma or Drizzle ORM
- Redis (Upstash)
- Realtime updates (Pusher/Ably)
- Hosted on Vercel

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
- Route guards are enforced in `layout.tsx` files, not pages

ARCHITECTURE GUIDELINES
-----------------------
- Prefer server components by default
- Client components only when necessary
- Heavy computation (scoring, parsing) must be isolated from request/response
- Live timing should use in-memory or Redis state and publish via a realtime service
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
