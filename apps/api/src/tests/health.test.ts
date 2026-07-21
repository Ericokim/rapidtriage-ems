import request from "supertest";
import { createApp } from "../app";
import type { TriageRepository } from "../db";
import type { DbStatus } from "../migrations";

const noopRepo: TriageRepository = { async upsertRecords() { return []; } };

function buildApp(dbStatus?: () => DbStatus) {
  return createApp(noopRepo, { logging: false, dbStatus });
}

describe("GET /health (liveness)", () => {
  it("returns 200 even while the database is unreachable", async () => {
    const app = buildApp(() => ({ state: "error", attempts: 5, lastError: "ENOTFOUND" }));
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.db).toBe("error");
  });

  it("reports the database as ready once migrations land", async () => {
    const app = buildApp(() => ({ state: "ready", attempts: 1 }));
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.db).toBe("ready");
  });

  it("still works when no dbStatus is supplied", async () => {
    const res = await request(buildApp()).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

describe("GET /ready (readiness)", () => {
  it("returns 503 while the database is still connecting", async () => {
    const app = buildApp(() => ({ state: "connecting", attempts: 2 }));
    const res = await request(app).get("/ready");
    expect(res.status).toBe(503);
    expect(res.body.ok).toBe(false);
    expect(res.body.db).toBe("connecting");
  });

  it("returns 503 and surfaces the error when the database failed", async () => {
    const app = buildApp(() => ({ state: "error", attempts: 5, lastError: "ENOTFOUND dpg-xxx" }));
    const res = await request(app).get("/ready");
    expect(res.status).toBe(503);
    expect(res.body.error).toContain("ENOTFOUND");
  });

  it("returns 200 when the database is ready", async () => {
    const app = buildApp(() => ({ state: "ready", attempts: 1 }));
    const res = await request(app).get("/ready");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

describe("POST /api/v1/triage/sync while the database is down", () => {
  it("returns 503 rather than attempting a doomed write", async () => {
    const app = buildApp(() => ({ state: "error", attempts: 5, lastError: "ENOTFOUND" }));
    const res = await request(app)
      .post("/api/v1/triage/sync")
      .send({
        records: [
          {
            clientId: "local-1",
            patientName: "John Kamau",
            conditionDescription: "Chest pain and shortness of breath",
            priorityLevel: 1,
            status: "In-Transit",
            createdAt: "2026-07-09T20:00:00.000Z",
            updatedAt: "2026-07-09T20:00:00.000Z",
          },
        ],
      });
    expect(res.status).toBe(503);
    expect(res.body.ok).toBe(false);
  });
});
