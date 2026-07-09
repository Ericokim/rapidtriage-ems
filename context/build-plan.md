# Build Plan — RapidTriage EMS

## Build Strategy

Build the smallest complete product that proves the assessment requirements. Do not overbuild. The goal is a polished offline-first triage app with a lightweight backend sync API.

## Phase 1 — Bootstrap Monorepo

Create root workspace, mobile Expo app, Express API app, shared package. Configure TypeScript, linting, testing. Add base docs, context files, Claude Code files.

**Done:** `npm install` works, workspaces resolve, mobile app starts, API starts, shared package imports work.

## Phase 2 — Shared Domain

Add triage constants, TypeScript types, Zod schemas, sync payload schema, exports, shared validation tests.

**Done:** mobile and API import the shared schema; validation works in both; no duplicated validation rules.

## Phase 3 — Mobile Database

Install Expo SQLite + Drizzle. Create local schema, database client, triage local repository (insert, pending query, mark syncing/synced/failed).

**Done:** records save locally, persist after restart, pending records queryable, repository testable.

## Phase 4 — Mobile UI Foundation

Configure NativeWind. Create design tokens and reusable UI components: ScreenContainer, AppHeader, ConnectionBanner, AppButton, AppInput, AppTextArea, PriorityChip, PrioritySelector, StatusSelector, StatusBadge, SyncIndicator, EmptyState, TriageRecordCard.

**Done:** components reuse tokens, touch targets are large, priority 1 and 2 colors are clear, UI is consistent.

## Phase 5 — Mobile Screens

Build Home, New Triage, Queue, History and navigation links.

**Done:** Home shows connection state and pending count; New Triage is single-screen; Queue shows unsynced records; History shows local history; critical cases stand out.

## Phase 6 — Form and Local Submit

Add React Hook Form + Zod resolver. Validate required fields, disable invalid submit, show inline errors, save valid record locally, show success, trigger sync if online.

**Done:** blank fields cannot submit; priority and status required; valid records save locally first; offline submit succeeds.

## Phase 7 — Backend API

Create Express app, PostgreSQL connection, Drizzle schema, sync endpoint, Zod validation, idempotent upsert by client_id, API tests.

**Done:** API starts, health endpoint works, sync accepts valid records, rejects invalid payloads, duplicate client IDs do not create duplicates.

## Phase 8 — Sync Engine

Add NetInfo listener, AppState foreground listener, TanStack Query mutation, sync engine. Prevent concurrent runs, mark syncing/synced/failed, retry failed records.

**Done:** offline submit works, online submit syncs, reconnect syncs automatically, foreground sync works, failed sync retries, UI does not freeze.

## Phase 9 — Testing

Test shared schemas, local save, pending queue, sync engine, API sync endpoint, form validation UI.

**Done:** critical tests pass, typecheck passes, lint passes.

## Phase 10 — Demo and Submission

Polish UI, update README, confirm setup, record Airplane Mode demo, push public GitHub repo, submit link and demo.

**Done:** public repo ready, README complete, tests pass, demo under 60 seconds, assessment requirements satisfied.
