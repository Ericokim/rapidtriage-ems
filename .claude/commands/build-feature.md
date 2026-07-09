---
name: build-feature
argument-hint: [feature-name]
description: Build a feature with KISS/DRY discipline.
---

Build: $ARGUMENTS

## Before Coding

1. Read context/architecture.md.
2. Read context/code-standards.md.
3. Read context/build-plan.md.
4. Identify the ownership layer: UI, Local DB, Sync, API, Shared, or Test.

## Rules

Keep implementation minimal. Respect the SQL-to-SQL architecture. Save locally before API where relevant. Use shared schemas. Add tests if logic is involved. Update progress-tracker.md.

## After Coding

Run:

```bash
npm run typecheck
npm run test
```

Then summarize:

```md
## Feature Built — $ARGUMENTS

### Files Changed
[...]

### Behavior Added
[...]

### Tests
[...]

### Next Step
[...]
```
