import type { TriageSyncRequestPayload } from "@rapidtriage/shared";
import type { TriageRepository } from "../db/triageRepository";

export interface TriageService {
  syncRecords(payload: TriageSyncRequestPayload): Promise<{ syncedIds: string[] }>;
}

/**
 * Business logic for the sync endpoint. Validation happens at the controller
 * boundary with the shared Zod schema; the service delegates persistence to the
 * repository and returns the ids that were synced.
 */
export function createTriageService(repository: TriageRepository): TriageService {
  return {
    async syncRecords(payload) {
      const syncedIds = await repository.upsertRecords(payload.records);
      return { syncedIds };
    },
  };
}
