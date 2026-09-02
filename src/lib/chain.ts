import { defineChain } from "viem";

/**
 * Robinhood Chain — mainnet.
 * FIRM is built on Robinhood Chain. FIRM is not affiliated with,
 * endorsed by, or an official product of Robinhood.
 */

export const RH_RPC_URL =
  process.env.NEXT_PUBLIC_RH_RPC_URL ?? "https://rpc.mainnet.chain.robinhood.com";

export const RH_EXPLORER_URL = "https://robinhoodchain.blockscout.com";

export const RH_CHAIN_ID = 4663 as const;

export const robinhoodChain = defineChain({
  id: RH_CHAIN_ID,
  name: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [RH_RPC_URL] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: RH_EXPLORER_URL,
      apiUrl: `${RH_EXPLORER_URL}/api`,
    },
  },
  testnet: false,
});

/** Canonical token contracts on Robinhood Chain. */
export const CONTRACTS = {
  USDG: "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168",
  WETH: "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73",
} as const;

/**
 * Production vault deployment is intentionally unconfigured.
 * When a vault factory address is supplied, the allocate flow can submit.
 */
export const VAULT_FACTORY_ADDRESS: `0x${string}` | null = null;

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() || undefined;

/** Parameters for wallet_addEthereumChain when the wallet lacks the network. */
export const RH_ADD_CHAIN_PARAMS = {
  chainId: `0x${RH_CHAIN_ID.toString(16)}`,
  chainName: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: [RH_RPC_URL],
  blockExplorerUrls: [RH_EXPLORER_URL],
} as const;

export function explorerAddress(address: string) {
  return `${RH_EXPLORER_URL}/address/${address}`;
}

export function explorerToken(address: string) {
  return `${RH_EXPLORER_URL}/token/${address}`;
}

export function explorerBlock(block: bigint | number) {
  return `${RH_EXPLORER_URL}/block/${block.toString()}`;
}
