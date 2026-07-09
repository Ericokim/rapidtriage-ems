import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { loadEnv } from "../config/env";
import * as schema from "./schema";

/**
 * Build the PostgreSQL pool + Drizzle client from validated env.
 * Kept in a factory so it is only constructed by the server entrypoint,
 * never when running unit tests with an in-memory repository.
 */
export function createDbClient() {
  const env = loadEnv();
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const db = drizzle(pool, { schema });
  return { pool, db };
}

export type Database = ReturnType<typeof createDbClient>["db"];
