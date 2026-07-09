import type { TriageSyncRecordPayload } from "@rapidtriage/shared";
import type { TriageRepository } from "./triageRepository";

/**
 * In-memory repository used by tests. Keyed by clientId so re-syncing the same
 * record overwrites in place, mirroring the idempotent upsert of PostgreSQL.
 */
export function createInMemoryTriageRepository(): TriageRepository & {
  store: Map<string, TriageSyncRecordPayload>;
} {
  const store = new Map<string, TriageSyncRecordPayload>();
  return {
    store,
    async upsertRecords(records) {
      for (const record of records) {
        store.set(record.clientId, record);
      }
      return records.map((record) => record.clientId);
    },
  };
}
