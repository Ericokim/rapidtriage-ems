---
name: offline-sync
description: Apply offline-first reasoning to local persistence and sync behavior.
user-invocable: true
---

Use this whenever implementing or reviewing sync behavior.

## Core Rule

A valid triage record must be saved locally before any API call.

## Required Checks

- Offline submit works.
- Record is saved to SQLite.
- Pending records are queryable.
- NetInfo triggers sync on reconnect.
- App foreground triggers sync.
- Sync success marks records synced.
- Sync failure leaves records queued.
- Retry count increments.
- Concurrent sync is prevented.

## Output

```md
## Offline Sync Review

### Local Save
[pass/fail]

### Queue
[pass/fail]

### Reconnect Sync
[pass/fail]

### Retry Safety
[pass/fail]

### UI Safety
[pass/fail]

### Verdict
[ready/not ready]
```
