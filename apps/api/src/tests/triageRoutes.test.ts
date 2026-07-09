import request from "supertest";
import { createApp } from "../app";
import { createInMemoryTriageRepository } from "../db/inMemoryTriageRepository";

function buildApp() {
  const repository = createInMemoryTriageRepository();
  const app = createApp({ triageRepository: repository, enableLogging: false });
  return { app, repository };
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

    const res = await request(app)
      .post("/api/v1/triage/sync")
      .send({ records: [validRecord] });

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

  it("returns 400 when the body is not shaped correctly", async () => {
    const { app } = buildApp();

    const res = await request(app).post("/api/v1/triage/sync").send({});

    expect(res.status).toBe(400);
  });

  it("is idempotent: a duplicate clientId does not create a duplicate row", async () => {
    const { app, repository } = buildApp();

    await request(app)
      .post("/api/v1/triage/sync")
      .send({ records: [validRecord] });
    await request(app)
      .post("/api/v1/triage/sync")
      .send({ records: [{ ...validRecord, patientName: "John K. Updated" }] });

    expect(repository.store.size).toBe(1);
    expect(repository.store.get("local-1")?.patientName).toBe("John K. Updated");
  });

  it("accepts an empty records array", async () => {
    const { app } = buildApp();

    const res = await request(app)
      .post("/api/v1/triage/sync")
      .send({ records: [] });

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
