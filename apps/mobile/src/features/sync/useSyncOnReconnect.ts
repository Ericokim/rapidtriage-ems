import { useEffect, useRef } from "react";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";

/**
 * Calls `onReconnect` when connectivity transitions from offline to online.
 * Used to drain the pending queue automatically after a reconnect.
 */
export function useSyncOnReconnect(onReconnect: () => void) {
  const { isOnline } = useNetworkStatus();
  const wasOnline = useRef(isOnline);

  useEffect(() => {
    if (!wasOnline.current && isOnline) {
      onReconnect();
    }
    wasOnline.current = isOnline;
  }, [isOnline, onReconnect]);
}
