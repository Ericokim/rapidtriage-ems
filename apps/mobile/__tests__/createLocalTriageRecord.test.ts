import { createTriageLocalRepository } from "@/src/db/triageLocalRepository";
import { createInMemoryTriageTable } from "./helpers/inMemoryTriageTable";

const validInput = {
  patientName: "John Kamau",
  conditionDescription: "Chest pain and shortness of breath",
  priorityLevel: 1 as const,
  status: "In-Transit" as const,
};

function buildRepo() {
  const table = createInMemoryTriageTable();
  let counter = 0;
  const repository = createTriageLocalRepository(table, {
    now: () => "2026-07-10T10:00:00.000Z",
    generateId: () => `local-${(counter += 1)}`,
  });
  return { table, repository };
}

describe("createLocalTriageRecord", () => {
  it("saves a valid record locally", async () => {
    const { table, repository } = buildRepo();
    const record = await repository.createLocalTriageRecord(validInput);
    expect(table.rows.get(record.id)).toBeTruthy();
  });

  it("marks a new record as pending with retry_count 0", async () => {
    const { repository } = buildRepo();
    const record = await repository.createLocalTriageRecord(validInput);
    expect(record.syncStatus).toBe("pending");
    expect(record.retryCount).toBe(0);
  });

  it("sets created_at and updated_at", async () => {
    const { repository } = buildRepo();
    const record = await repository.createLocalTriageRecord(validInput);
    expect(record.createdAt).toBe("2026-07-10T10:00:00.000Z");
    expect(record.updatedAt).toBe("2026-07-10T10:00:00.000Z");
    expect(record.syncedAt).toBeNull();
  });

  it("rejects an invalid record before saving", async () => {
    const { table, repository } = buildRepo();
    await expect(
      repository.createLocalTriageRecord({ ...validInput, patientName: "" })
    ).rejects.toBeTruthy();
    expect(table.rows.size).toBe(0);
  });

  it("returns pending records from the queue query", async () => {
    const { repository } = buildRepo();
    await repository.createLocalTriageRecord(validInput);
    const pending = await repository.getPendingSyncRecords();
    expect(pending).toHaveLength(1);
    expect(pending[0]?.syncStatus).toBe("pending");
  });
});
