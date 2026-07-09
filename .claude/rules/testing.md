---
paths:
  - "**/__tests__/**"
  - "**/*.test.ts"
  - "**/*.test.tsx"
---

# Testing Rules

- Test behavior, not implementation details.
- Prioritize validation, local save, sync, and API behavior.
- Avoid unnecessary snapshots.
- Include failure cases.
- Include offline cases.
- Keep tests readable.
- Do not mock away the core business rule unless necessary.

Core rule to test:

```text
A valid record is saved locally before any API request.
```
