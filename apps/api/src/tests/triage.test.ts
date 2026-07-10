import request from "supertest";
import type { TriageSyncRecordPayload } from "@rapidtriage/shared";
import { createApp } from "../app";
import type { TriageRepository } from "../db";

/** In-memory repository so routes are testable without a database. */
function inMemoryRepo(): TriageRepository & { store: Map<string, TriageSyncRecordPayload> } {
  const store = new Map<string, TriageSyncRecordPayload>();
  return {
    store,
    async upsertRecords(records) {
      for (const r of records) store.set(r.clientId, r);
      return records.map((r) => r.clientId);
    },
  };
}

function buildApp() {
  const repo = inMemoryRepo();
  return { app: createApp(repo, { logging: false }), repo };
}

const validRecord = {
  clientId: "local-1",
  patientName: "John Kamau",
  conditionDescription: "Chest pain and shortness of breath",
  priorityLevel: 1,
  status: "In-Transit" as const,
  createdAt: "2026-07-09T20:00:00.000Z",
  updatedAt: "2026-07-09T20:00:00.000Z",
};

describe("POST /api/v1/triage/sync", () => {
  it("accepts a valid payload and returns syncedIds", async () => {
    const { app } = buildApp();
    const res = await request(app).post("/api/v1/triage/sync").send({ records: [validRecord] });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, syncedIds: ["local-1"] });
  });

  it("returns 400 for an invalid payload", async () => {
    const { app } = buildApp();
    const res = await request(app)
      .post("/api/v1/triage/sync")
      .send({ records: [{ ...validRecord, patientName: "" }] });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it("returns 400 when the body is malformed", async () => {
    const { app } = buildApp();
    const res = await request(app).post("/api/v1/triage/sync").send({});
    expect(res.status).toBe(400);
  });

  it("is idempotent: a duplicate clientId does not create a duplicate", async () => {
    const { app, repo } = buildApp();
    await request(app).post("/api/v1/triage/sync").send({ records: [validRecord] });
    await request(app)
      .post("/api/v1/triage/sync")
      .send({ records: [{ ...validRecord, patientName: "John K. Updated" }] });
    expect(repo.store.size).toBe(1);
    expect(repo.store.get("local-1")?.patientName).toBe("John K. Updated");
  });

  it("accepts an empty records array", async () => {
    const { app } = buildApp();
    const res = await request(app).post("/api/v1/triage/sync").send({ records: [] });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, syncedIds: [] });
  });
});

describe("GET /health", () => {
  it("reports the service is up", async () => {
    const { app } = buildApp();
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
