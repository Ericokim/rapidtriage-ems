# Library Docs — RapidTriage EMS

How each library is used in this project.

## React Native + Expo (SDK 54)

Native mobile UI and dev runtime (Metro, assets, emulator workflow). Functional components + hooks only. `Pressable` for custom touch actions, `SafeAreaView` for screen boundaries, `KeyboardAvoidingView` for form screens. Start with `npm run mobile`.

## Expo Router

File-based routing:

```text
apps/mobile/app/index.tsx          → Home
apps/mobile/app/triage/new.tsx     → New Triage
apps/mobile/app/queue/index.tsx    → Queue
apps/mobile/app/history/index.tsx  → History
```

Navigate with `router.push("/triage/new")`.

## Expo SQLite

Local on-device SQL persistence: saving triage records, keeping them across restarts, querying pending records, updating sync statuses. Never called directly from UI components — access only through the repository.

## Drizzle ORM

Type-safe SQL access for Expo SQLite (mobile) and PostgreSQL (backend): type-safe insert/query/update and clear schema definitions.

## PostgreSQL

Stores synced remote records with idempotent upsert by `client_id`.

## TanStack Query

Manages API/server-state: sync mutations, request state, request-level retry, health checks. **Not** used for durable offline storage or as a replacement for SQLite.

## React Hook Form

Efficient form state for patient name, condition, priority, status, and submit state.

## Zod

Shared validation for mobile form validation and backend request validation via a single schema contract.

## NetInfo

Connectivity detection for the online/offline banner, reconnect sync, and avoiding generic network errors.

## NativeWind (v5 + Tailwind v4)

Utility-first styling for layout, spacing, typography, and color. Wired via `global.css` + Metro `withNativewind` + PostCSS (`@tailwindcss/postcss`). No `nativewind/babel` plugin, no `tailwind.config.js`.

## Express

Backend API: health route, triage sync route, JSON middleware, error middleware.

## Helmet / CORS / Morgan

Helmet adds basic HTTP security headers. CORS allows the mobile app to reach the local backend in development. Morgan logs HTTP requests in development.

## Jest / Supertest / RNTL

Jest runs unit tests (shared validation, mobile logic, API). Supertest tests Express routes. React Native Testing Library tests component behavior.
