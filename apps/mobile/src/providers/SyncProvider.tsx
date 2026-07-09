import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { SyncStatus, TriageFormValues } from "@rapidtriage/shared";
import { getTriageLocalRepository } from "../db/client";
import { getSyncEngine } from "../features/sync/syncEngineInstance";
import { useSyncOnForeground } from "../features/sync/useSyncOnForeground";
import { useSyncOnReconnect } from "../features/sync/useSyncOnReconnect";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

const PENDING_STATUSES: SyncStatus[] = ["pending", "failed"];

export interface SubmitResult {
  record: LocalTriageRecord;
  wasOnline: boolean;
}

export interface SyncContextValue {
  records: LocalTriageRecord[];
  pendingRecords: LocalTriageRecord[];
  pendingCount: number;
  isSyncing: boolean;
  lastSyncAt: string | null;
  lastError: string | null;
  refresh: () => Promise<void>;
  syncNow: () => Promise<void>;
  /** Core rule: save locally first, then sync only if online. */
  submitTriage: (input: TriageFormValues) => Promise<SubmitResult>;
}

export const SyncContext = createContext<SyncContextValue | null>(null);

export function SyncProvider({ children }: PropsWithChildren) {
  const { isOnline } = useNetworkStatus();
  const repository = useMemo(() => getTriageLocalRepository(), []);
  const engine = useMemo(() => getSyncEngine(), []);

  const [records, setRecords] = useState<LocalTriageRecord[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setRecords(await repository.getAllLocalTriageRecords());
  }, [repository]);

  const syncNow = useCallback(async () => {
    if (!isOnline || engine.isSyncing()) return;
    setIsSyncing(true);
    try {
      const result = await engine.run();
      setLastSyncAt(new Date().toISOString());
      setLastError(
        result.failed > 0
          ? "Some records will retry automatically."
          : null
      );
    } catch (error) {
      setLastError(error instanceof Error ? error.message : "Sync failed.");
    } finally {
      setIsSyncing(false);
      await refresh();
    }
  }, [engine, isOnline, refresh]);

  const submitTriage = useCallback(
    async (input: TriageFormValues): Promise<SubmitResult> => {
      // Always persist locally before any network activity.
      const record = await repository.createLocalTriageRecord(input);
      await refresh();
      if (isOnline) {
        void syncNow();
      }
      return { record, wasOnline: isOnline };
    },
    [repository, refresh, isOnline, syncNow]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useSyncOnReconnect(() => {
    void syncNow();
  });
  useSyncOnForeground(() => {
    if (isOnline) void syncNow();
  });

  const pendingRecords = useMemo(
    () => records.filter((record) => PENDING_STATUSES.includes(record.syncStatus)),
    [records]
  );

  const value = useMemo<SyncContextValue>(
    () => ({
      records,
      pendingRecords,
      pendingCount: pendingRecords.length,
      isSyncing,
      lastSyncAt,
      lastError,
      refresh,
      syncNow,
      submitTriage,
    }),
    [
      records,
      pendingRecords,
      isSyncing,
      lastSyncAt,
      lastError,
      refresh,
      syncNow,
      submitTriage,
    ]
  );

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}
