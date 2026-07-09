---
name: review-feature
argument-hint: [feature-name]
description: Review feature readiness.
---

Review feature: $ARGUMENTS

## Read First

context/project-overview.md, context/architecture.md, context/code-standards.md, context/ui-rules.md, context/progress-tracker.md.

## Review Layers

1. **Assessment Alignment** — Does it satisfy the assessment?
2. **Architecture Integrity** — Does it respect architecture boundaries?
3. **Production Readiness** — Does it handle real user states?

## Output

```md
## Review — $ARGUMENTS

### Critical Issues
[...]

### Important Issues
[...]

### Minor Issues
[...]

### Verdict
[Ready / Needs fixes]
```

Do not fix unless asked.
