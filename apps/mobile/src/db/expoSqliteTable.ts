import { desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/expo-sqlite";
import type { SQLiteDatabase } from "expo-sqlite";
import type {
  SyncStatus,
  TriagePriority,
  TriageStatus,
} from "@rapidtriage/shared";
import { triageRecords } from "./schema";
import type { TriageLocalTable } from "./triageLocalRepository";

type Row = typeof triageRecords.$inferSelect;

function fromRow(row: Row): LocalTriageRecord {
  return {
    id: row.id,
    patientName: row.patientName,
    conditionDescription: row.conditionDescription,
    priorityLevel: row.priorityLevel as TriagePriority,
    status: row.status as TriageStatus,
    syncStatus: row.syncStatus as SyncStatus,
    retryCount: row.retryCount,
    lastSyncError: row.lastSyncError ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    syncedAt: row.syncedAt ?? null,
  };
}

/**
 * Drizzle-backed implementation of the local table over Expo SQLite.
 * Only imported by the app runtime, never by tests.
 */
export function createExpoSqliteTriageTable(
  sqlite: SQLiteDatabase
): TriageLocalTable {
  const db = drizzle(sqlite);

  return {
    async insert(record) {
      await db.insert(triageRecords).values(record);
    },

    async getById(id) {
      const rows = await db
        .select()
        .from(triageRecords)
        .where(eq(triageRecords.id, id));
      return rows[0] ? fromRow(rows[0]) : null;
    },

    async selectAll() {
      const rows = await db
        .select()
        .from(triageRecords)
        .orderBy(desc(triageRecords.createdAt));
      return rows.map(fromRow);
    },

    async selectByStatuses(statuses: SyncStatus[]) {
      if (statuses.length === 0) return [];
      const rows = await db
        .select()
        .from(triageRecords)
        .where(inArray(triageRecords.syncStatus, statuses))
        .orderBy(desc(triageRecords.createdAt));
      return rows.map(fromRow);
    },

    async update(id, patch) {
      await db.update(triageRecords).set(patch).where(eq(triageRecords.id, id));
    },
  };
}
