---
name: remember
description: Save or restore session memory for this project.
user-invocable: true
---

Use this skill at the start and end of sessions.

## Restore (`/remember restore`)

1. Read context/progress-tracker.md.
2. Read CLAUDE.md.
3. Read context files.
4. Summarize current state.
5. Do not start coding until confirmed.

## Save (`/remember save`)

Update context/progress-tracker.md with: what was built, what changed, what works, what is incomplete, the next task, and risks. Never save secrets.

## Output

```md
Memory updated.

### Current State
[...]

### Next Session Starts With
[...]
```
