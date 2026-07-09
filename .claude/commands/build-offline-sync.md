---
name: build-offline-sync
description: Build the offline sync engine.
---

Build offline sync.

## Required Behavior

Read pending SQLite records; mark records as syncing; push records to the Express API; mark records as synced on success; mark records as failed on failure; retry failed records on reconnect; prevent concurrent sync runs; trigger sync when the app returns to foreground.

## Required Files

```text
apps/mobile/src/features/sync/syncEngine.ts
apps/mobile/src/features/sync/useSyncOnReconnect.ts
apps/mobile/src/features/sync/useSyncOnForeground.ts
apps/mobile/src/db/repositories/triageLocalRepository.ts
apps/mobile/src/api/triageApi.ts
```

## Required Tests

```text
apps/mobile/__tests__/syncEngine.test.ts
```

## Rules

Never delete failed records. Never block UI. Never call API before local save. Never let two sync jobs run at the same time.
