import { triageApi } from "../../api/triageApi";
import { getTriageLocalRepository } from "../../db/client";
import { createSyncEngine, type SyncEngine } from "./syncEngine";

let engine: SyncEngine | null = null;

/** App-wide sync engine wired to the SQLite repository and the real API. */
export function getSyncEngine(): SyncEngine {
  if (!engine) {
    engine = createSyncEngine({
      repository: getTriageLocalRepository(),
      api: triageApi,
    });
  }
  return engine;
}
