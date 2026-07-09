import type { SyncStatus } from "@rapidtriage/shared";
import type { TriageLocalTable } from "@/src/db/triageLocalRepository";

/** In-memory TriageLocalTable used by repository and sync engine tests. */
export function createInMemoryTriageTable(): TriageLocalTable & {
  rows: Map<string, LocalTriageRecord>;
} {
  const rows = new Map<string, LocalTriageRecord>();
  return {
    rows,
    async insert(record) {
      rows.set(record.id, { ...record });
    },
    async getById(id) {
      const row = rows.get(id);
      return row ? { ...row } : null;
    },
    async selectAll() {
      return [...rows.values()].map((row) => ({ ...row }));
    },
    async selectByStatuses(statuses: SyncStatus[]) {
      return [...rows.values()]
        .filter((row) => statuses.includes(row.syncStatus))
        .map((row) => ({ ...row }));
    },
    async update(id, patch) {
      const row = rows.get(id);
      if (row) rows.set(id, { ...row, ...patch });
    },
  };
}
