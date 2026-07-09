---
paths:
  - "apps/api/src/**"
---

# API Rules

- Use Express.
- Use PostgreSQL.
- Use Drizzle.
- Use shared Zod schemas.
- Keep only triage sync endpoints.
- Make sync idempotent by clientId.
- Keep controllers thin.
- Keep database logic in services.
- Do not add auth.
- Do not add unrelated modules.
