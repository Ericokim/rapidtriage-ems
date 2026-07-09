# UI Tokens — RapidTriage EMS

## Design Direction

The interface should feel like a professional emergency medical field tool: fast, calm, clear, high contrast, thumb-friendly, professional, minimal. It should not feel playful, decorative, overdesigned, distracting, or like a generic form app.

## Color Tokens

```ts
export const colors = {
  brand: {
    primary: "#1565C0",
    primaryDark: "#0D47A1",
    primaryLight: "#E3F2FD",
  },
  priority: {
    1: "#B71C1C",
    2: "#E65100",
    3: "#F9A825",
    4: "#1565C0",
    5: "#2E7D32",
  },
  status: {
    pending: "#6B7280",
    syncing: "#2563EB",
    synced: "#2E7D32",
    failed: "#C62828",
    offline: "#4B5563",
    online: "#2E7D32",
  },
  surface: {
    background: "#F7F9FC",
    card: "#FFFFFF",
    muted: "#F1F5F9",
    border: "#E5E7EB",
  },
  text: {
    primary: "#111827",
    secondary: "#374151",
    muted: "#6B7280",
    inverse: "#FFFFFF",
    danger: "#B71C1C",
  },
};
```

## Priority Meaning

| Priority | Meaning          | Color      |
| -------- | ---------------- | ---------- |
| 1        | Life-threatening | Deep red   |
| 2        | Critical         | Orange red |
| 3        | Urgent           | Amber      |
| 4        | Stable           | Blue       |
| 5        | Low urgency      | Green      |

## Typography

```ts
export const typography = { xs: 12, sm: 14, base: 16, lg: 18, xl: 22, "2xl": 28 };
```

Screen title 24–28 bold, section title 18 semibold, input label 14 semibold, body 16, helper 13–14, button 16 bold, badge 12–13 semibold.

## Spacing / Radius

```ts
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, "2xl": 32 };
export const radius  = { sm: 8, md: 12, lg: 16, xl: 20, full: 999 };
```

## Touch Targets

Minimum 48px; preferred emergency-use 56px.

## Component Patterns (NativeWind classes)

- **Screen:** `bg-slate-50 px-4 py-4`
- **Card:** `bg-white border border-slate-200 rounded-2xl p-4`
- **Primary button:** `bg-blue-700 text-white rounded-2xl h-14 font-semibold`
- **Input:** `bg-white border border-slate-300 rounded-xl px-4 py-3 text-base`
- **Error text:** `text-red-700 text-sm font-medium`
- **Muted text:** `text-slate-500 text-sm`

## Priority Chip Pattern (selected)

- Priority 1: `bg-red-900 text-white border-red-900`
- Priority 2: `bg-orange-700 text-white border-orange-700`
- Priority 3: `bg-amber-500 text-slate-950 border-amber-500`
- Priority 4: `bg-blue-700 text-white border-blue-700`
- Priority 5: `bg-green-700 text-white border-green-700`
