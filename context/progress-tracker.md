# Progress Tracker — RapidTriage EMS

Last updated: 2026-07-10

## Current Phase

Build complete through Phase 13. Verified: typecheck, 34 tests, lint, and an
iOS Metro bundle export all pass. Remaining: live device demo (Phase 14),
which requires a running Postgres + simulator/device on the reviewer's machine.

## Final Architecture Decision

SQL end to end: Expo SQLite locally, PostgreSQL remotely, Drizzle ORM, Zod, TanStack Query, Express. NativeWind v5 + Tailwind v4 (PostCSS/Metro wiring), Expo SDK 54.

## Completed

- Assessment requirements reviewed.
- Architecture decided (SQLite + PostgreSQL + Drizzle + Zod + TanStack Query + Express).
- MongoDB and PGlite rejected; Redux rejected in favor of React Context.
- KISS/DRY, UI/UX rules, project structure, and Claude Code workflow defined.
- Phase 1 reconnaissance report produced.
- Confirmed styling (NativeWind v5) and Expo SDK 54 with the user.
- Git initialized (authored as Eric).
- Root docs written: README, SETUP, ARCHITECTURE, DEMO, TESTING, CLAUDE.md, INSTALL_COMMANDS.
- context/ docs written: project-overview, architecture, build-plan, code-standards, library-docs, ui-tokens, ui-rules, ui-registry, progress-tracker.

## In Progress

- .claude agents/commands/hooks/rules/skills/settings.

## Next Task

Finish Phase 2 `.claude` config, then Phase 3 dependencies and workspace bootstrap.

## Build Phases

| Phase | Status |
| ----- | ------ |
| Phase 1 — Reconnaissance | Done |
| Phase 2 — Docs & Claude Context | Done |
| Phase 3 — Dependencies / Bootstrap | Done |
| Phase 4 — Shared Domain | Done |
| Phase 5 — Mobile Database | Done |
| Phase 6 — Backend API | Done |
| Phase 7 — Mobile API/Query Layer | Done |
| Phase 8 — Network & Lifecycle | Done |
| Phase 9 — Sync Engine | Done |
| Phase 10 — Mobile UI Foundation | Done |
| Phase 11 — Screens | Done |
| Phase 12 — Form Submission | Done |
| Phase 13 — Testing | Done (34 tests: 10 shared, 6 API, 18 mobile) |
| Phase 14 — Demo Readiness | Pending live device run |

## Risks

- Time is limited; offline sync is the most important feature.
- Do not overbuild the backend; no auth/maps/uploads/dashboard.
- npm workspaces + Metro resolution of `@rapidtriage/shared` (mitigate: compiled shared package + `build:shared`).
- Demo must clearly show Airplane Mode save and reconnect sync.

## Decision Log

- **SQLite + PostgreSQL:** both SQL, consistent and explainable.
- **Drizzle:** supports Expo SQLite and PostgreSQL, keeps DB access type-safe.
- **TanStack Query:** clean API request/sync mutation state.
- **React Context over Redux:** persistent data in SQLite, server-state in TanStack Query, remaining UI state is lightweight.
- **Thin backend:** mobile-first; backend only receives synced records.
- **NativeWind v5 + SDK 54:** match the team's proven working Expo toolchain.
