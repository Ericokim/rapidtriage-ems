# RapidTriage EMS

RapidTriage EMS is an offline-first paramedic triage intake application built with React Native, Expo, Expo SQLite, Drizzle ORM, TanStack Query, Express, and PostgreSQL.

The app allows field paramedics to capture patient triage records instantly, save them safely on the device when offline, and automatically sync them to a PostgreSQL backend when connectivity returns.

## Assessment Context

This project was built as a technical assessment for a Full-stack Developer role.

The assessment focuses on emergency medical services where field paramedics operate in high-pressure environments with unstable or unavailable network coverage.

The core requirement is simple:

> A valid triage record must never be lost because of network failure.

## Product Summary

RapidTriage EMS helps paramedics log critical patient data quickly using a single-screen mobile form. The app saves every valid submission locally first using SQLite, then syncs pending records to the backend when internet connectivity is restored.

The product is intentionally focused. It does not try to be a full hospital system, dispatch system, or analytics platform. It is a resilient field intake tool built to prove offline-first mobile engineering.

## Core Product Rule

A valid triage record is always saved locally first.

The backend is used for synchronization only after local persistence succeeds.

## Core Features

- Single-screen triage intake form
- Patient Name field
- Condition Description field
- Priority Level selector from 1 to 5
- Status selector: Pending or In-Transit
- Inline validation
- High-visibility color coding for Priority 1 and Priority 2
- Offline-first local persistence using Expo SQLite
- Type-safe local SQL access using Drizzle ORM
- Background sync queue
- Network reconnect detection using NetInfo
- App foreground lifecycle sync
- TanStack Query API mutation layer
- Express backend API
- PostgreSQL remote storage
- Shared Zod validation schemas
- Shared TypeScript types
- Unit tests for critical behavior
- Demo-ready Airplane Mode workflow

## Final Tech Stack

### Mobile

React Native, Expo (SDK 54), Expo Router, TypeScript, NativeWind (v5 + Tailwind v4), Expo SQLite, Drizzle ORM, TanStack Query, React Hook Form, Zod, NetInfo, React Context, Jest, React Native Testing Library.

### Backend

Node.js, Express, PostgreSQL, Drizzle ORM, Zod, CORS, Helmet, Morgan, Jest, Supertest.

### Shared

TypeScript shared types, shared Zod schemas, shared triage constants, shared DTO contracts.

## Why SQLite and PostgreSQL

SQLite is used locally because mobile devices need reliable on-device persistence when offline.

PostgreSQL is used remotely because triage data is structured and relational.

Both are SQL databases, which keeps the architecture consistent and easy to explain. This avoids mixing SQL locally with NoSQL remotely.

## Why Drizzle ORM

Drizzle ORM supports both Expo SQLite and PostgreSQL. This keeps a type-safe SQL approach across the mobile and backend layers, and keeps the database code explicit and readable.

## Why TanStack Query

TanStack Query is used for API communication and sync mutation state. It is **not** used as the durable offline database. Emergency records must be persisted in SQLite first. TanStack Query helps with API mutations, request-level retry, server-state refresh, manual sync trigger, and sync loading/error state.

## Why React Context Instead of Redux

Persistent application data lives in SQLite, and TanStack Query handles API/server-state. Adding Redux would introduce a third state layer without enough benefit for this scope. React Context is used only for lightweight state: online/offline status, last sync time, is-syncing, and last sync error.

## Project Structure

```text
rapidtriage-ems/
├── apps/
│   ├── mobile/
│   └── api/
├── packages/
│   └── shared/
├── context/
├── .claude/
├── CLAUDE.md
├── README.md
├── SETUP.md
├── ARCHITECTURE.md
├── DEMO.md
├── TESTING.md
├── package.json
└── tsconfig.base.json
```

## Offline-First Flow

```text
Paramedic submits form
  → App validates input with Zod
  → App saves record locally into Expo SQLite (sync_status = pending)
  → UI shows success immediately
  → If offline: record stays safely queued
  → If online: sync worker sends pending records to Express
  → Express validates payload with Zod
  → Backend upserts record into PostgreSQL by client_id
  → Mobile marks local record as synced
```

## Sync Flow

```text
Device regains internet
  → NetInfo detects reconnect
  → Sync worker starts (concurrency-guarded)
  → Worker reads pending and failed records from SQLite
  → Worker marks records as syncing
  → TanStack Query mutation posts records to Express API
  → API writes records to PostgreSQL
  → API returns synced client IDs
  → Mobile marks matching records as synced
```

## App Lifecycle Flow

```text
App → background: no destructive action, SQLite keeps records
App → foreground: check network state; if online, run sync worker
```

## Triage Fields

| Field                 | Type    | Required | Notes                 |
| --------------------- | ------- | -------- | --------------------- |
| Patient Name          | String  | Yes      | Cannot be blank       |
| Condition Description | String  | Yes      | Cannot be blank       |
| Priority Level        | Integer | Yes      | 1 to 5                |
| Status                | Enum    | Yes      | Pending or In-Transit |

## Priority Meaning

| Priority | Meaning          | Visual Treatment |
| -------- | ---------------- | ---------------- |
| 1        | Life-threatening | Deep red         |
| 2        | Critical         | Orange/red       |
| 3        | Urgent           | Amber            |
| 4        | Stable           | Blue             |
| 5        | Low urgency      | Green            |

## API Endpoint

```http
POST /api/v1/triage/sync
```

Request:

```json
{
  "records": [
    {
      "clientId": "local-record-id",
      "patientName": "John Kamau",
      "conditionDescription": "Chest pain and shortness of breath",
      "priorityLevel": 1,
      "status": "In-Transit",
      "createdAt": "2026-07-09T20:00:00.000Z",
      "updatedAt": "2026-07-09T20:00:00.000Z"
    }
  ]
}
```

Response:

```json
{
  "ok": true,
  "syncedIds": ["local-record-id"]
}
```

## Running the Project

```bash
npm install         # install all workspaces

# Run everything at once (builds shared, then runs a shared watcher + API + Expo):
npm run dev

# ...or run pieces individually:
npm run build:shared # compile the shared package
npm run api         # start the Express API
npm run mobile      # start the Expo app

npm run test        # run all tests
npm run typecheck   # typecheck all workspaces
npm run lint        # lint mobile + api
```

> `npm run dev` uses [`concurrently`](https://www.npmjs.com/package/concurrently)
> to run the shared-package watcher, the API, and the Expo dev server together
> with prefixed, colour-coded output. It expects `apps/api/.env` (with
> `DATABASE_URL`) and `apps/mobile/.env` to exist — see below. Press `Ctrl+C`
> once to stop all three.

## Environment Variables

Create `apps/api/.env`:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rapidtriage
```

Create `apps/mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:4000
```

## Demo Script

The demo video or GIF should be under 60 seconds.

1. Open RapidTriage EMS and show Online status.
2. Turn on Airplane Mode and return to the app.
3. Show Offline Mode banner.
4. Tap New Triage.
5. Enter patient name: John Kamau.
6. Enter condition: Chest pain and shortness of breath.
7. Select Priority 1 Critical, and In-Transit.
8. Tap Submit → show Saved Offline confirmation.
9. Open Queue → show pending record.
10. Turn off Airplane Mode and return to app.
11. Show Syncing indicator, then Synced status.

## What the Demo Proves

- Offline submission works and shows no generic network error.
- Records are saved locally and survive offline mode.
- Reconnect triggers sync automatically without freezing the UI.
- PostgreSQL receives the record after reconnect.

## Known Scope Decisions

Authentication, maps, push notifications, file uploads, and an admin dashboard are intentionally excluded because they were not required. The backend is intentionally thin and only handles triage sync. The demo uses mock patient data only.

## Future Improvements

Authentication, encrypted local storage, role-based dispatch dashboard, location capture, audit trail, conflict resolution, cloud deployment, admin reporting, and real ambulance crew assignment.
