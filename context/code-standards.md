# Code Standards — RapidTriage EMS

## General Rules

Use TypeScript everywhere. Avoid `any`. Keep files focused and functions small. Prefer explicit domain types. Do not mix UI and persistence logic. Do not call SQLite directly from screens. Do not call backend directly from components. Keep business logic testable without rendering UI. Use shared constants and tokens instead of hardcoded values.

## TypeScript Rules

Use explicit domain types for `TriagePriority`, `TriageStatus`, `SyncStatus`, `TriageRecord`, sync payloads, and API responses. Avoid `any`, untyped API responses, duplicated string unions, and magic strings.

## File Naming

- React components: `PascalCase.tsx` (e.g. `TriageForm.tsx`, `PrioritySelector.tsx`).
- Logic files: `camelCase.ts` (e.g. `createLocalTriageRecord.ts`, `syncEngine.ts`, `triageValidation.ts`).

## Component Rules

Components receive data through props, emit events through callbacks, avoid direct database/API logic, use tokens from the theme, and support loading/disabled/empty/error states where relevant. Components must not execute SQL, call fetch directly, implement retry loops, or own sync status transitions.

## Screen Rules

Screens may compose components, trigger hooks, handle navigation, and show screen-level states. Screens may not execute SQL, call backend directly, implement sync algorithms, or contain retry loops.

## Local Database Rules

All local database operations live under `apps/mobile/src/db/`. Repository functions own insert, query, update sync status, and retry metadata.

## API Rules

Backend routes live under `apps/api/src/routes/`. Backend business logic lives under `apps/api/src/services/`. Controllers stay thin.

## Validation Rules

Validation uses shared Zod schemas from `packages/shared/src/schemas/`. Do not duplicate validation in components, screens, controllers, or services.

## Sync Rules

Sync logic lives under `apps/mobile/src/features/sync/`. The sync engine reads pending records, marks syncing, pushes to API, marks synced/failed, and prevents concurrent sync.

## Error Handling

User-facing errors must be calm and clear.

Good: `Record saved locally. Sync will retry automatically.`
Bad: `TypeError: Network request failed`

## UI Styling Rules

Use NativeWind, shared UI components, design tokens, and semantic priority colors. Avoid hardcoded random colors, inconsistent spacing, tiny touch targets, decorative gradients, and overly playful visuals.

## Testing Rules

Prioritize tests for shared validation, local save, sync engine, API sync endpoint, and form validation behavior. Avoid using snapshot tests as the main quality signal.

## Git Discipline

Use small commits, e.g.:

```text
feat: bootstrap monorepo
feat: add shared triage schema
feat: add expo sqlite local store
feat: add triage form
feat: add sync endpoint
feat: add reconnect sync engine
test: cover offline submit flow
docs: add assessment README
```
