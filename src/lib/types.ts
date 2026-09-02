/* ============================================================
   FIRM — domain model
   Three strictly separated state sources:
     1. Real wallet + network state  (wagmi / viem reads)
     2. Genesis League showcase state (deterministic, this file)
     3. User-created local configuration (localStorage)
   These are never mingled.
   ============================================================ */

export type RiskClass =
  | "Conservative"
  | "Balanced"
  | "Aggressive"
  | "Benchmark";

export type Strategy =
  | "AI Infrastructure"
  | "Defensive Macro"
  | "Fundamental Value"
  | "Event Driven"
  | "Dividend Growth"
  | "Risk Managed Index"
  | "Global Technology"
  | "Mean Reversion"
  | "Passive Technology Index";

export type FirmActivityState =
  | "Observing"
  | "Evaluating"
  | "Simulating"
  | "Rebalancing"
  | "Tracking"
  | "Reviewing";

export interface FirmState {
  /** Short line shown on cards and rows, e.g. "Evaluating NVDA". */
  label: string;
  kind: FirmActivityState;
}

export interface PortfolioAllocation {
  ticker: string;
  name: string;
  weight: number;
  /** Day movement in percent. */
  day: number;
  /** Agent conviction, 0–100. */
  conviction: number;
  lastAdjusted: string;
  /** Mandate ceiling for this position, in percent. */
  ceiling: number;
  kind: "equity" | "stable";
}

export interface PerformancePoint {
  t: number;
  v: number;
  b: number;
}

export interface SpecialistAgent {
  id: string;
  name: string;
  specialty: string;
  reputation: number;
  assignment: string;
  lastContribution: string;
}

export interface Mandate {
  universe: string;
  maxSinglePosition: number;
  maxSectorExposure: number;
  maxTurnover: number;
  minReserve: number;
  leverage: false;
  derivatives: false;
  rebalanceInterval: string;
  drawdownResponse: string;
  pauseAuthority: string;
}

export type DecisionKind =
  | "allocation"
  | "risk"
  | "research"
  | "execution"
  | "review"
  | "system";

export interface DecisionReceipt {
  id: string;
  firm: string;
  kind: DecisionKind;
  title: string;
  body: string;
  confidence?: number;
  riskImpact?: number;
  holdingPeriod?: string;
  mandateCheck: "Passed" | "Modified" | "Blocked";
  simulation: "Passed" | "Queued" | "Rejected";
  /** Minutes before the reference clock. Rendered as relative time. */
  minutesAgo: number;
}

export interface Firm {
  slug: string;
  name: string;
  strategy: Strategy;
  state: FirmState;
  /** Rotating showcase states, cycled on a slow timer. */
  stateCycle: FirmState[];
  risk: RiskClass;
  return30d: number;
  return7d: number;
  return24h: number;
  returnAll: number;
  maxDrawdown: number;
  /** Sharpe-like risk-adjusted score. */
  riskScore: number;
  consistency: number;
  decisionAccuracy: number;
  turnover: number;
  concentration: number;
  decisionsPerWeek: number;
  volatility: number;
  mandateViolations: number;
  /** Genesis League Capital, in USDG. Not customer AUM. */
  capital: number;
  rank: number;
  rankChange: number;
  version: string;
  founded: string;
  nextReview: string;
  tagline: string;
  allocations: PortfolioAllocation[];
  committee: SpecialistAgent[];
  mandate: Mandate;
  /** Deterministic hue seed for the agent sigil. */
  hue: number;
}

export type ActivityKind =
  | "decision"
  | "mandate"
  | "risk"
  | "research"
  | "execution"
  | "allocation"
  | "version"
  | "rank"
  | "letter";

export type ActivitySource = "strategy-preview" | "network-read" | "wallet";

export interface ActivityEvent {
  id: string;
  firm: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  values: { label: string; value: string }[];
  minutesAgo: number;
  source: ActivitySource;
}

export interface LeagueEntry {
  slug: string;
  rank: number;
  previousRank: number;
  score: number;
}

export interface NetworkState {
  chainId: number;
  blockNumber: bigint | null;
  latencyMs: number | null;
  status: "online" | "reconnecting" | "idle";
}

export interface WalletState {
  address?: `0x${string}`;
  chainId?: number;
  onRobinhoodChain: boolean;
  ethBalance?: string;
  usdgBalance?: string;
}

/* ---------------- Builder (user-created local configuration) ---------------- */

export interface DeploymentManifest {
  schema: "firm.deployment.manifest/v1";
  identity: {
    name: string;
    shortId: string;
    description: string;
    personality: string;
    sigilSeed: number;
  };
  mandate: {
    universe: string;
    assets: string[];
    maxSinglePosition: number;
    maxSectorExposure: number;
    rebalanceCadence: string;
    benchmark: string;
    minReserve: number;
  };
  intelligence: {
    primaryModel: string;
    researchAgent: string;
    riskAgent: string;
    executionAgent: string;
    decisionFrequency: string;
    explanationDepth: string;
  };
  risk: {
    profile: RiskClass;
    maxDrawdownResponse: string;
    maxPosition: number;
    maxSectorConcentration: number;
    turnoverCeiling: number;
    emergencyPause: boolean;
  };
  economics: {
    builderFee: number;
    performanceFee: number;
    highWaterMark: boolean;
    agentBond: number;
    capacity: number;
  };
  network: {
    chain: "Robinhood Chain";
    chainId: 4663;
    settlementAsset: "USDG";
  };
}
