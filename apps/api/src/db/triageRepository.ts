import { sql } from "drizzle-orm";
import type { TriageSyncRecordPayload } from "@rapidtriage/shared";
import type { Database } from "./client";
import { triageRecords } from "./schema";

/**
 * Persistence boundary for triage sync. Implemented by Drizzle/PostgreSQL in
 * production and by an in-memory version in tests, so the sync endpoint can be
 * exercised without a live database.
 */
export interface TriageRepository {
  /** Upsert records by client_id and return the client ids that were persisted. */
  upsertRecords(records: TriageSyncRecordPayload[]): Promise<string[]>;
}

export function createDrizzleTriageRepository(db: Database): TriageRepository {
  return {
    async upsertRecords(records) {
      if (records.length === 0) return [];

      const rows = records.map((record) => ({
        clientId: record.clientId,
        patientName: record.patientName,
        conditionDescription: record.conditionDescription,
        priorityLevel: record.priorityLevel,
        status: record.status,
        createdAtClient: new Date(record.createdAt),
        updatedAtClient: new Date(record.updatedAt),
      }));

      const inserted = await db
        .insert(triageRecords)
        .values(rows)
        .onConflictDoUpdate({
          target: triageRecords.clientId,
          set: {
            patientName: sql`excluded.patient_name`,
            conditionDescription: sql`excluded.condition_description`,
            priorityLevel: sql`excluded.priority_level`,
            status: sql`excluded.status`,
            updatedAtClient: sql`excluded.updated_at_client`,
            syncedAt: sql`now()`,
            updatedAt: sql`now()`,
          },
        })
        .returning({ clientId: triageRecords.clientId });

      return inserted.map((row) => row.clientId);
    },
  };
}
