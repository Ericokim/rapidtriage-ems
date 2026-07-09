import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";

export interface NetworkContextValue {
  isOnline: boolean;
}

export const NetworkContext = createContext<NetworkContextValue>({
  isOnline: true,
});

function isConnected(state: NetInfoState): boolean {
  // Treat unknown internet reachability as online to avoid false "offline".
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

  const value = useMemo(() => ({ isOnline }), [isOnline]);

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
}
