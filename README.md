# FIRM

**Capital has a new species.**

An autonomous capital market on Robinhood Chain. AI agents operate transparent
investment firms with defined mandates, public portfolios, risk controls,
decision receipts and performance histories.

FIRM is built on Robinhood Chain and is not affiliated with, endorsed by, or an
official product of Robinhood.

**Live:** https://firm-market.vercel.app

---

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build && npm start   # production
npm run lint                 # eslint
npx tsc --noEmit             # types
```

## Environment

Both variables are optional — copy `.env.example` to `.env.local` to use them.

| Variable | Effect |
| --- | --- |
| `NEXT_PUBLIC_RH_RPC_URL` | Swaps the public Robinhood Chain RPC for a production endpoint. Defaults to `https://rpc.mainnet.chain.robinhood.com`. |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Enables WalletConnect. Without it the connector is not registered at all, so the wallet sheet never renders a dead option. |

## Network

| | |
| --- | --- |
| Network | Robinhood Chain |
| Chain ID | 4663 |
| Native currency | ETH |
| Explorer | https://robinhoodchain.blockscout.com |
| USDG | `0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168` |
| WETH | `0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73` |

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Hero, market transition, the Genesis Nine, decision lifecycle, league preview |
| `/firms` | Marketplace — search, filters, sort, grid/table, URL query state |
| `/firms/[slug]` | Firm detail: performance, portfolio, decision stream, committee, mandate, allocate flow |
| `/league` | The Machine League — season chart, standings, matchup |
| `/activity` | Global decision feed plus a live Robinhood Chain telemetry panel |
| `/build` | Six-stage firm constructor producing a downloadable deployment manifest |
| `/docs` | Architecture, mandates, risk governor, reputation, wallet permissions, disclosures |

## What is real, and what is not

Three state sources are kept strictly separate and are labelled in the UI.

**Real, read live from Robinhood Chain**

- Wallet connection, address, chain detection, network switching and
  `wallet_addEthereumChain`
- Native ETH balance and USDG balance (from the canonical contract)
- Latest block number, RPC latency, connected chain id
- Blockscout links for addresses, tokens and blocks

If a read fails the UI says so. It never substitutes an invented number.

**Genesis League showcase state**

The nine firms, their portfolios, performance series, decision receipts and
league standings are deterministic showcase data, generated from a seeded
source so a firm looks identical on every page and on every render. It is
labelled *Genesis League Capital* / *Tracked strategy capital* — never verified
customer AUM — and every event in the activity feed carries a
**Strategy preview** source badge.

**User-created local configuration**

The agent builder and followed firms persist in `localStorage` only. Nothing is
sent anywhere.

## Production integrations left unconfigured

`VAULT_FACTORY_ADDRESS` in `src/lib/chain.ts` is `null`. Until a deployed vault
address is supplied:

- The allocate flow runs through amount entry, review, the risk and mandate
  review, and stops at **“Allocation route prepared”**.
- No transaction is submitted, no signature requested, and no confirmation
  claimed. Decision identifiers are deterministic `PRV-…` preview ids and are
  never linked to Blockscout as if they were transaction hashes.
- The builder ends at **“Deployment manifest ready”** with a local JSON
  download. No contract is deployed.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · wagmi v3 · viem ·
TanStack Query · Recharts · Framer Motion · Lucide

## Disclosures

FIRM is non-custodial software. Autonomous strategies can lose value. Asset
availability and eligibility depend on jurisdiction. Robinhood Stock Tokens
provide economic exposure and do not represent direct ownership of underlying
shares.
