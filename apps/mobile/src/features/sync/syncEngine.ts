import type { TriageSyncRecord } from "@rapidtriage/shared";
import type { TriageLocalRepository } from "../../db/triageLocalRepository";
import type { TriageApi } from "../../api/triageApi";

export interface SyncEngineDeps {
  repository: TriageLocalRepository;
  api: TriageApi;
}

export interface SyncEngine {
  /** Push pending + failed records. Concurrent calls share one in-flight run. */
  run(): Promise<SyncRunResult>;
  isSyncing(): boolean;
}

function toSyncRecord(record: LocalTriageRecord): TriageSyncRecord {
  return {
    clientId: record.id,
    patientName: record.patientName,
    conditionDescription: record.conditionDescription,
    priorityLevel: record.priorityLevel,
    status: record.status,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

const EMPTY_RESULT: SyncRunResult = {
  attempted: 0,
  synced: 0,
  failed: 0,
  skipped: false,
};

export function createSyncEngine({ repository, api }: SyncEngineDeps): SyncEngine {
  let inFlight: Promise<SyncRunResult> | null = null;

  async function execute(): Promise<SyncRunResult> {
    const pending = await repository.getPendingSyncRecords();
    if (pending.length === 0) {
      return { ...EMPTY_RESULT };
    }

    // Mark everything as syncing before the network call.
    for (const record of pending) {
      await repository.markRecordSyncing(record.id);
    }

    const payload = pending.map(toSyncRecord);

    try {
      const response = await api.syncTriageRecords(payload);
      const syncedIds = new Set(response.syncedIds);

      let synced = 0;
      let failed = 0;
      for (const record of pending) {
        if (syncedIds.has(record.id)) {
          await repository.markRecordSynced(record.id);
          synced += 1;
        } else {
          // The server did not confirm this record; keep it for retry.
          await repository.markRecordFailed(
            record.id,
            "Record was not confirmed by the server."
          );
          failed += 1;
        }
      }

      return { attempted: pending.length, synced, failed, skipped: false };
    } catch (error) {
      // Network / server failure: preserve every record for a later retry.
      const message =
        error instanceof Error ? error.message : "Sync request failed.";
      for (const record of pending) {
        await repository.markRecordFailed(record.id, message);
      }
      return {
        attempted: pending.length,
        synced: 0,
        failed: pending.length,
        skipped: false,
      };
    }
  }

  return {
    run() {
      // Concurrency guard: a second call while a run is active joins the same
      // promise instead of starting a competing sync.
      if (inFlight) {
        return inFlight;
      }
      inFlight = execute().finally(() => {
        inFlight = null;
      });
      return inFlight;
    },
    isSyncing() {
      return inFlight !== null;
    },
  };
}
