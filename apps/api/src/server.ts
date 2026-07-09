import "dotenv/config";
import { createApp } from "./app";
import { loadEnv } from "./config/env";
import { createDbClient } from "./db/client";
import { createDrizzleTriageRepository } from "./db/triageRepository";

function start() {
  const env = loadEnv();
  const { db } = createDbClient();
  const triageRepository = createDrizzleTriageRepository(db);
  const app = createApp({ triageRepository });

  app.listen(env.PORT, () => {
    console.log(`RapidTriage API running on port ${env.PORT}`);
  });
}

start();
