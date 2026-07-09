import {
  triageSyncResponseSchema,
  type TriageSyncRecord,
  type TriageSyncResponse,
} from "@rapidtriage/shared";
import { postJson } from "./apiClient";

const SYNC_PATH = "/api/v1/triage/sync";

export interface TriageApi {
  syncTriageRecords(records: TriageSyncRecord[]): Promise<TriageSyncResponse>;
}

/** Production API client: posts records to the Express sync endpoint. */
export const triageApi: TriageApi = {
  async syncTriageRecords(records) {
    const raw = await postJson<unknown>(SYNC_PATH, { records });
    return triageSyncResponseSchema.parse(raw);
  },
};
