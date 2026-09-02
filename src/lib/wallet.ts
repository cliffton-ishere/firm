"use client";

import { useCallback, useMemo, useState } from "react";
import { formatUnits } from "viem";
import {
  useAccount,
  useBalance,
  useConnectorClient,
  useReadContracts,
  useSwitchChain,
} from "wagmi";
import { RH_ADD_CHAIN_PARAMS, RH_CHAIN_ID, CONTRACTS } from "./chain";
import { trimDecimal } from "./format";

const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;

/**
 * Real USDG balance read from the canonical contract on Robinhood Chain.
 * If the read fails the UI says so — it never substitutes a number.
 */
export function useUsdgBalance() {
  const { address, isConnected } = useAccount();

  const query = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: CONTRACTS.USDG as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
        chainId: RH_CHAIN_ID,
      },
      {
        address: CONTRACTS.USDG as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "decimals",
        chainId: RH_CHAIN_ID,
      },
    ],
    query: {
      enabled: Boolean(address) && isConnected,
      retry: 1,
      staleTime: 20_000,
      refetchInterval: 45_000,
    },
  });

  const value = query.data;
  const raw = value?.[0];
  const decimals = value?.[1];

  return {
    raw: raw as bigint | undefined,
    decimals: decimals as number | undefined,
    formatted:
      raw !== undefined && decimals !== undefined
        ? trimDecimal(formatUnits(raw as bigint, Number(decimals)), 2)
        : undefined,
    numeric:
      raw !== undefined && decimals !== undefined
        ? Number(formatUnits(raw as bigint, Number(decimals)))
        : undefined,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

/** Native ETH balance on Robinhood Chain. */
export function useEthBalance() {
  const { address, isConnected } = useAccount();
  const q = useBalance({
    address,
    chainId: RH_CHAIN_ID,
    query: {
      enabled: Boolean(address) && isConnected,
      retry: 1,
      staleTime: 20_000,
      refetchInterval: 45_000,
    },
  });
  return {
    formatted: q.data
      ? trimDecimal(formatUnits(q.data.value, q.data.decimals), 5)
      : undefined,
    symbol: q.data?.symbol ?? "ETH",
    isLoading: q.isLoading,
    isError: q.isError,
  };
}

export type SwitchStatus = "idle" | "switching" | "rejected" | "failed";

/**
 * Switch the connected wallet to Robinhood Chain, adding the network with the
 * official mainnet parameters if the wallet does not know it yet.
 */
export function useSwitchToRobinhood() {
  const { switchChainAsync } = useSwitchChain();
  const { data: client } = useConnectorClient();
  const [status, setStatus] = useState<SwitchStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const switchToRobinhood = useCallback(async () => {
    setStatus("switching");
    setMessage(null);
    try {
      await switchChainAsync({ chainId: RH_CHAIN_ID });
      setStatus("idle");
      return true;
    } catch (err) {
      const e = err as { code?: number; name?: string; message?: string };
      const code = e?.code;

      // 4902 — the wallet has never heard of this chain. Add it, then retry.
      if (code === 4902 || /unrecognized chain|Unrecognized chain/i.test(e?.message ?? "")) {
        try {
          const transport = client?.transport as
            | { request?: (a: { method: string; params: unknown[] }) => Promise<unknown> }
            | undefined;
          if (!transport?.request) throw new Error("no-provider");
          await transport.request({
            method: "wallet_addEthereumChain",
            params: [RH_ADD_CHAIN_PARAMS],
          });
          await switchChainAsync({ chainId: RH_CHAIN_ID });
          setStatus("idle");
          return true;
        } catch (addErr) {
          const a = addErr as { code?: number };
          if (a?.code === 4001) {
            setStatus("rejected");
            setMessage("The request to add Robinhood Chain was declined.");
          } else {
            setStatus("failed");
            setMessage(
              "Robinhood Chain could not be added automatically. Add it manually with chain ID 4663.",
            );
          }
          return false;
        }
      }

      if (code === 4001 || /rejected/i.test(e?.message ?? "")) {
        setStatus("rejected");
        setMessage("The network switch was declined in your wallet.");
        return false;
      }

      setStatus("failed");
      setMessage("The network switch did not complete. Try again from your wallet.");
      return false;
    }
  }, [switchChainAsync, client]);

  const reset = useCallback(() => {
    setStatus("idle");
    setMessage(null);
  }, []);

  return { switchToRobinhood, status, message, reset };
}

/** Consolidated, real wallet state. Never mixed with showcase data. */
export function useWallet() {
  const { address, isConnected, isConnecting, isReconnecting, chainId, connector } =
    useAccount();
  const eth = useEthBalance();
  const usdg = useUsdgBalance();

  return useMemo(
    () => ({
      address,
      isConnected,
      isConnecting: isConnecting || isReconnecting,
      chainId,
      connectorName: connector?.name,
      onRobinhoodChain: isConnected && chainId === RH_CHAIN_ID,
      wrongNetwork: isConnected && chainId !== undefined && chainId !== RH_CHAIN_ID,
      eth,
      usdg,
    }),
    [address, isConnected, isConnecting, isReconnecting, chainId, connector, eth, usdg],
  );
}
