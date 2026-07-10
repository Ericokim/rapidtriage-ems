# Design Audit — RapidTriage EMS Mobile

Source: 8 primary screen references in `/Users/eric/Downloads/mobile-app design`
(`…02_16_01 AM (1)…(8).png`). Batches 03:19–03:21 are style variations/assets.

## Detected screens
1. Home / Dashboard
2. New Triage — single-page form (assessment-preferred)
3. New Triage — multi-step step 1 (optional, deferred)
4. New Triage — multi-step step 2 (optional, deferred)
5. Saved Offline (confirmation)
6. Queue (pending / failed tabs, sync now)
7. History (search, filter chips, date groups)
8. Record Details (read-only, activity timeline)

## Design language
- **Background:** white `#FFFFFF` (not slate-50).
- **Primary text / brand:** navy `#001A52`. Brand wordmark: "Rapid"(navy) "Triage"(red) "EMS"(navy), star-of-life mark.
- **Primary CTA:** red→orange gradient `#FF1F2D → #FF7A1A`.
- **Secondary CTA / selected segment / some headers:** solid navy `#0A1F44`.
- **Priority:** 1 red `#FF1F2D`, 2 orange `#FF6B00`, 3 amber `#F5A400`, 4 blue `#3B82F6`, 5 green `#22C55E`.
- **Sync badges (pill):** Pending Sync (orange, cloud-up), Syncing (blue, spinner), Synced (green, check), Failed (red, alert).
- **Cards:** white, radius ~20, soft navy-tinted shadow, hairline border.
- **Avatars:** priority-colored circle + person glyph.
- **Bottom nav:** Home · New Triage · Queue · History; active = red.

## Component inventory (to build/redesign)
Theme tokens · AppHeader · ScreenHeader · Avatar · StatusBadge · PriorityBadge ·
MetricCard · ActionCard · TriageRecordCard (redesign) · PrioritySelector (card
style) · StatusSegmentedControl (navy selected) · InfoCallout · StickyBottomAction ·
AppInput (icon) · AppTextArea (counter) · AppButton (gradient/navy/outline) ·
GradientButton · ActivityTimeline · BottomTabs.

## Icons / assets
Use `@expo/vector-icons` (Ionicons + MaterialCommunityIcons: `star-of-life`,
`ambulance`, `truck`, `cloud-upload`, etc.) rather than slicing the ChatGPT PNGs,
which are full compositions not clean transparent assets. Star-of-life and the
Saved-Offline illustration approximated with vector icons.

## Data-model note
Record Details reference shows Age/Gender/Location/Reported-By — **not in our data
model** (name, condition, priority, status, sync fields, timestamps). We render the
fields we actually have (+ a Record ID derived from the local id) and omit invented
clinical fields rather than fake data.

## Navigation change
Move from a plain Stack to Expo Router **Tabs** (Home/Queue/History) with a "New
Triage" tab button that pushes `/triage/new` (form shown without the tab bar,
sticky submit). Stack routes: `triage/new`, `triage/saved-offline`, `records/[id]`.

## Preserved (do not touch)
SyncProvider, NetworkProvider, repository, sync engine, API, shared schema, tests.
UI-only redesign.

## Implementation status (done)
Verified on the iOS Simulator (screenshots) against the references:
- ✅ Home — branding, Online badge, 4-metric card, gradient CTA, View Queue, record list, bottom tabs
- ✅ New Triage (single-page) — icon input, 0/500 textarea, 5 colour priority cards, navy segmented status, Emergency Note + saved-locally callouts, gradient Save & Submit
- ✅ Queue — metrics, Pending/Failed tabs, Sync Now, empty state
- ✅ History — search, filter chips, date-grouped record cards
- ✅ Record card — priority avatar, priority + sync badges
- ✅ Record Details — navy header, summary, patient info, condition, priority scale, transport, sync status, activity timeline
- ✅ Saved Offline — illustration, summary card, callout, View Queue / Create Another
- Navigation moved to Expo Router Tabs + custom bottom bar; stack routes for form / saved-offline / details.

## Known deviations
- **Multi-step form (screens 3–4) not built** — single-page form is the assessment-preferred flow; deferred per prompt.
- **Save & Submit is at the end of the scroll**, not OS-sticky (functionally equivalent; keeps one form component + test).
- **Record Details** omits Age/Gender/Location/Reported-By (not in the data model); shows real fields + Record ID.
- Star-of-life logo approximated with Ionicons `medical`; illustrations composed from vector icons (no sliced PNGs).
- `@expo/vector-icons` + `expo-linear-gradient` mocked in Jest (font/native view not needed for tests).
