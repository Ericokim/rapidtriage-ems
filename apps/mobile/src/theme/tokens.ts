import {
  PRIORITY_META,
  type SyncStatus,
  type TriagePriority,
} from "@rapidtriage/shared";

/** Raw hex tokens for non-className usage (status dots, etc.). Mirrors ui-tokens.md. */
export const colors = {
  online: "#2E7D32",
  offline: "#4B5563",
  pending: "#6B7280",
  syncing: "#2563EB",
  synced: "#2E7D32",
  failed: "#C62828",
} as const;

export interface PriorityChipStyle {
  selected: string;
  selectedText: string;
  unselected: string;
  unselectedText: string;
}

/**
 * NativeWind class maps for priority chips. Priority 1 (deep red) and 2 (orange)
 * are deliberately prominent even when unselected.
 */
export const PRIORITY_CHIP: Record<TriagePriority, PriorityChipStyle> = {
  1: {
    selected: "bg-red-900 border-red-900",
    selectedText: "text-white",
    unselected: "bg-white border-red-700",
    unselectedText: "text-red-800",
  },
  2: {
    selected: "bg-orange-700 border-orange-700",
    selectedText: "text-white",
    unselected: "bg-white border-orange-600",
    unselectedText: "text-orange-800",
  },
  3: {
    selected: "bg-amber-500 border-amber-500",
    selectedText: "text-slate-950",
    unselected: "bg-white border-slate-300",
    unselectedText: "text-slate-800",
  },
  4: {
    selected: "bg-blue-700 border-blue-700",
    selectedText: "text-white",
    unselected: "bg-white border-slate-300",
    unselectedText: "text-slate-800",
  },
  5: {
    selected: "bg-green-700 border-green-700",
    selectedText: "text-white",
    unselected: "bg-white border-slate-300",
    unselectedText: "text-slate-800",
  },
};

export interface StatusBadgeStyle {
  label: string;
  container: string;
  text: string;
}

export const STATUS_BADGE: Record<SyncStatus, StatusBadgeStyle> = {
  pending: {
    label: "Pending",
    container: "bg-slate-100",
    text: "text-slate-600",
  },
  syncing: {
    label: "Syncing",
    container: "bg-blue-100",
    text: "text-blue-700",
  },
  synced: {
    label: "Synced",
    container: "bg-green-100",
    text: "text-green-700",
  },
  failed: {
    label: "Retry pending",
    container: "bg-red-100",
    text: "text-red-700",
  },
};

export function priorityLabel(level: TriagePriority): string {
  return PRIORITY_META[level]?.label ?? `Priority ${level}`;
}
