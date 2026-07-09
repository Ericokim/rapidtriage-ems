---
name: imprint
description: Capture UI patterns after building components and update ui-registry.md.
user-invocable: true
---

Use this after building or changing UI components.

## Steps

1. Identify the component changed.
2. Read the component file.
3. Extract reusable visual patterns: background, border, radius, spacing, typography, color, touch target, states.
4. Update context/ui-registry.md.
5. Report what was captured.

## Output

```md
Imprinted [Component] into context/ui-registry.md.

Captured:
- Background:
- Border:
- Radius:
- Spacing:
- Text:
- States:
```

Do not capture one-off layout dimensions unless they are part of the design system.
