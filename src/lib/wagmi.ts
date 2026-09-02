import { createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import type { CreateConnectorFn } from "wagmi";
import { robinhoodChain, RH_RPC_URL, WALLETCONNECT_PROJECT_ID } from "./chain";

/**
 * Wallet configuration.
 *
 * Only connectors that can actually complete a connection are registered.
 * WalletConnect is omitted entirely unless a project id is configured, so the
 * wallet sheet never renders a dead option. EIP-6963 discovery is left on, so
 * installed wallets announce themselves and appear by name.
 */
function buildConnectors(): CreateConnectorFn[] {
  const list: CreateConnectorFn[] = [
    injected({ target: "metaMask", shimDisconnect: true }),
    injected({ shimDisconnect: true }),
  ];

  if (WALLETCONNECT_PROJECT_ID) {
    list.push(
      walletConnect({
        projectId: WALLETCONNECT_PROJECT_ID,
        showQrModal: true,
        metadata: {
          name: "FIRM",
          description: "Autonomous capital market on Robinhood Chain.",
          url:
            typeof window !== "undefined"
              ? window.location.origin
              : "https://firm.market",
          icons: [],
        },
      }),
    );
  }

  return list;
}

let cached: ReturnType<typeof createConfig> | undefined;

export function getWagmiConfig() {
  if (!cached) {
    cached = createConfig({
      chains: [robinhoodChain],
      connectors: buildConnectors(),
      multiInjectedProviderDiscovery: true,
      transports: {
        [robinhoodChain.id]: http(RH_RPC_URL, {
          batch: true,
          retryCount: 2,
          retryDelay: 600,
          timeout: 12_000,
        }),
      },
      ssr: true,
    });
  }
  return cached;
}

export const WALLETCONNECT_ENABLED = Boolean(WALLETCONNECT_PROJECT_ID);
