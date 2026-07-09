# Architecture — RapidTriage EMS (context)

## Summary

RapidTriage EMS uses a SQL-to-SQL offline-first architecture. The mobile app saves records locally into Expo SQLite before any network request. The backend stores synced records in PostgreSQL.

## Pattern

```text
React Native Screen → React Hook Form → Zod Validation → Local SQLite Write (Drizzle)
→ Sync Engine → TanStack Query Mutation → Express API → PostgreSQL Write (Drizzle)
```

## Source of Truth

- **Offline / field mode:** SQLite is the operational source of truth. The device owns the record because the user may not have internet.
- **Synced mode:** PostgreSQL stores the remote synced record.

## Core Invariant

A valid record must be saved locally before the app attempts to sync it.

## State Ownership

- **SQLite owns:** triage records, sync status, retry count, last sync error, created/updated/synced timestamps.
- **TanStack Query owns:** API mutation state, request retries, sync loading state, server-state refresh after sync.
- **React Context owns:** online/offline state, lightweight sync state, last sync time, last visible sync error.

## Local Table (`triage_records`)

`id`, `patient_name`, `condition_description`, `priority_level`, `status`, `sync_status`, `retry_count`, `last_sync_error`, `created_at`, `updated_at`, `synced_at`.

## Remote Table (`triage_records`)

`id`, `client_id`, `patient_name`, `condition_description`, `priority_level`, `status`, `created_at_client`, `updated_at_client`, `synced_at`, `created_at`, `updated_at`.

## Why `client_id` Exists

The app generates a local ID before syncing. The backend stores this as `client_id` and upserts by it, preventing duplicate records when the same local record is synced more than once.

## Submit Flow

```text
User submits form → validate with Zod → generate local ID → save into SQLite (pending)
→ show success → if online trigger sync engine → if offline leave record pending
```

## Sync Flow

```text
Connectivity returns → NetInfo updates network state → sync engine starts
→ read pending/failed records → mark syncing → post to Express API
→ backend validates → backend upserts into PostgreSQL → returns syncedIds
→ mark matching local records as synced
```

## Lifecycle Flow

```text
App → background: no data removed, pending records remain in SQLite
App → foreground: check connectivity; if online, sync engine runs
```

## What Screens Can / Cannot Do

- **Can:** render UI, compose components, trigger submit handlers, read hooks, navigate.
- **Cannot:** execute SQL directly, call backend directly, implement retry logic, own sync logic.

## What Components Can / Cannot Do

- **Can:** render data, accept props, emit callbacks, show loading/empty/error/selected states.
- **Cannot:** access SQLite/API/NetInfo directly, contain sync rules.

## Sync Engine Rules

Never block the UI. Never delete failed records. Prevent concurrent runs. Use retry metadata. Mark records syncing before upload. Mark synced only after confirmed backend response. Mark failed on upload failure. Re-attempt failed records on reconnect or foreground.

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
