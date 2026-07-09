# UI Registry — RapidTriage EMS

This file tracks reusable UI patterns. Read it before building or modifying UI components.

## Baseline

| Element | Pattern |
|---|---|
| Screen background | `bg-slate-50` |
| Card background | `bg-white` |
| Card border | `border border-slate-200` |
| Card radius | `rounded-2xl` |
| Card padding | `p-4` |
| Primary text | `text-slate-950` |
| Secondary text | `text-slate-700` |
| Muted text | `text-slate-500` |
| Primary button | `h-14 rounded-2xl bg-blue-700` |
| Primary button text | `text-white text-base font-semibold` |
| Input | `rounded-xl border border-slate-300 bg-white px-4 py-3` |
| Error text | `text-sm font-medium text-red-700` |
| Badge | `rounded-full px-3 py-1` |
| Touch target | Minimum 48px, preferred 56px |

## Priority Chip Pattern

| Priority | Selected Pattern |
|---|---|
| 1 | Deep red background (`bg-red-900`), white text |
| 2 | Orange background (`bg-orange-700`), white text |
| 3 | Amber background (`bg-amber-500`), dark text |
| 4 | Blue background (`bg-blue-700`), white text |
| 5 | Green background (`bg-green-700`), white text |

## Connection Banner Pattern

- **Online:** green indicator, "Online", helper "Pending records will sync automatically".
- **Offline:** gray indicator, "Offline mode", helper "Records are saved safely on this device".

## Status Badge Pattern

| Status | Style | Text |
|---|---|---|
| pending | gray badge | Pending |
| syncing | blue badge | Syncing |
| synced | green badge | Synced |
| failed | red badge | Retry pending |

## Component Entries

Add entries here after building each component (via `/imprint`).

### ScreenContainer — `apps/mobile/src/components/ui/ScreenContainer.tsx`
Background `bg-slate-50`, padding `px-4 py-4`, safe area enabled, scroll allowed.

### AppButton — `apps/mobile/src/components/ui/AppButton.tsx`
Height `h-14`, radius `rounded-2xl`, primary `bg-blue-700`, text `text-white text-base font-semibold`, disabled muted + reduced opacity.

### TriageRecordCard — `apps/mobile/src/components/triage/TriageRecordCard.tsx`
`bg-white border border-slate-200 rounded-2xl p-4 gap-2`, title `text-base font-semibold text-slate-950`, subtitle `text-sm text-slate-500`.
