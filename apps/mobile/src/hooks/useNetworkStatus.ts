import { useContext } from "react";
import { NetworkContext } from "../providers/NetworkProvider";

export function useNetworkStatus() {
  return useContext(NetworkContext);
}
