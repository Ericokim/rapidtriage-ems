# Demo Guide — RapidTriage EMS

The assessment requires a short video clip or GIF under 60 seconds showing the app saving data while offline and automatically syncing once connectivity returns.

## Demo Goal

The demo must prove:

- Offline submission does not fail.
- The record is saved locally.
- The record appears in the pending queue.
- Reconnect is detected automatically.
- Sync runs without user intervention.
- The record becomes synced.

## Demo Data

Use mock patient data only.

```text
Patient Name:          John Kamau
Condition Description: Chest pain and shortness of breath
Priority Level:        1 Critical
Status:                In-Transit
```

## Recording Script

1. Open RapidTriage EMS.
2. Show Home screen and Online status.
3. Turn on Airplane Mode.
4. Return to the app; confirm Offline Mode banner is visible.
5. Tap New Triage.
6. Enter patient name.
7. Enter condition description.
8. Select Priority 1 Critical.
9. Select In-Transit.
10. Tap Submit Triage.
11. Show Saved Offline confirmation.
12. Open Queue and show the pending record.
13. Turn off Airplane Mode.
14. Return to app; show Syncing indicator.
15. Show Synced status.

## Recommended Video Timing

| Time   | Action                                |
| ------ | ------------------------------------- |
| 0–5s   | Open app and show Online state        |
| 5–10s  | Turn on Airplane Mode                 |
| 10–25s | Fill triage form                      |
| 25–32s | Submit and show Saved Offline         |
| 32–40s | Show pending queue                    |
| 40–50s | Turn off Airplane Mode                |
| 50–60s | Show automatic sync and Synced status |

## Demo Checklist

- [ ] App starts cleanly
- [ ] Online/offline banner works
- [ ] Form is single-screen
- [ ] Priority 1 color stands out
- [ ] Offline submit succeeds
- [ ] Saved Offline message appears
- [ ] Queue count updates
- [ ] Pending record appears
- [ ] Reconnect triggers sync
- [ ] Synced status appears
- [ ] Video/GIF is under 60 seconds

## Common Demo Mistakes to Avoid

Do not show technical logs, use real patient data, wait too long on setup, over-explain in the video, show unrelated screens, or let sync happen before showing the pending queue.
