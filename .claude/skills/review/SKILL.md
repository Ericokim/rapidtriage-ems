---
name: review
description: Review a completed feature for correctness, architecture, UX, and readiness.
user-invocable: true
---

Use this skill after building a feature.

## Review Layers

1. **Plan Alignment** — Check whether the feature matches the assessment and build plan.
2. **System Integrity** — Check architecture boundaries, code standards, and design system consistency.
3. **Production Readiness** — Check error states, loading states, edge cases, offline behavior, and tests.

## Output

```md
## Review — [Feature]

### Layer 1 — Plan Alignment
[PASS / ISSUES]

### Layer 2 — System Integrity
[PASS / ISSUES]

### Layer 3 — Production Readiness
[PASS / ISSUES]

### Summary
[Ready / Needs fixes]
```

Do not fix issues unless asked.
