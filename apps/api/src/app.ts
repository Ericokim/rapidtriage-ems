import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { triageSyncRequestSchema } from "@rapidtriage/shared";
import type { TriageRepository } from "./db";
import type { DbStatus } from "./migrations";

/**
 * Build the Express app around a triage repository. The server passes the
 * Postgres-backed repository; tests pass an in-memory one.
 *
 * `dbStatus` lets the server report live database state without the app
 * holding a connection itself. When it is omitted the database is assumed
 * ready, which keeps the in-memory test setup unchanged.
 */
export function createApp(
  repository: TriageRepository,
  options: { logging?: boolean; dbStatus?: () => DbStatus } = {}
): Express {
  const app = express();
  const readDbStatus = options.dbStatus ?? (() => ({ state: "ready" as const, attempts: 1 }));

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  if (options.logging !== false) app.use(morgan("dev"));

  // Liveness: the process is running. Always 200 so a database outage does not
  // make Render tear the instance down and restart it in a loop.
  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: "rapidtriage-api", db: readDbStatus().state });
  });

  // Readiness: the service can actually serve traffic, i.e. the database is up.
  app.get("/ready", (_req, res) => {
    const db = readDbStatus();
    if (db.state === "ready") {
      res.json({ ok: true, service: "rapidtriage-api", db: db.state });
      return;
    }
    res.status(503).json({
      ok: false,
      service: "rapidtriage-api",
      db: db.state,
      error: db.lastError ?? `Database is ${db.state}`,
    });
  });

  // The only resource: idempotent triage sync, validated with the shared schema.
  app.post("/api/v1/triage/sync", async (req, res) => {
    const db = readDbStatus();
    if (db.state !== "ready") {
      // Fail fast and honestly; the mobile client keeps the record queued
      // locally and retries, rather than treating a lost write as synced.
      res.status(503).json({
        ok: false,
        error: "Database unavailable, retry later",
        db: db.state,
      });
      return;
    }

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
