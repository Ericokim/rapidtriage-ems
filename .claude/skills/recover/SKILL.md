---
name: recover
description: Diagnose the type of failure before attempting fixes.
user-invocable: true
---

Use this skill when something breaks.

## Failure Modes

### Failure Mode 1 — Targeted Bug
A specific isolated thing is broken. Response: find root cause, fix only that issue, add a regression test.

### Failure Mode 2 — Polluted Session
Multiple fixes have made things worse. Response: stop patching, write a reset note, restart from clean context.

### Failure Mode 3 — Wrong Foundation
The approach is wrong. Response: identify the wrong assumption, propose the correct approach, rebuild only after confirmation.

## Output

```md
This looks like Failure Mode [1/2/3] — [name].

Reason:
[...]

Recommended response:
[...]
```
