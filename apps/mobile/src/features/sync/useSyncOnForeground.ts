import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";

/**
 * Calls `onForeground` when the app returns to the active (foreground) state.
 * The caller decides whether to sync based on current connectivity.
 */
export function useSyncOnForeground(onForeground: () => void) {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (next) => {
      const cameToForeground =
        appState.current.match(/inactive|background/) && next === "active";
      appState.current = next;
      if (cameToForeground) {
        onForeground();
      }
    });
    return () => subscription.remove();
  }, [onForeground]);
}
