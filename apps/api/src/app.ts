import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { triageSyncRequestSchema } from "@rapidtriage/shared";
import type { TriageRepository } from "./db";

/**
 * Build the Express app around a triage repository. The server passes the
 * Postgres-backed repository; tests pass an in-memory one.
 */
export function createApp(
  repository: TriageRepository,
  options: { logging?: boolean } = {}
): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  if (options.logging !== false) app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "rapidtriage-api" });
  });

  // The only resource: idempotent triage sync, validated with the shared schema.
  app.post("/api/v1/triage/sync", async (req, res) => {
    const parsed = triageSyncRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        ok: false,
        error: "Invalid triage sync payload",
        issues: parsed.error.issues,
      });
      return;
    }
    try {
      const syncedIds = await repository.upsertRecords(parsed.data.records);
      res.json({ ok: true, syncedIds });
    } catch (error) {
      console.error("Triage sync failed:", error);
      res.status(500).json({ ok: false, error: "Internal server error" });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ ok: false, error: `Not found: ${req.method} ${req.path}` });
  });

  return app;
}
