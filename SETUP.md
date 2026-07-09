# Setup Guide — RapidTriage EMS

This document explains how to install and run the RapidTriage EMS monorepo.

## Final Stack

```text
Mobile:  React Native, Expo (SDK 54), Expo Router, TypeScript, NativeWind (v5 + Tailwind v4),
         Expo SQLite, Drizzle, TanStack Query, React Hook Form, Zod, NetInfo
Backend: Node.js, Express, PostgreSQL, Drizzle, Zod, CORS, Helmet, Morgan
Shared:  TypeScript types, Zod schemas, constants
```

## Prerequisites

```text
Node.js >= 20 (developed on Node 22)
npm >= 10
Expo CLI through npx
PostgreSQL (developed on PostgreSQL 17)
Android Studio or iOS Simulator / Expo Go
Git
```

## Quick Start

From the repository root:

```bash
npm install
npm run build:shared
```

Create the two env files (see below), create the database, then run everything
with a single command:

```bash
npm run dev      # shared watcher + API + Expo, all together (via concurrently)
```

Or run the pieces in separate terminals if you prefer:

```bash
npm run api      # terminal 1 — Express API on :4000
npm run mobile   # terminal 2 — Expo dev server
```

## Workspace Layout

This is an npm workspaces monorepo:

```text
packages/shared   → @rapidtriage/shared (compiled TS, consumed by mobile + api)
apps/api          → Express + PostgreSQL + Drizzle sync API
apps/mobile       → Expo app (offline-first)
```

The shared package is compiled to `packages/shared/dist` and consumed by both apps. Run `npm run build:shared` after changing shared code.

## PostgreSQL Setup

Create a local database:

```bash
createdb rapidtriage
```

Or with `psql`:

```sql
CREATE DATABASE rapidtriage;
```

Create `apps/api/.env`:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rapidtriage
```

Generate and apply the schema with Drizzle:

```bash
npm --workspace apps/api run db:generate
npm --workspace apps/api run db:migrate
```

## Mobile Env

Create `apps/mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:4000
```

> On a physical device, replace `localhost` with your machine's LAN IP (e.g. `http://192.168.1.20:4000`) so the phone can reach the API.

## NativeWind v5 Notes

This project uses **NativeWind v5 (preview) with Tailwind CSS v4**, wired through Metro + PostCSS (matching the team's proven Expo SDK 54 setup):

- `global.css` holds the Tailwind entry and `@theme` tokens.
- `metro.config.js` wraps the config with `withNativewind`.
- `postcss.config.mjs` uses `@tailwindcss/postcss`.
- There is **no** `babel.config.js` NativeWind plugin and **no** `tailwind.config.js`; Tailwind v4 is configured through CSS.

## Run Backend

```bash
npm run api
```

Expected:

```text
RapidTriage API running on port 4000
```

## Run Mobile

```bash
npm run mobile
```

Then choose Android, iOS, or Expo Go from the Expo CLI.

## Run Tests / Typecheck / Lint

```bash
npm run test
npm run typecheck
npm run lint
```

## Troubleshooting

- **Metro can't resolve `@rapidtriage/shared`** → run `npm run build:shared` and restart Metro with `--clear`.
- **API can't connect to Postgres** → confirm `DATABASE_URL` and that `rapidtriage` DB exists.
- **Device can't reach API** → use LAN IP in `apps/mobile/.env`, not `localhost`.
