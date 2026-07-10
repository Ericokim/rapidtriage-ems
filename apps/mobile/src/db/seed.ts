import AsyncStorage from "@react-native-async-storage/async-storage";
import type { TriagePriority, TriageStatus, SyncStatus } from "@rapidtriage/shared";
import type { TriageLocalTable } from "./triageLocalRepository";

/** Bumped if the seed set changes so a fresh set can be introduced later. */
const SEED_FLAG = "rt.seeded_v1";

interface SeedSpec {
  /** Stable id so re-installs and multiple devices upsert the same backend row. */
  id: string;
  patientName: string;
  conditionDescription: string;
  priorityLevel: TriagePriority;
  status: TriageStatus;
  syncStatus: Extract<SyncStatus, "pending" | "synced">;
  /** How long ago the record was created, so History groups across days. */
  minutesAgo: number;
}

/**
 * Starter records shown on first launch so the dashboard, metrics and history
 * are not empty out of the box. The mix spans every priority (including the
 * Priority 1 & 2 hazard levels), both statuses, and a blend of already-synced
 * and still-pending records so the sync UI has something to show.
 */
const SEEDS: SeedSpec[] = [
  {
    id: "seed-john-carter",
    patientName: "John Carter",
    conditionDescription: "Crushing chest pain radiating to the left arm, diaphoretic and short of breath. Suspected acute MI.",
    priorityLevel: 1,
    status: "In-Transit",
    syncStatus: "synced",
    minutesAgo: 35,
  },
  {
    id: "seed-maria-gomez",
    patientName: "Maria Gomez",
    conditionDescription: "Severe respiratory distress with audible wheeze, SpO2 88% on room air. History of asthma.",
    priorityLevel: 2,
    status: "In-Transit",
    syncStatus: "synced",
    minutesAgo: 90,
  },
  {
    id: "seed-david-lee",
    patientName: "David Lee",
    conditionDescription: "Fall from ladder, deformed and painful right forearm. Suspected closed fracture, distal pulses intact.",
    priorityLevel: 3,
    status: "Pending",
    syncStatus: "pending",
    minutesAgo: 150,
  },
  {
    id: "seed-sarah-johnson",
    patientName: "Sarah Johnson",
    conditionDescription: "Deep laceration to the left palm from broken glass, bleeding controlled with direct pressure.",
    priorityLevel: 3,
    status: "Pending",
    syncStatus: "synced",
    minutesAgo: 1560,
  },
  {
    id: "seed-ahmed-khan",
    patientName: "Ahmed Khan",
    conditionDescription: "Localized urticaria after a bee sting, no airway involvement, vitals stable. Monitoring for progression.",
    priorityLevel: 4,
    status: "Pending",
    syncStatus: "pending",
    minutesAgo: 1620,
  },
  {
    id: "seed-emily-davis",
    patientName: "Emily Davis",
    conditionDescription: "Minor abrasions to both knees after a bicycle fall, fully alert with stable vitals.",
    priorityLevel: 5,
    status: "Pending",
    syncStatus: "synced",
    minutesAgo: 1710,
  },
];

/**
 * Populate the local database with starter records the first time the app runs
 * on a device. Runs at most once (guarded by an AsyncStorage flag) so clearing
 * records later does not silently repopulate them. Returns true if it seeded.
 */
export async function seedLocalTriageRecordsIfEmpty(
  table: TriageLocalTable
): Promise<boolean> {
  if ((await AsyncStorage.getItem(SEED_FLAG)) === "true") return false;

  const existing = await table.selectAll();
  if (existing.length > 0) {
    // Real data already present: mark seeded and leave it alone.
    await AsyncStorage.setItem(SEED_FLAG, "true");
    return false;
  }

  const nowMs = Date.now();
  for (const spec of SEEDS) {
    const createdAt = new Date(nowMs - spec.minutesAgo * 60_000).toISOString();
    await table.insert({
      id: spec.id,
      patientName: spec.patientName,
      conditionDescription: spec.conditionDescription,
      priorityLevel: spec.priorityLevel,
      status: spec.status,
      syncStatus: spec.syncStatus,
      retryCount: 0,
      lastSyncError: null,
      createdAt,
      updatedAt: createdAt,
      syncedAt: spec.syncStatus === "synced" ? createdAt : null,
    });
  }

  await AsyncStorage.setItem(SEED_FLAG, "true");
  return true;
}
