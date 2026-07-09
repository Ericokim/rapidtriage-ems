/**
 * Triage domain constants shared by the mobile app and the backend API.
 * Keep this file as the single source of truth for priorities and statuses.
 */

export const TRIAGE_PRIORITIES = [1, 2, 3, 4, 5] as const;

export const TRIAGE_STATUSES = ["Pending", "In-Transit"] as const;

export const SYNC_STATUSES = ["pending", "syncing", "synced", "failed"] as const;

/** Field length guards used by validation and inputs. */
export const TRIAGE_FIELD_LIMITS = {
  patientName: { min: 1, max: 120 },
  conditionDescription: { min: 1, max: 1000 },
} as const;

export interface PriorityMeta {
  level: (typeof TRIAGE_PRIORITIES)[number];
  label: string;
  meaning: string;
  /** Hex used for reference; the mobile theme maps these to NativeWind classes. */
  color: string;
}

export const PRIORITY_META: Record<number, PriorityMeta> = {
  1: { level: 1, label: "Critical", meaning: "Life-threatening", color: "#B71C1C" },
  2: { level: 2, label: "Severe", meaning: "Critical", color: "#E65100" },
  3: { level: 3, label: "Urgent", meaning: "Urgent", color: "#F9A825" },
  4: { level: 4, label: "Stable", meaning: "Stable", color: "#1565C0" },
  5: { level: 5, label: "Low", meaning: "Low urgency", color: "#2E7D32" },
};

/** Priority levels considered high-visibility hazard cases. */
export const HAZARD_PRIORITIES: ReadonlyArray<number> = [1, 2];

export function isHazardPriority(level: number): boolean {
  return HAZARD_PRIORITIES.includes(level);
}
