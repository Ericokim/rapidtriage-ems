import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Remote triage records synced from mobile devices.
 * `client_id` is the device-generated local id and is unique, which makes
 * sync idempotent: re-syncing the same record updates the existing row.
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

export type TriageRecordRow = typeof triageRecords.$inferSelect;
export type NewTriageRecordRow = typeof triageRecords.$inferInsert;
