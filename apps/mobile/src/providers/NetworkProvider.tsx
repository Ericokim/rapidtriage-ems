import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";

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
    const state = await NetInfo.fetch();
    const online = isConnected(state);
    setIsOnline(online);
    return online;
  }, []);

  const value = useMemo(() => ({ isOnline, recheck }), [isOnline, recheck]);

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
}
