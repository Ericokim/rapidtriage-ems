import { useContext } from "react";
import { SyncContext } from "../providers/SyncProvider";

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSync must be used within a SyncProvider");
  }
  return context;
}
