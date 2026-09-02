"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePublicClient } from "wagmi";
import { RH_CHAIN_ID } from "@/lib/chain";
import type { NetworkState } from "@/lib/types";

/**
 * A single conservative poller for real Robinhood Chain telemetry.
 * Every surface that shows a block number reads from here, so the app
 * makes one RPC call per interval rather than one per component.
 */

const POLL_MS = 12_000;

const NetworkContext = createContext<NetworkState>({
  chainId: RH_CHAIN_ID,
  blockNumber: null,
  latencyMs: null,
  status: "idle",
});

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const client = usePublicClient({ chainId: RH_CHAIN_ID });
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [status, setStatus] = useState<NetworkState["status"]>("idle");
  const failures = useRef(0);

  useEffect(() => {
    if (!client) return;
    let cancelled = false;

    const read = async () => {
      const started = performance.now();
      try {
        const bn = await client.getBlockNumber({ cacheTime: 0 });
        if (cancelled) return;
        failures.current = 0;
        setBlockNumber(bn);
        setLatencyMs(Math.round(performance.now() - started));
        setStatus("online");
      } catch {
        if (cancelled) return;
        failures.current += 1;
        // One transient failure should not flip the indicator.
        if (failures.current >= 2) {
          setStatus("reconnecting");
          setLatencyMs(null);
        }
      }
    };

    void read();
    const id = window.setInterval(read, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void read();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [client]);

  const value = useMemo<NetworkState>(
    () => ({ chainId: RH_CHAIN_ID, blockNumber, latencyMs, status }),
    [blockNumber, latencyMs, status],
  );

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}
