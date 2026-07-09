import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";
import { CREATE_TRIAGE_TABLE_SQL } from "./schema";
import { createExpoSqliteTriageTable } from "./expoSqliteTable";
import {
  createTriageLocalRepository,
  type TriageLocalRepository,
} from "./triageLocalRepository";

const DATABASE_NAME = "rapidtriage.db";

let sqlite: SQLiteDatabase | null = null;
let repository: TriageLocalRepository | null = null;

/** Open the database once and ensure the schema exists. */
function getSqlite(): SQLiteDatabase {
  if (!sqlite) {
    sqlite = openDatabaseSync(DATABASE_NAME);
    sqlite.execSync(CREATE_TRIAGE_TABLE_SQL);
  }
  return sqlite;
}

/** App-wide singleton repository backed by Expo SQLite. */
export function getTriageLocalRepository(): TriageLocalRepository {
  if (!repository) {
    repository = createTriageLocalRepository(
      createExpoSqliteTriageTable(getSqlite())
    );
  }
  return repository;
}
