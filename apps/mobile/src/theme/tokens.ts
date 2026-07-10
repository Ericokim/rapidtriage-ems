import type {
  SyncStatus,
  TriagePriority,
  TriageStatus,
} from "@rapidtriage/shared";
import { PRIORITY_META } from "@rapidtriage/shared";

/**
 * RapidTriage EMS design tokens — extracted from the approved mobile designs.
 * Navy foundation, red→orange gradient CTAs, semantic priority + sync colors.
 * Colored elements use these hex values via inline styles; layout/typography
 * use NativeWind classes.
 */

export const colors = {
  navy950: "#001A52",
  navy900: "#0A1F44",
  navy800: "#082B72",
  navy700: "#123D91",

  red600: "#FF1F2D",
  red500: "#FF3340",
  red100: "#FFE8EA",
  red50: "#FFF1F2",

  orange600: "#FF6B00",
  orange500: "#FF7A1A",
  orange100: "#FFF0DE",
  orange50: "#FFF7ED",

  amber600: "#D97706",
  amber500: "#F5A400",
  amber100: "#FEF3C7",
  amber50: "#FFFBEB",

  blue600: "#2563EB",
  blue500: "#3B82F6",
  blue100: "#DBEAFE",
  blue50: "#EFF6FF",

  green600: "#12B76A",
  green500: "#22C55E",
  green100: "#DCFCE7",
  green50: "#F0FDF4",

  slate900: "#071A44",
  slate800: "#10234D",
  slate700: "#334155",
  slate600: "#475569",
  slate500: "#64748B",
  slate400: "#94A3B8",
  slate300: "#CBD5E1",
  slate200: "#E2E8F0",
  slate100: "#F1F5F9",
  slate50: "#F8FAFC",

  white: "#FFFFFF",
  background: "#FFFFFF",
} as const;

/** Red → orange gradient used on primary CTAs. */
export const CTA_GRADIENT = ["#FF1F2D", "#FF7A1A"] as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  "2xl": 28,
  full: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: "#001A52",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  soft: {
    shadowColor: "#001A52",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
} as const;

export interface PriorityStyle {
  level: TriagePriority;
  label: string;
  solid: string;
  text: string;
  bg: string;
  border: string;
}

export const PRIORITY: Record<TriagePriority, PriorityStyle> = {
  1: { level: 1, label: "Critical", solid: colors.red600, text: colors.red600, bg: colors.red50, border: colors.red500 },
  2: { level: 2, label: "Severe", solid: colors.orange600, text: colors.orange600, bg: colors.orange50, border: colors.orange500 },
  3: { level: 3, label: "Urgent", solid: colors.amber500, text: colors.amber600, bg: colors.amber50, border: colors.amber500 },
  4: { level: 4, label: "Stable", solid: colors.blue500, text: colors.blue600, bg: colors.blue50, border: colors.blue500 },
  5: { level: 5, label: "Low", solid: colors.green500, text: colors.green600, bg: colors.green50, border: colors.green500 },
};

export type IoniconName = string;

export interface SyncStyle {
  label: string;
  text: string;
  bg: string;
  border: string;
  icon: IoniconName;
}

export const SYNC: Record<SyncStatus, SyncStyle> = {
  pending: { label: "Pending Sync", text: colors.orange600, bg: colors.orange50, border: "#FDBA74", icon: "cloud-upload-outline" },
  syncing: { label: "Syncing", text: colors.blue600, bg: colors.blue50, border: "#93C5FD", icon: "sync" },
  synced: { label: "Synced", text: colors.green600, bg: colors.green50, border: "#86EFAC", icon: "checkmark-circle" },
  failed: { label: "Failed", text: colors.red600, bg: colors.red50, border: "#FDA4AF", icon: "alert-circle" },
};

export interface TransportStyle {
  label: string;
  text: string;
  bg: string;
  icon: IoniconName;
}

export const TRANSPORT: Record<TriageStatus, TransportStyle> = {
  Pending: { label: "Pending", text: colors.slate600, bg: colors.slate100, icon: "time-outline" },
  "In-Transit": { label: "In-Transit", text: colors.blue600, bg: colors.blue50, icon: "bus-outline" },
};

export function priorityLabel(level: TriagePriority): string {
  return PRIORITY[level]?.label ?? PRIORITY_META[level]?.label ?? `Priority ${level}`;
}
