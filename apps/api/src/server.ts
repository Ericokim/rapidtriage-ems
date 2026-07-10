import "dotenv/config";
import path from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createApp } from "./app";
import { createDb, createRepository } from "./db";
import { loadEnv } from "./env";

async function start() {
  const env = loadEnv();
  const { db } = createDb(env.DATABASE_URL);

  // Apply pending migrations on boot so a fresh production database is ready.
  await migrate(db, { migrationsFolder: path.join(__dirname, "../drizzle") });

  const app = createApp(createRepository(db));
  app.listen(env.PORT, () => {
    console.log(`RapidTriage API running on port ${env.PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start RapidTriage API:", error);
  process.exit(1);
});
