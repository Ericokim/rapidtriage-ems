import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Local (on-device) triage table. This is the durable source of truth while
 * the paramedic is offline. Column names are snake_case; Drizzle exposes them
 * with the camelCase keys declared here.
 */
export const triageRecords = sqliteTable("triage_records", {
  id: text("id").primaryKey(),
  patientName: text("patient_name").notNull(),
  conditionDescription: text("condition_description").notNull(),
  priorityLevel: integer("priority_level").notNull(),
  status: text("status").notNull(),
  syncStatus: text("sync_status").notNull(),
  retryCount: integer("retry_count").notNull().default(0),
  lastSyncError: text("last_sync_error"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  syncedAt: text("synced_at"),
});

/** DDL executed once on startup to guarantee the table exists. */
export const CREATE_TRIAGE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS triage_records (
  id TEXT PRIMARY KEY NOT NULL,
  patient_name TEXT NOT NULL,
  condition_description TEXT NOT NULL,
  priority_level INTEGER NOT NULL,
  status TEXT NOT NULL,
  sync_status TEXT NOT NULL,
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_sync_error TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  synced_at TEXT
);
`;
