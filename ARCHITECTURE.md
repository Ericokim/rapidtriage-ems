# Architecture — RapidTriage EMS

## Final Architecture Decision

RapidTriage EMS uses a SQL-to-SQL offline-first architecture.

```text
Mobile local database: Expo SQLite
Backend database:       PostgreSQL
ORM:                    Drizzle
Validation:             Zod (shared)
API:                    Express
Server-state/API layer: TanStack Query
```

## Why This Architecture

A triage record is structured data with fixed fields (patient name, condition, priority, status, sync status, timestamps). A relational SQL model fits this better than a document database. Using SQLite locally and PostgreSQL remotely keeps the architecture consistent and easy to explain.

## Architecture Pattern

```text
React Native Screen
  → Form component
  → React Hook Form
  → Zod validation (shared schema)
  → Local SQLite write through Drizzle
  → Sync engine
  → TanStack Query mutation
  → Express API
  → PostgreSQL write through Drizzle
```

## Source of Truth

- **During field work:** SQLite is the operational source of truth. The paramedic may be offline, so the device must own the captured data first.
- **After sync:** PostgreSQL stores the remote synced record.

## Core Invariant

```text
No valid triage record can be sent to the backend before it is saved locally.
```

## Local Persistence

The mobile app stores records in Expo SQLite. Each record includes:

`id`, `patient_name`, `condition_description`, `priority_level`, `status`, `sync_status`, `retry_count`, `last_sync_error`, `created_at`, `updated_at`, `synced_at`.

## Sync Statuses

| Status  | Meaning                                     |
| ------- | ------------------------------------------- |
| pending | Record is saved locally and waiting to sync |
| syncing | Record is currently being pushed to backend |
| synced  | Record was successfully synced              |
| failed  | Last sync attempt failed; retry later       |

## Backend Persistence

The backend stores synced records in PostgreSQL. Each remote record includes:

`id`, `client_id`, `patient_name`, `condition_description`, `priority_level`, `status`, `created_at_client`, `updated_at_client`, `synced_at`, `created_at`, `updated_at`.

## Why Client ID Exists

The mobile app creates a local ID before sync. The backend stores that value as `client_id`. This makes sync idempotent: if the same record is sent twice, the backend updates the existing row instead of creating duplicates.

## Sync Flow

```text
1.  User submits form.
2.  App validates input.
3.  App saves record to SQLite with sync_status = pending.
4.  If offline, app stops there and shows Saved Offline.
5.  If online, sync engine starts.
6.  Sync engine loads pending and failed records.
7.  Sync engine marks records as syncing.
8.  Sync engine sends records to POST /api/v1/triage/sync.
9.  Backend validates payload.
10. Backend upserts records into PostgreSQL by client_id.
11. Backend returns syncedIds.
12. Mobile marks those records as synced.
13. Failed records remain local and retry later.
```

## Reconnect Flow

```text
NetInfo detects internet restored → sync engine runs → pending records pushed → synced records updated locally
```

## Foreground Flow

```text
App returns to foreground → check network state → if online, sync engine runs
```

## Separation of Concerns

- **UI owns:** rendering screens, form fields, validation messages, sync state, triggering the submit handler.
- **Local repository owns:** SQLite insert/update/query and sync status changes.
- **Sync engine owns:** reading pending records, preventing concurrent sync, calling the API mutation, marking synced/failed.
- **API owns:** request validation, upserting remote records, returning synced IDs.
- **Shared package owns:** triage constants, types, and Zod validation schemas.

## What the UI Must Not Do

Run SQL directly, call the backend before local save, own retry logic, own sync queue logic, or show raw technical errors.

## What the Backend Must Not Do

Become required for initial triage capture, add unnecessary auth, add unrelated modules, or reject duplicate client IDs as fatal errors.

## Invariants

1. A valid submission is saved locally before network upload.
2. Offline submission must not show a generic failure error.
3. The UI must remain usable during sync.
4. Critical priority levels 1 and 2 must be visually distinct.
5. The form must be single-screen and thumb-friendly.
6. Pending records must survive app restart.
7. Sync failures must preserve records for retry.
8. Components must use shared design tokens.
9. Business logic must be testable without rendering UI.

## KISS Decisions

One main table (`triage_records`), one backend resource (triage), one sync endpoint (`POST /api/v1/triage/sync`), four screens (Home, New Triage, Queue, History), no auth/maps/uploads/dashboards/notifications.

## DRY Decisions

One shared Zod validation schema, one shared priority definition, one shared status definition, one shared sync payload contract, reusable UI components, and Drizzle for type-safe SQL access in both mobile and backend.
