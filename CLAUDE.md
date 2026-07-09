# CLAUDE.md — RapidTriage EMS

## Project Brain

You are working on RapidTriage EMS, an offline-first React Native mobile assessment with a lightweight Express and PostgreSQL backend. The goal is a resilient paramedic triage intake app that saves records locally first and syncs to the backend when connectivity returns.

## Final Architecture Decision

Use SQL end to end:

- Expo SQLite locally
- PostgreSQL remotely
- Drizzle ORM for type-safe database access
- Zod for shared validation
- TanStack Query for API/sync requests
- React Context for lightweight UI/network/sync state

Do not use MongoDB. Do not use PGlite. Do not use Redux unless a clear need appears.

## Core Rule

A valid triage record must be saved locally before any API request.

## Read First

Before starting any task, read: `README.md`, `SETUP.md`, `ARCHITECTURE.md`, then `context/project-overview.md`, `context/architecture.md`, `context/build-plan.md`, `context/code-standards.md`, `context/library-docs.md`, `context/ui-tokens.md`, `context/ui-rules.md`, `context/ui-registry.md`, `context/progress-tracker.md`.

## Tech Stack

- **Mobile:** React Native, Expo (SDK 54), Expo Router, TypeScript, NativeWind (v5 + Tailwind v4), Expo SQLite, Drizzle, TanStack Query, React Hook Form, Zod, NetInfo, React Context.
- **Backend:** Express, PostgreSQL, Drizzle, Zod.
- **Shared:** TypeScript types, Zod schemas, constants.

## Architecture Rules

- UI must not directly write SQL.
- UI must not directly call sync endpoints.
- UI must not call backend before local save.
- Form validation must use the shared Zod schema.
- Mobile data must be saved locally first.
- Backend sync must be non-blocking.
- Failed sync must not delete records.
- Sync engine must prevent concurrent runs.
- Components must use shared UI tokens.
- Keep the app KISS and DRY.

## KISS Rules

Four screens only (Home, New Triage, Queue, History). One backend resource (Triage). One main table (`triage_records`). One sync endpoint (`POST /api/v1/triage/sync`). No auth, maps, uploads, or admin dashboard.

## DRY Rules

Shared Zod schema validates mobile and backend. Shared constants define priorities and statuses. Shared types define payloads. Reusable UI components handle repeated styling. Sync logic lives in one sync engine.

## UI Rules

The app is used by paramedics under pressure. The interface must be fast, clear, thumb-friendly, high contrast, calm, professional, minimal, and reliable. Priority 1 and 2 must stand out visually. Offline mode must feel safe, not broken.

## Styling Setup

NativeWind v5 + Tailwind v4, wired via `global.css` + `metro.config.js` (`withNativewind`) + `postcss.config.mjs`. No babel NativeWind plugin, no `tailwind.config.js`.

## Quality Bar

Ready only when: offline submit works, Airplane Mode demo works, local records persist, reconnect sync works automatically, app foreground sync works, priority 1 and 2 are visually clear, tests pass, README explains architecture clearly, demo video/GIF is under 60 seconds.
