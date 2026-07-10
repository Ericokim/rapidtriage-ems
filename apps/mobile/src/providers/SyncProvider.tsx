import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { SyncStatus, TriageFormValues } from "@rapidtriage/shared";
import { getTriageLocalRepository, getTriageLocalTable } from "../db/client";
import { seedLocalTriageRecordsIfEmpty } from "../db/seed";
import { getSyncEngine } from "../features/sync/syncEngineInstance";
import { useSyncOnForeground } from "../features/sync/useSyncOnForeground";
import { useSyncOnReconnect } from "../features/sync/useSyncOnReconnect";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { getAutoSync, setAutoSyncPref } from "../lib/prefs";

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
  /** Push pending/failed records. Pass force=true to bypass the stale online check
   *  (used by pull-to-refresh right after a fresh connectivity check). */
  syncNow: (force?: boolean) => Promise<void>;
  /** Core rule: save locally first, then sync only if online. */
  submitTriage: (input: TriageFormValues) => Promise<SubmitResult>;
  /** Edit an existing record; re-queues it for sync and pushes if online. */
  updateTriage: (id: string, input: TriageFormValues) => Promise<SubmitResult>;
  autoSync: boolean;
  setAutoSync: (value: boolean) => void;
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
  const [autoSync, setAutoSyncState] = useState(true);

  useEffect(() => {
    void getAutoSync().then(setAutoSyncState);
  }, []);

  const setAutoSync = useCallback((next: boolean) => {
    setAutoSyncState(next);
    void setAutoSyncPref(next);
  }, []);

  const refresh = useCallback(async () => {
    setRecords(await repository.getAllLocalTriageRecords());
  }, [repository]);

  const syncNow = useCallback(async (force = false) => {
    if ((!force && !isOnline) || engine.isSyncing()) return;
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

  const updateTriage = useCallback(
    async (id: string, input: TriageFormValues): Promise<SubmitResult> => {
      // Same rule as create: persist the edit locally first, then sync if online.
      const record = await repository.updateLocalTriageRecord(id, input);
      await refresh();
      if (isOnline) {
        void syncNow();
      }
      return { record, wasOnline: isOnline };
    },
    [repository, refresh, isOnline, syncNow]
  );

  useEffect(() => {
    // Seed starter records on first launch, then load whatever is on-device.
    void (async () => {
      await seedLocalTriageRecordsIfEmpty(getTriageLocalTable());
      await refresh();
    })();
  }, [refresh]);

  useSyncOnReconnect(() => {
    if (autoSync) void syncNow();
  });
  useSyncOnForeground(() => {
    if (autoSync && isOnline) void syncNow();
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
      updateTriage,
      autoSync,
      setAutoSync,
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
      updateTriage,
      autoSync,
      setAutoSync,
    ]
  );

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}
