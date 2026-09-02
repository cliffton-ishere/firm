"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { WagmiProvider } from "wagmi";
import { getWagmiConfig } from "@/lib/wagmi";
import { WalletUIProvider } from "@/components/wallet/WalletUIProvider";
import { NetworkProvider } from "./NetworkProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const config = React.useMemo(() => getWagmiConfig(), []);

  return (
    <WagmiProvider config={config} reconnectOnMount>
      <QueryClientProvider client={queryClient}>
        <NetworkProvider>
          <WalletUIProvider>{children}</WalletUIProvider>
        </NetworkProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
