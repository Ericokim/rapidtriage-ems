---
paths:
  - "apps/mobile/src/features/sync/**"
  - "apps/mobile/src/db/**"
---

# Offline First Rules

- Save locally first.
- Use Expo SQLite.
- Use Drizzle.
- Never rely on API before local save.
- Never delete failed records.
- Never block UI during sync.
- Prevent concurrent sync runs.
- Mark records synced only after backend confirms.
- Retry failed records on reconnect.
- Retry failed records on app foreground.
