import "dotenv/config";
import path from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createApp } from "./app";
import { createDb, createRepository } from "./db";
import { loadEnv } from "./env";
import { runMigrationsWithRetry, type DbStatus } from "./migrations";

async function start() {
  const env = loadEnv();
  const { db } = createDb(env.DATABASE_URL);

  let dbStatus: DbStatus = { state: "connecting", attempts: 0 };

  // Bind the port before touching the database. The health check then answers
  // immediately, so a database problem shows up as a degraded service rather
  // than an instance that exits 1 and restarts forever.
  const app = createApp(createRepository(db), { dbStatus: () => dbStatus });
  app.listen(env.PORT, () => {
    console.log(`RapidTriage API listening on port ${env.PORT}`);
  });

  // Apply pending migrations so a fresh production database is prepared,
  // retrying transient outages instead of killing the process.
  const finalStatus = await runMigrationsWithRetry(
    () => migrate(db, { migrationsFolder: path.join(__dirname, "../drizzle") }),
    {
      retries: 5,
      baseDelayMs: 1000,
      onState: (status) => {
        dbStatus = status;
        if (status.state === "connecting" && status.lastError) {
          console.warn(
            `Database not ready (attempt ${status.attempts}): ${status.lastError}. Retrying...`
          );
        }
      },
    }
  );

  if (finalStatus.state === "ready") {
    console.log("Database migrations applied; API is ready.");
  } else {
    // Stay alive and keep serving /health so the platform does not restart-loop.
    // /ready and the sync route report 503 until the database recovers.
    console.error(
      `Database unavailable after ${finalStatus.attempts} attempts: ${finalStatus.lastError}`
    );
    console.error("Serving in degraded mode — /ready reports 503 until the database recovers.");
  }
}

start().catch((error) => {
  // Only genuinely unrecoverable startup faults (bad env, port in use) reach here.
  console.error("Failed to start RapidTriage API:", error);
  process.exit(1);
});
