import type { TriageApi } from "@/src/api/triageApi";
import { createTriageLocalRepository } from "@/src/db/triageLocalRepository";
import { createSyncEngine } from "@/src/features/sync/syncEngine";
import { createInMemoryTriageTable } from "./helpers/inMemoryTriageTable";

const validInput = {
  patientName: "John Kamau",
  conditionDescription: "Chest pain and shortness of breath",
  priorityLevel: 1 as const,
  status: "In-Transit" as const,
};

function buildHarness() {
  const table = createInMemoryTriageTable();
  let counter = 0;
  const repository = createTriageLocalRepository(table, {
    now: () => new Date(2026, 6, 10).toISOString(),
    generateId: () => `local-${(counter += 1)}`,
  });
  return { table, repository };
}

describe("syncEngine", () => {
  it("does nothing when there are no pending records", async () => {
    const { repository } = buildHarness();
    const api: TriageApi = {
      syncTriageRecords: jest.fn(),
    };
    const engine = createSyncEngine({ repository, api });

    const result = await engine.run();

    expect(result.attempted).toBe(0);
    expect(api.syncTriageRecords).not.toHaveBeenCalled();
  });

  it("marks records synced after a successful API call", async () => {
    const { table, repository } = buildHarness();
    const record = await repository.createLocalTriageRecord(validInput);
    const api: TriageApi = {
      syncTriageRecords: jest.fn().mockResolvedValue({
        ok: true,
        syncedIds: [record.id],
      }),
    };
    const engine = createSyncEngine({ repository, api });

    const result = await engine.run();

    expect(api.syncTriageRecords).toHaveBeenCalledTimes(1);
    expect(result.synced).toBe(1);
    expect(table.rows.get(record.id)?.syncStatus).toBe("synced");
    expect(table.rows.get(record.id)?.syncedAt).not.toBeNull();
  });

  it("marks records failed and preserves them after an API error", async () => {
    const { table, repository } = buildHarness();
    const record = await repository.createLocalTriageRecord(validInput);
    const api: TriageApi = {
      syncTriageRecords: jest.fn().mockRejectedValue(new Error("network down")),
    };
    const engine = createSyncEngine({ repository, api });

    const result = await engine.run();

    expect(result.failed).toBe(1);
    const stored = table.rows.get(record.id);
    expect(stored).toBeTruthy();
    expect(stored?.syncStatus).toBe("failed");
    expect(stored?.retryCount).toBe(1);
    expect(stored?.lastSyncError).toBe("network down");
  });

  it("retries failed records on a later run", async () => {
    const { table, repository } = buildHarness();
    const record = await repository.createLocalTriageRecord(validInput);
    const api: TriageApi = {
      syncTriageRecords: jest
        .fn()
        .mockRejectedValueOnce(new Error("network down"))
        .mockResolvedValueOnce({ ok: true, syncedIds: [record.id] }),
    };
    const engine = createSyncEngine({ repository, api });

    await engine.run();
    expect(table.rows.get(record.id)?.syncStatus).toBe("failed");

    await engine.run();
    expect(table.rows.get(record.id)?.syncStatus).toBe("synced");
  });

  it("does not run concurrently", async () => {
    const { repository } = buildHarness();
    await repository.createLocalTriageRecord(validInput);

    let resolveApi: (value: { ok: boolean; syncedIds: string[] }) => void = () => {};
    const apiPromise = new Promise<{ ok: boolean; syncedIds: string[] }>(
      (resolve) => {
        resolveApi = resolve;
      }
    );
    const api: TriageApi = {
      syncTriageRecords: jest.fn(() => apiPromise),
    };
    const engine = createSyncEngine({ repository, api });

    const first = engine.run();
    const second = engine.run();
    expect(engine.isSyncing()).toBe(true);

    resolveApi({ ok: true, syncedIds: [] });
    await Promise.all([first, second]);

    // Both callers joined a single in-flight run.
    expect(api.syncTriageRecords).toHaveBeenCalledTimes(1);
  });
});
