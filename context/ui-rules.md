# UI Rules — RapidTriage EMS

## UX Principle

This app is used in stressful emergency environments. Every screen should reduce thinking. Every action should be obvious. Every important state should be visible.

## Main Rules

1. Keep the triage form single-screen.
2. Use large controls.
3. Make priority selection visual.
4. Avoid unnecessary navigation.
5. Offline state must feel safe.
6. Sync status must be visible but not distracting.
7. Use inline validation.
8. Avoid technical error messages.
9. Keep colors semantic.
10. Design for one-handed use.

## Home Screen

Shows online/offline state, pending sync count, quick access to New Triage, and recent records.

```text
┌──────────────────────────────┐
│ RapidTriage EMS               │
│ Online • Ready to sync        │
├──────────────────────────────┤
│ Pending Sync — 2 waiting      │
├──────────────────────────────┤
│ + New Triage                  │
├──────────────────────────────┤
│ Recent Records                │
│ John Kamau — P1 Critical • Synced   │
│ Mary Wanjiku — P2 Severe • Pending  │
└──────────────────────────────┘
```

## New Triage Screen

Single-screen intake capture.

```text
┌──────────────────────────────┐
│ New Triage — Offline-safe     │
│ Patient Name  [ John Kamau ]  │
│ Condition     [ Chest pain… ] │
│ Priority  [1 Critical][2 Severe] │
│           [3 Urgent][4 Stable][5 Low] │
│ Status    [ Pending ][ In-Transit ]  │
│ [ Submit Triage ]             │
└──────────────────────────────┘
```

## Queue Screen

Locally saved records waiting to sync (pending + failed retry), with created times and a "safe locally" message.

## History Screen

All locally captured triage records with priority, status, and sync status.

## Validation UX

Inline validation, e.g. "Patient name is required.", "Condition description is required.", "Select a priority level.", "Select the current transport status." Do not use blocking alert popups for normal validation.

## Offline UX

When offline show: `Offline mode — Records are saved safely and will sync automatically.` Never show: `No internet. Request failed.`

## Submission Feedback

- Online success: `Triage saved — Record was saved locally and is syncing.`
- Offline success: `Saved offline — Record is safe on this device and will sync automatically.`
- Sync failure: `Sync delayed — Record is still saved and will retry automatically.`

## Priority Selector UX

Priority buttons show both number and meaning: `1 Critical`, `2 Severe`, `3 Urgent`, `4 Stable`, `5 Low`. Priority 1 (deep red) and 2 (orange) must be visually strong; unselected 1/2 use colored borders; a warning helper appears when 1 or 2 is selected.

## Status Selector UX

Use a segmented control: `[ Pending ] [ In-Transit ]`. Avoid dropdowns.

## Empty States

- Queue: `Everything is synced — No records are waiting to upload.`
- History: `No triage records yet — Create your first patient triage record.`

## Loading States

Do not use full-screen loaders for sync. Show a small indicator like `Syncing 2 records...` while keeping the app usable.

## Accessibility

Minimum touch target 48px (preferred 56px), high contrast text, no color-only meaning (use labels too), labeled inputs, clear button text, and critical priority conveyed with text plus color.
