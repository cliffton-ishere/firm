"use client";

import * as React from "react";
import { useAccount } from "wagmi";
import { useChangeEffect } from "@/lib/hooks";
import { AccountSheet } from "./AccountSheet";
import { WalletModal } from "./WalletModal";

interface WalletUI {
  openConnect: () => void;
  openAccount: () => void;
  /** Opens the connect sheet when disconnected. Returns true if already connected. */
  ensureConnected: () => boolean;
}

const Ctx = React.createContext<WalletUI>({
  openConnect: () => {},
  openAccount: () => {},
  ensureConnected: () => false,
});

export function WalletUIProvider({ children }: { children: React.ReactNode }) {
  const [connectOpen, setConnectOpen] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const { isConnected } = useAccount();

  // A landed connection closes the connect sheet; a disconnect closes the
  // account sheet. Resolved during render so neither lingers for a frame.
  useChangeEffect(isConnected, (connected) => {
    if (connected) setConnectOpen(false);
    else setAccountOpen(false);
  });

  const value = React.useMemo<WalletUI>(
    () => ({
      openConnect: () => setConnectOpen(true),
      openAccount: () => setAccountOpen(true),
      ensureConnected: () => {
        if (isConnected) return true;
        setConnectOpen(true);
        return false;
      },
    }),
    [isConnected],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <WalletModal open={connectOpen} onClose={() => setConnectOpen(false)} />
      <AccountSheet open={accountOpen} onClose={() => setAccountOpen(false)} />
    </Ctx.Provider>
  );
}

export function useWalletUI() {
  return React.useContext(Ctx);
}
