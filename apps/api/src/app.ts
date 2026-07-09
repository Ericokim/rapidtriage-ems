import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { createTriageController } from "./controllers/triageController";
import { createTriageRouter } from "./routes/triageRoutes";
import { createTriageService } from "./services/triageService";
import type { TriageRepository } from "./db/triageRepository";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";

export interface AppDependencies {
  triageRepository: TriageRepository;
  /** Disable request logging (used by tests to keep output clean). */
  enableLogging?: boolean;
}

/**
 * Build the Express app around an injected repository. The server entrypoint
 * passes the Drizzle repository; tests pass an in-memory one.
 */
export function createApp({
  triageRepository,
  enableLogging = true,
}: AppDependencies): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  if (enableLogging) {
    app.use(morgan("dev"));
  }

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true, service: "rapidtriage-api" });
  });

  const triageService = createTriageService(triageRepository);
  const triageController = createTriageController(triageService);
  app.use("/api/v1/triage", createTriageRouter(triageController));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
