---
name: generate-tests
argument-hint: [target-feature]
description: Generate focused tests for assessment-critical behavior.
---

Generate tests for: $ARGUMENTS

## Test Priorities

Shared validation, local save, offline submit, pending queue, sync engine, API sync endpoint, failed sync retry.

## Rules

Test behavior, not implementation details. Avoid unnecessary snapshots. Cover success and failure paths and offline cases. Keep tests readable.

## After Generating

Run:

```bash
npm run test
npm run typecheck
```

Then report:

```md
## Tests Generated

### Files Added
[...]

### Scenarios Covered
[...]

### Results
[...]
```
