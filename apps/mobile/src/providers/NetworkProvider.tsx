import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";
import { API_BASE_URL } from "../api/apiClient";

export interface NetworkContextValue {
  isOnline: boolean;
  /** Force a fresh connectivity check (used by pull-to-refresh). */
  recheck: () => Promise<boolean>;
}

export const NetworkContext = createContext<NetworkContextValue>({
  isOnline: true,
  recheck: async () => true,
});

function isConnected(state: NetInfoState): boolean {
  return Boolean(state.isConnected) && state.isInternetReachable !== false;
}

/** Tracks connectivity via NetInfo and exposes a simple online/offline flag. */
export function NetworkProvider({ children }: PropsWithChildren) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(isConnected(state));
    });
    NetInfo.fetch().then((state) => setIsOnline(isConnected(state)));
    return () => unsubscribe();
  }, []);

  const recheck = useCallback(async () => {
    // NetInfo can report stale connectivity on simulators and right after a
    // reconnect, so do a definitive check by actually reaching the API. If that
    // succeeds we are online no matter what NetInfo thinks.
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        setIsOnline(true);
        return true;
      }
    } catch {
      // fall through to NetInfo
    }
    const state = await NetInfo.fetch();
    const online = isConnected(state);
    setIsOnline(online);
    return online;
  }, []);

  // Definitive check once on mount so the status is right from the first render.
  useEffect(() => {
    void recheck();
  }, [recheck]);

  const value = useMemo(() => ({ isOnline, recheck }), [isOnline, recheck]);

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
}
