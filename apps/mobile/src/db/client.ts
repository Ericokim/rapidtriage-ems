import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";
import { CREATE_TRIAGE_TABLE_SQL } from "./schema";
import { createExpoSqliteTriageTable } from "./expoSqliteTable";
import {
  createTriageLocalRepository,
  type TriageLocalRepository,
  type TriageLocalTable,
} from "./triageLocalRepository";

const DATABASE_NAME = "rapidtriage.db";

let sqlite: SQLiteDatabase | null = null;
let table: TriageLocalTable | null = null;
let repository: TriageLocalRepository | null = null;

/** Open the database once and ensure the schema exists. */
function getSqlite(): SQLiteDatabase {
  if (!sqlite) {
    sqlite = openDatabaseSync(DATABASE_NAME);
    sqlite.execSync(CREATE_TRIAGE_TABLE_SQL);
  }
  return sqlite;
}

/** Low-level table singleton (used for seeding starter data). */
export function getTriageLocalTable(): TriageLocalTable {
  if (!table) {
    table = createExpoSqliteTriageTable(getSqlite());
  }
  return table;
}

/** App-wide singleton repository backed by Expo SQLite. */
export function getTriageLocalRepository(): TriageLocalRepository {
  if (!repository) {
    repository = createTriageLocalRepository(getTriageLocalTable());
  }
  return repository;
}
