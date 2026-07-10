import type { SyncStatus } from "@rapidtriage/shared";
import {
  createTriageLocalRepository,
  type TriageLocalRepository,
  type TriageLocalTable,
} from "./triageLocalRepository";

/**
 * Web fallback for the local database.
 *
 * This app is native-first: on iOS/Android `client.ts` uses Expo SQLite. Web is
 * not a supported target (Expo SQLite's web build needs a WASM asset that is not
 * wired up here), so on web we resolve this file instead and back the repository
 * with an ephemeral in-memory store. This keeps the web bundle building and the
 * app runnable in a browser, without persistence.
 */
function createInMemoryTable(): TriageLocalTable {
  const rows = new Map<string, LocalTriageRecord>();
  return {
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

let table: TriageLocalTable | null = null;
let repository: TriageLocalRepository | null = null;

/** Low-level table singleton (used for seeding starter data). */
export function getTriageLocalTable(): TriageLocalTable {
  if (!table) {
    table = createInMemoryTable();
  }
  return table;
}

export function getTriageLocalRepository(): TriageLocalRepository {
  if (!repository) {
    repository = createTriageLocalRepository(getTriageLocalTable());
  }
  return repository;
}
