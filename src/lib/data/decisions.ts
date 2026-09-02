import type { ActivityEvent, DecisionReceipt } from "@/lib/types";
import { FIRMS } from "./firms";

/* ============================================================
   Decision receipts and the global activity stream.

   Decision identifiers below are deterministic *preview* identifiers.
   They are not transaction hashes and are never linked to Blockscout.
   ============================================================ */

function previewId(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let g = Math.imul(h ^ 0x9e3779b9, 2654435761) >>> 0;
  const a = (h >>> 0).toString(16).padStart(8, "0");
  g = Math.imul(g ^ (g >>> 13), 1274126177) >>> 0;
  const b = g.toString(16).padStart(8, "0");
  return `PRV-${a}${b}`.slice(0, 16);
}

const receipt = (
  firm: string,
  index: number,
  d: Omit<DecisionReceipt, "id" | "firm">,
): DecisionReceipt => ({
  ...d,
  firm,
  id: previewId(`${firm}#${index}#${d.title}`),
});

export const AURELIA_DECISIONS: DecisionReceipt[] = [
  receipt("aurelia", 0, {
    kind: "allocation",
    title: "Allocation proposal committed",
    body: "Aurelia proposed increasing semiconductor infrastructure exposure by 2.4%. The risk governor reduced the requested change to 1.6% to preserve the sector concentration ceiling.",
    confidence: 82,
    riskImpact: 0.3,
    holdingPeriod: "18–45 days",
    mandateCheck: "Modified",
    simulation: "Passed",
    minutesAgo: 14,
  }),
  receipt("aurelia", 1, {
    kind: "risk",
    title: "Risk governor modified proposal",
    body: "PRISM applied the 65% sector ceiling and trimmed the requested increase. Post-trade semiconductor exposure settles at 63.8%, inside the mandate with 1.2 points of headroom.",
    confidence: 96,
    riskImpact: -0.4,
    mandateCheck: "Passed",
    simulation: "Passed",
    minutesAgo: 15,
  }),
  receipt("aurelia", 2, {
    kind: "research",
    title: "Research agent delivered earnings revision",
    body: "ORACLE-7 delivered a datacenter build-out revision running 4.1% ahead of consensus, sourced from supplier capacity disclosures and three quarters of capex guidance.",
    confidence: 77,
    mandateCheck: "Passed",
    simulation: "Queued",
    minutesAgo: 62,
  }),
  receipt("aurelia", 3, {
    kind: "execution",
    title: "Execution route prepared",
    body: "VECTOR prepared a three-leg route for the approved 1.6% increase, estimating 11bps of slippage across two settlement windows.",
    confidence: 88,
    riskImpact: 0.1,
    mandateCheck: "Passed",
    simulation: "Passed",
    minutesAgo: 96,
  }),
  receipt("aurelia", 4, {
    kind: "allocation",
    title: "Position weight reduced",
    body: "Alphabet was reduced from 17.4% to 16.0% after the research agent lowered its conviction score on decelerating cloud margin expansion.",
    confidence: 69,
    riskImpact: -0.2,
    holdingPeriod: "Ongoing",
    mandateCheck: "Passed",
    simulation: "Passed",
    minutesAgo: 288,
  }),
  receipt("aurelia", 5, {
    kind: "review",
    title: "Weekly mandate review completed",
    body: "LEDGER attested every decision from the prior seven days against the active mandate. No breaches recorded. Reserve held at 10.0%, one point above the floor.",
    confidence: 99,
    mandateCheck: "Passed",
    simulation: "Passed",
    minutesAgo: 1_442,
  }),
  receipt("aurelia", 6, {
    kind: "research",
    title: "Research purchased from ORACLE-7",
    body: "Aurelia purchased a supply-chain capacity study from ORACLE-7 for 240 USDG. The study is attached to the decision record and counted against the research budget.",
    confidence: 74,
    mandateCheck: "Passed",
    simulation: "Passed",
    minutesAgo: 2_160,
  }),
  receipt("aurelia", 7, {
    kind: "system",
    title: "Firm version published",
    body: "Aurelia published AUR-3.8. The revision widens the research window from 21 to 30 days and tightens the single-name ceiling from 27% to 25%.",
    confidence: 100,
    mandateCheck: "Passed",
    simulation: "Passed",
    minutesAgo: 4_320,
  }),
];

const STREAM_TEMPLATES: Record<
  string,
  Omit<DecisionReceipt, "id" | "firm">[]
> = {
  blackswan: [
    {
      kind: "allocation",
      title: "Reserve increase committed",
      body: "BLACKSWAN raised the USDG reserve from 32.0% to 34.0% after DELPHI-2 flagged a widening credit spread regime.",
      confidence: 84,
      riskImpact: -0.6,
      holdingPeriod: "Until regime clears",
      mandateCheck: "Passed",
      simulation: "Passed",
      minutesAgo: 41,
    },
    {
      kind: "risk",
      title: "Reserve floor raised",
      body: "BASTION raised the enforced reserve floor from 28% to 32% for the duration of the elevated-spread regime.",
      confidence: 93,
      riskImpact: -0.5,
      mandateCheck: "Passed",
      simulation: "Passed",
      minutesAgo: 44,
    },
    {
      kind: "research",
      title: "Macro regime detection updated",
      body: "DELPHI-2 moved the regime classifier from neutral to defensive on a three-factor confirmation.",
      confidence: 71,
      mandateCheck: "Passed",
      simulation: "Queued",
      minutesAgo: 190,
    },
  ],
  "deepvalue-01": [
    {
      kind: "research",
      title: "Filing decomposition completed",
      body: "QUILL parsed 41 filings and re-scored normalized earnings power across the industrials universe.",
      confidence: 76,
      mandateCheck: "Passed",
      simulation: "Queued",
      minutesAgo: 33,
    },
    {
      kind: "allocation",
      title: "Allocation proposal committed",
      body: "General Motors was increased from 12.6% to 14.0% on a free cash flow yield in the top decile of the universe.",
      confidence: 73,
      riskImpact: 0.2,
      holdingPeriod: "60–180 days",
      mandateCheck: "Passed",
      simulation: "Passed",
      minutesAgo: 210,
    },
    {
      kind: "risk",
      title: "Cyclical exposure governor applied",
      body: "PRISM capped combined industrial exposure at 48%, deferring a proposed rail increase to the next review.",
      confidence: 91,
      riskImpact: -0.3,
      mandateCheck: "Modified",
      simulation: "Passed",
      minutesAgo: 214,
    },
  ],
  "earnings-exe": [
    {
      kind: "execution",
      title: "Earnings basket staged",
      body: "VECTOR staged a five-name earnings basket across three windows ahead of the print cluster.",
      confidence: 79,
      riskImpact: 0.7,
      holdingPeriod: "2–9 days",
      mandateCheck: "Passed",
      simulation: "Passed",
      minutesAgo: 8,
    },
    {
      kind: "risk",
      title: "Risk governor blocked rotation",
      body: "PRISM blocked a ninth intraday rotation. The turnover ceiling was already consumed for the session.",
      confidence: 98,
      riskImpact: -0.9,
      mandateCheck: "Blocked",
      simulation: "Rejected",
      minutesAgo: 52,
    },
    {
      kind: "research",
      title: "Event calendar synthesised",
      body: "HERALD ranked 63 upcoming prints by historical surprise dispersion and implied move.",
      confidence: 68,
      mandateCheck: "Passed",
      simulation: "Queued",
      minutesAgo: 128,
    },
  ],
  compound: [
    {
      kind: "allocation",
      title: "Distributions reinvested",
      body: "COMPOUND reinvested the quarter's distributions proportionally across the five highest coverage scores.",
      confidence: 88,
      riskImpact: 0.1,
      holdingPeriod: "Ongoing",
      mandateCheck: "Passed",
      simulation: "Passed",
      minutesAgo: 76,
    },
    {
      kind: "research",
      title: "Payout durability re-scored",
      body: "ANNUITY downgraded two payers on coverage decay and removed one from the approved universe.",
      confidence: 81,
      mandateCheck: "Passed",
      simulation: "Passed",
      minutesAgo: 620,
    },
    {
      kind: "review",
      title: "Monthly mandate review completed",
      body: "LEDGER attested 74 consecutive decisions. Reserve held at 16.0%, one point above the floor.",
      confidence: 99,
      mandateCheck: "Passed",
      simulation: "Passed",
      minutesAgo: 2_880,
    },
  ],
  sentinel: [
    {
      kind: "risk",
      title: "Volatility threshold clear",
      body: "WATCHTOWER confirmed realized volatility at 8.2%, inside the 14% band. The exposure ladder holds at step 3 of 5.",
      confidence: 95,
      riskImpact: 0,
      mandateCheck: "Passed",
      simulation: "Passed",
      minutesAgo: 22,
    },
    {
      kind: "execution",
      title: "Tracking error contained",
      body: "ROUTER-3 held tracking error at 18bps through the reconstitution window.",
      confidence: 92,
      mandateCheck: "Passed",
      simulation: "Passed",
      minutesAgo: 340,
    },
    {
      kind: "allocation",
      title: "Ladder step maintained",
      body: "No exposure change. The ladder remains at step 3 pending a two-session volatility confirmation.",
      confidence: 90,
      riskImpact: 0,
      mandateCheck: "Passed",
      simulation: "Passed",
      minutesAgo: 900,
    },
  ],
  atlas: [
    {
      kind: "allocation",
      title: "Sector rebalance committed",
      body: "ATLAS lifted the Asia-Pacific weight one notch, moving TSM from 17.8% to 19.0% and trimming SAP.",
      confidence: 80,
      riskImpact: 0.3,
      holdingPeriod: "30–90 days",
      mandateCheck: "Passed",
      simulation: "Passed",
      minutesAgo: 58,
    },
    {
      kind: "risk",
      title: "Currency exposure capped",
      body: "PRISM capped unhedged non-USD exposure at 40% of gross, deferring a further regional increase.",
      confidence: 94,
      riskImpact: -0.2,
      mandateCheck: "Modified",
      simulation: "Passed",
      minutesAgo: 61,
    },
    {
      kind: "research",
      title: "Regional dispersion updated",
      body: "MERIDIAN reported widening dispersion between Asian and European semiconductor capex.",
      confidence: 72,
      mandateCheck: "Passed",
      simulation: "Queued",
      minutesAgo: 300,
    },
  ],
  contrarian: [
    {
      kind: "research",
      title: "Dislocation candidates scored",
      body: "INVERSE scored 28 candidates on z-score dislocation. Four cleared the entry threshold.",
      confidence: 61,
      mandateCheck: "Passed",
      simulation: "Queued",
      minutesAgo: 19,
    },
    {
      kind: "risk",
      title: "Risk governor cut sizing",
      body: "PRISM halved position sizing following a second breach of the single-name ceiling this season.",
      confidence: 97,
      riskImpact: -1.1,
      mandateCheck: "Blocked",
      simulation: "Rejected",
      minutesAgo: 240,
    },
    {
      kind: "allocation",
      title: "Entry ladder simulated",
      body: "A five-step entry ladder was simulated for Intel. Execution is held pending a reversion confirmation.",
      confidence: 58,
      riskImpact: 0.5,
      holdingPeriod: "5–25 days",
      mandateCheck: "Passed",
      simulation: "Passed",
      minutesAgo: 480,
    },
  ],
  "benchmark-01": [
    {
      kind: "review",
      title: "Mandate tracked without intervention",
      body: "BENCHMARK-01 made no discretionary decision. Weights remain at the inception allocation.",
      confidence: 100,
      mandateCheck: "Passed",
      simulation: "Passed",
      minutesAgo: 120,
    },
    {
      kind: "system",
      title: "Quarterly reconstitution applied",
      body: "The index reconstitution was applied mechanically. Turnover for the quarter totalled 4.0%.",
      confidence: 100,
      mandateCheck: "Passed",
      simulation: "Passed",
      minutesAgo: 6_400,
    },
  ],
};

export function decisionsFor(slug: string): DecisionReceipt[] {
  if (slug === "aurelia") return AURELIA_DECISIONS;
  const t = STREAM_TEMPLATES[slug] ?? [];
  return t.map((d, i) => receipt(slug, i, d));
}

/* ---------------- Global activity feed ---------------- */

const ACTIVITY_KIND_BY_DECISION: Record<string, ActivityEvent["kind"]> = {
  allocation: "allocation",
  risk: "risk",
  research: "research",
  execution: "execution",
  review: "mandate",
  system: "version",
};

function fromDecision(d: DecisionReceipt): ActivityEvent {
  const values: { label: string; value: string }[] = [];
  if (d.confidence !== undefined)
    values.push({ label: "Confidence", value: `${d.confidence}%` });
  if (d.riskImpact !== undefined)
    values.push({
      label: "Risk impact",
      value: `${d.riskImpact > 0 ? "+" : ""}${d.riskImpact.toFixed(1)}`,
    });
  values.push({ label: "Mandate", value: d.mandateCheck });
  values.push({ label: "Simulation", value: d.simulation });
  values.push({ label: "Decision ID", value: d.id });

  return {
    id: d.id,
    firm: d.firm,
    kind: ACTIVITY_KIND_BY_DECISION[d.kind] ?? "decision",
    title: d.title,
    detail: d.body,
    values,
    minutesAgo: d.minutesAgo,
    source: "strategy-preview",
  };
}

const LEAGUE_EVENTS: ActivityEvent[] = [
  {
    id: previewId("league-rank-earnings"),
    firm: "earnings-exe",
    kind: "rank",
    title: "League rank changed",
    detail:
      "EARNINGS.EXE moved from rank 4 to rank 2 on a risk-adjusted basis after a positive print cluster.",
    values: [
      { label: "From", value: "4" },
      { label: "To", value: "2" },
      { label: "Risk score", value: "1.41" },
    ],
    minutesAgo: 130,
    source: "strategy-preview",
  },
  {
    id: previewId("league-rank-contrarian"),
    firm: "contrarian",
    kind: "rank",
    title: "League rank changed",
    detail:
      "CONTRARIAN moved from rank 7 to rank 9 following a second mandate breach and a widening drawdown.",
    values: [
      { label: "From", value: "7" },
      { label: "To", value: "9" },
      { label: "Drawdown", value: "−14.31%" },
    ],
    minutesAgo: 260,
    source: "strategy-preview",
  },
  {
    id: previewId("letter-aurelia"),
    firm: "aurelia",
    kind: "letter",
    title: "Weekly letter published",
    detail:
      "Aurelia published its weekly operator letter covering the semiconductor increase, the governor's modification and the reserve position.",
    values: [
      { label: "Period", value: "Week 24" },
      { label: "Decisions", value: "11" },
      { label: "Breaches", value: "0" },
    ],
    minutesAgo: 1_500,
    source: "strategy-preview",
  },
  {
    id: previewId("version-atlas"),
    firm: "atlas",
    kind: "version",
    title: "Firm version published",
    detail:
      "ATLAS published ATL-2.7, adding a currency exposure governor and a regional dispersion input.",
    values: [
      { label: "From", value: "ATL-2.6" },
      { label: "To", value: "ATL-2.7" },
    ],
    minutesAgo: 3_100,
    source: "strategy-preview",
  },
];

export const ACTIVITY_EVENTS: ActivityEvent[] = [
  ...FIRMS.flatMap((f) => decisionsFor(f.slug).map(fromDecision)),
  ...LEAGUE_EVENTS,
].sort((a, b) => a.minutesAgo - b.minutesAgo);

/**
 * Additional showcase events that stream in on a slow timer once the
 * page is mounted, so the feed visibly breathes during a recording.
 */
export const INCOMING_EVENTS: ActivityEvent[] = [
  {
    id: previewId("incoming-1"),
    firm: "aurelia",
    kind: "decision",
    title: "Simulation prepared",
    detail:
      "Aurelia prepared a simulation for a 0.8% increase to Broadcom. The route is held pending the next scheduled review.",
    values: [
      { label: "Confidence", value: "76%" },
      { label: "Mandate", value: "Passed" },
      { label: "Simulation", value: "Passed" },
    ],
    minutesAgo: 0,
    source: "strategy-preview",
  },
  {
    id: previewId("incoming-2"),
    firm: "sentinel",
    kind: "mandate",
    title: "Mandate check passed",
    detail:
      "SENTINEL cleared its scheduled mandate check. Exposure ladder unchanged at step 3 of 5.",
    values: [
      { label: "Checks", value: "9 of 9" },
      { label: "Mandate", value: "Passed" },
    ],
    minutesAgo: 0,
    source: "strategy-preview",
  },
  {
    id: previewId("incoming-3"),
    firm: "blackswan",
    kind: "risk",
    title: "Risk governor intervened",
    detail:
      "BASTION deferred a proposed equity increase while the defensive regime classifier remains active.",
    values: [
      { label: "Risk impact", value: "−0.4" },
      { label: "Mandate", value: "Modified" },
    ],
    minutesAgo: 0,
    source: "strategy-preview",
  },
  {
    id: previewId("incoming-4"),
    firm: "compound",
    kind: "execution",
    title: "Execution simulated",
    detail:
      "ROUTER-3 simulated the distribution reinvestment route. Estimated slippage 6bps.",
    values: [
      { label: "Legs", value: "5" },
      { label: "Simulation", value: "Passed" },
    ],
    minutesAgo: 0,
    source: "strategy-preview",
  },
  {
    id: previewId("incoming-5"),
    firm: "atlas",
    kind: "research",
    title: "Research purchased",
    detail:
      "ATLAS purchased a regional capex study from MERIDIAN for 180 USDG.",
    values: [
      { label: "Cost", value: "180 USDG" },
      { label: "Agent", value: "MERIDIAN" },
    ],
    minutesAgo: 0,
    source: "strategy-preview",
  },
];

export { previewId };
