import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { Pool } from "pg";
import type { TriageSyncRecordPayload } from "@rapidtriage/shared";

/**
 * Remote triage records synced from mobile devices. `client_id` is the
 * device-generated id and is unique, which makes sync idempotent.
 */
export const triageRecords = pgTable("triage_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientId: text("client_id").notNull().unique(),
  patientName: text("patient_name").notNull(),
  conditionDescription: text("condition_description").notNull(),
  priorityLevel: integer("priority_level").notNull(),
  status: text("status").notNull(),
  createdAtClient: timestamp("created_at_client", { withTimezone: true }).notNull(),
  updatedAtClient: timestamp("updated_at_client", { withTimezone: true }).notNull(),
  syncedAt: timestamp("synced_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Persistence boundary — implemented by Postgres here and in-memory in tests. */
export interface TriageRepository {
  /** Upsert records by client_id; returns the client ids that were persisted. */
  upsertRecords(records: TriageSyncRecordPayload[]): Promise<string[]>;
}

export function createDb(databaseUrl: string) {
  const pool = new Pool({ connectionString: databaseUrl });
  return { pool, db: drizzle(pool) };
}

export function createRepository(db: ReturnType<typeof createDb>["db"]): TriageRepository {
  return {
    async upsertRecords(records) {
      if (records.length === 0) return [];
      const rows = records.map((r) => ({
        clientId: r.clientId,
        patientName: r.patientName,
        conditionDescription: r.conditionDescription,
        priorityLevel: r.priorityLevel,
        status: r.status,
        createdAtClient: new Date(r.createdAt),
        updatedAtClient: new Date(r.updatedAt),
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
