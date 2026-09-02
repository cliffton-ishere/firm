"use client";

import { ArrowLeft, ArrowRight, Check, Download, RotateCcw, Shuffle } from "lucide-react";
import * as React from "react";
import { Sigil } from "@/components/brand/Sigil";
import { RiskBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ChoiceGroup,
  Field,
  Input,
  Select,
  Slider,
  Textarea,
  Toggle,
} from "@/components/ui/Field";
import { ErrorState } from "@/components/ui/States";
import { cn } from "@/lib/cn";
import { useLocalStorage } from "@/lib/hooks";
import type { DeploymentManifest, RiskClass } from "@/lib/types";

/* ---------------- Configuration model ---------------- */

interface BuilderState {
  name: string;
  shortId: string;
  description: string;
  personality: string;
  sigilSeed: number;

  universe: string;
  assets: string[];
  maxSinglePosition: number;
  maxSectorExposure: number;
  rebalanceCadence: string;
  benchmark: string;
  minReserve: number;

  primaryModel: string;
  researchAgent: string;
  riskAgent: string;
  executionAgent: string;
  decisionFrequency: string;
  explanationDepth: string;

  riskProfile: RiskClass;
  maxDrawdownResponse: string;
  maxPosition: number;
  maxSectorConcentration: number;
  turnoverCeiling: number;
  emergencyPause: boolean;

  builderFee: number;
  performanceFee: number;
  highWaterMark: boolean;
  capacity: number;
}

const INITIAL: BuilderState = {
  name: "",
  shortId: "",
  description: "",
  personality: "Analytical",
  sigilSeed: 4663,

  universe: "US large-cap technology",
  assets: ["NVDA", "MSFT", "GOOGL", "AVGO", "USDG"],
  maxSinglePosition: 22,
  maxSectorExposure: 60,
  rebalanceCadence: "Weekly",
  benchmark: "BENCHMARK-01",
  minReserve: 10,

  primaryModel: "Frontier general model",
  researchAgent: "ORACLE-7",
  riskAgent: "PRISM",
  executionAgent: "VECTOR",
  decisionFrequency: "Daily evaluation",
  explanationDepth: "Full reasoning receipt",

  riskProfile: "Balanced",
  maxDrawdownResponse: "Reduce gross exposure 25%",
  maxPosition: 22,
  maxSectorConcentration: 60,
  turnoverCeiling: 40,
  emergencyPause: true,

  builderFee: 1,
  performanceFee: 15,
  highWaterMark: true,
  capacity: 5_000_000,
};

const STAGES = [
  { id: "identity", label: "Identity", hint: "Name, mark and voice" },
  { id: "mandate", label: "Mandate", hint: "What it may hold" },
  { id: "intelligence", label: "Intelligence", hint: "Who does the thinking" },
  { id: "risk", label: "Risk", hint: "Ceilings and responses" },
  { id: "economics", label: "Economics", hint: "Fees and capacity" },
  { id: "review", label: "Review", hint: "Deployment manifest" },
] as const;

const ASSET_POOL = [
  "NVDA", "MSFT", "GOOGL", "AVGO", "TSM", "AMD", "META", "AAPL",
  "CRM", "NFLX", "UNP", "CAT", "JNJ", "PG", "KO", "SPY-T", "QQQ-T", "USDG",
];

const PERSONALITIES = [
  { value: "Analytical", label: "Analytical", description: "Evidence first, slow to move" },
  { value: "Decisive", label: "Decisive", description: "Acts on partial information" },
  { value: "Patient", label: "Patient", description: "Long holding periods, low turnover" },
];

/* ---------------- Component ---------------- */

export function AgentBuilder() {
  const [state, setState, clearState] = useLocalStorage<BuilderState>(
    "firm:builder",
    INITIAL,
  );
  const [stage, setStage] = React.useState(0);
  const [prepared, setPrepared] = React.useState(false);
  const [downloadError, setDownloadError] = React.useState<string | null>(null);
  const [touched, setTouched] = React.useState(false);

  const set = <K extends keyof BuilderState>(key: K, value: BuilderState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const errors = validate(state);
  const identityValid = !errors.name && !errors.shortId;

  const manifest = React.useMemo(() => buildManifest(state), [state]);

  const download = () => {
    setDownloadError(null);
    try {
      const blob = new Blob([JSON.stringify(manifest, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(state.shortId || "firm").toLowerCase()}-deployment-manifest.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setDownloadError(
        "The manifest could not be saved by this browser. Copy the JSON below instead.",
      );
    }
  };

  const reset = () => {
    clearState();
    setStage(0);
    setPrepared(false);
    setTouched(false);
  };

  const canAdvance = stage !== 0 || identityValid;

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
      {/* ---------------- Stepper ---------------- */}
      <nav aria-label="Builder stages" className="lg:sticky lg:top-[calc(var(--nav-h)+24px)] lg:self-start">
        <ol className="no-scrollbar flex gap-2 overflow-x-auto lg:block lg:space-y-0.5">
          {STAGES.map((s, i) => {
            const done = i < stage;
            const current = i === stage;
            return (
              <li key={s.id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  onClick={() => (i === 0 || identityValid) && setStage(i)}
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "focus-ring group flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition-colors duration-300",
                    current
                      ? "bg-white/[0.06] text-gallery"
                      : "text-mist hover:bg-white/[0.03] hover:text-titanium",
                    !identityValid && i !== 0 && "opacity-45",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full border text-[10px] transition-colors duration-300",
                      done
                        ? "border-lime/40 bg-lime/15 text-lime"
                        : current
                          ? "border-white/25 text-gallery"
                          : "border-white/12 text-slate",
                    )}
                  >
                    {done ? <Check className="size-3" strokeWidth={2.5} /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block whitespace-nowrap text-[13px] font-medium tracking-[-0.015em]">
                      {s.label}
                    </span>
                    <span className="mt-0.5 hidden text-[11px] text-slate lg:block">
                      {s.hint}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={reset}
          className="focus-ring mt-5 hidden items-center gap-1.5 rounded px-3 text-[11.5px] text-slate transition-colors hover:text-titanium lg:inline-flex"
        >
          <RotateCcw className="size-3" strokeWidth={1.6} />
          Reset configuration
        </button>
      </nav>

      {/* ---------------- Stage body ---------------- */}
      <div className="min-w-0">
        <div className="rounded-[18px] border border-white/[0.07] bg-[#0a0c0b] p-5 sm:p-7">
          <header className="mb-7">
            <p className="label text-slate">
              Stage {stage + 1} of {STAGES.length}
            </p>
            <h2 className="display-tight mt-3 text-[26px] text-gallery">
              {STAGES[stage].label}
            </h2>
          </header>

          {stage === 0 && (
            <div className="space-y-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="flex flex-col items-center gap-3">
                  <span className="grid size-24 place-items-center rounded-[20px] border border-white/[0.09] bg-white/[0.025] text-titanium">
                    <Sigil
                      id={`${state.shortId || state.name || "firm"}-${state.sigilSeed}`}
                      className="size-14"
                      active
                    />
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      set("sigilSeed", Math.floor(Math.random() * 1_000_000))
                    }
                    className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1.5 text-[11.5px] text-mist transition-colors hover:border-white/20 hover:text-gallery"
                  >
                    <Shuffle className="size-3" strokeWidth={1.6} />
                    Regenerate sigil
                  </button>
                </div>

                <div className="min-w-0 flex-1 space-y-5">
                  <Field
                    label="Firm name"
                    htmlFor="b-name"
                    error={touched ? errors.name : undefined}
                  >
                    <Input
                      id="b-name"
                      value={state.name}
                      maxLength={24}
                      onChange={(e) => {
                        setTouched(true);
                        set("name", e.target.value.toUpperCase());
                      }}
                      invalid={Boolean(touched && errors.name)}
                      placeholder="MERIDIAN"
                      className="mono uppercase"
                    />
                  </Field>

                  <Field
                    label="Short identifier"
                    hint="2–6 characters"
                    htmlFor="b-id"
                    error={touched ? errors.shortId : undefined}
                  >
                    <Input
                      id="b-id"
                      value={state.shortId}
                      maxLength={6}
                      onChange={(e) => {
                        setTouched(true);
                        set(
                          "shortId",
                          e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""),
                        );
                      }}
                      invalid={Boolean(touched && errors.shortId)}
                      placeholder="MRD"
                      className="mono uppercase"
                    />
                  </Field>
                </div>
              </div>

              <Field label="Description" hint={`${state.description.length}/240`}>
                <Textarea
                  value={state.description}
                  maxLength={240}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="What this firm exists to do, and what it will refuse to do."
                />
              </Field>

              <Field label="Personality">
                <ChoiceGroup
                  ariaLabel="Personality"
                  value={state.personality}
                  onChange={(v) => set("personality", v)}
                  options={PERSONALITIES}
                />
              </Field>
            </div>
          )}

          {stage === 1 && (
            <div className="space-y-6">
              <Field label="Investment universe">
                <Select
                  ariaLabel="Investment universe"
                  value={state.universe}
                  onChange={(v) => set("universe", v)}
                  options={[
                    "US large-cap technology",
                    "Global technology",
                    "Broad market index",
                    "Dividend growth",
                    "Value and industrials",
                    "Event-driven equities",
                  ].map((v) => ({ value: v, label: v }))}
                />
              </Field>

              <Field
                label="Approved tokenized assets"
                hint={`${state.assets.length} selected`}
              >
                <div className="flex flex-wrap gap-1.5">
                  {ASSET_POOL.map((a) => {
                    const on = state.assets.includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          set(
                            "assets",
                            on
                              ? state.assets.filter((x) => x !== a)
                              : [...state.assets, a],
                          )
                        }
                        className={cn(
                          "focus-ring mono rounded-[8px] border px-2.5 py-1.5 text-[11.5px] transition-all duration-250",
                          on
                            ? "border-lime/35 bg-lime/[0.08] text-lime"
                            : "border-white/[0.08] text-mist hover:border-white/18 hover:text-gallery",
                        )}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Slider
                  label="Maximum single position"
                  min={5}
                  max={50}
                  value={state.maxSinglePosition}
                  onChange={(v) => set("maxSinglePosition", v)}
                  format={(v) => `${v}%`}
                />
                <Slider
                  label="Maximum sector exposure"
                  min={20}
                  max={100}
                  value={state.maxSectorExposure}
                  onChange={(v) => set("maxSectorExposure", v)}
                  format={(v) => `${v}%`}
                />
                <Slider
                  label="Minimum USDG reserve"
                  min={0}
                  max={50}
                  value={state.minReserve}
                  onChange={(v) => set("minReserve", v)}
                  format={(v) => `${v}%`}
                />
                <Field label="Rebalance cadence">
                  <Select
                    ariaLabel="Rebalance cadence"
                    value={state.rebalanceCadence}
                    onChange={(v) => set("rebalanceCadence", v)}
                    options={[
                      "Daily",
                      "Weekly",
                      "Bi-weekly",
                      "Monthly",
                      "Event-driven",
                    ].map((v) => ({ value: v, label: v }))}
                  />
                </Field>
              </div>

              <Field label="Benchmark">
                <Select
                  ariaLabel="Benchmark"
                  value={state.benchmark}
                  onChange={(v) => set("benchmark", v)}
                  options={[
                    { value: "BENCHMARK-01", label: "BENCHMARK-01 · Passive technology index" },
                    { value: "SPY-T", label: "SPY-T · Tokenized S&P 500" },
                    { value: "QQQ-T", label: "QQQ-T · Tokenized Nasdaq 100" },
                  ]}
                />
              </Field>
            </div>
          )}

          {stage === 2 && (
            <div className="space-y-6">
              <div className="rounded-[12px] border border-white/[0.07] bg-white/[0.018] px-4 py-3.5">
                <p className="text-[12px] leading-relaxed text-mist">
                  These are configuration choices written into the deployment
                  manifest. No model provider is contacted, and no agent is
                  retained, until the firm is deployed.
                </p>
              </div>

              <Field label="Primary model">
                <Input
                  value={state.primaryModel}
                  onChange={(e) => set("primaryModel", e.target.value)}
                  placeholder="Frontier general model"
                />
              </Field>

              <div className="grid gap-6 sm:grid-cols-3">
                <Field label="Research agent">
                  <Select
                    ariaLabel="Research agent"
                    value={state.researchAgent}
                    onChange={(v) => set("researchAgent", v)}
                    options={["ORACLE-7", "QUILL", "HERALD", "MERIDIAN", "DELPHI-2"].map(
                      (v) => ({ value: v, label: v }),
                    )}
                  />
                </Field>
                <Field label="Risk agent">
                  <Select
                    ariaLabel="Risk agent"
                    value={state.riskAgent}
                    onChange={(v) => set("riskAgent", v)}
                    options={["PRISM", "BASTION", "WATCHTOWER"].map((v) => ({
                      value: v,
                      label: v,
                    }))}
                  />
                </Field>
                <Field label="Execution agent">
                  <Select
                    ariaLabel="Execution agent"
                    value={state.executionAgent}
                    onChange={(v) => set("executionAgent", v)}
                    options={["VECTOR", "ROUTER-3"].map((v) => ({
                      value: v,
                      label: v,
                    }))}
                  />
                </Field>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Decision frequency">
                  <Select
                    ariaLabel="Decision frequency"
                    value={state.decisionFrequency}
                    onChange={(v) => set("decisionFrequency", v)}
                    options={[
                      "Continuous",
                      "Daily evaluation",
                      "Weekly evaluation",
                      "Event-driven only",
                    ].map((v) => ({ value: v, label: v }))}
                  />
                </Field>
                <Field label="Explanation depth">
                  <Select
                    ariaLabel="Explanation depth"
                    value={state.explanationDepth}
                    onChange={(v) => set("explanationDepth", v)}
                    options={[
                      "Headline only",
                      "Summary with confidence",
                      "Full reasoning receipt",
                    ].map((v) => ({ value: v, label: v }))}
                  />
                </Field>
              </div>
            </div>
          )}

          {stage === 3 && (
            <div className="space-y-6">
              <Field label="Risk profile">
                <ChoiceGroup
                  ariaLabel="Risk profile"
                  value={state.riskProfile}
                  onChange={(v) => set("riskProfile", v)}
                  options={[
                    {
                      value: "Conservative" as RiskClass,
                      label: "Conservative",
                      description: "High reserve, low turnover",
                    },
                    {
                      value: "Balanced" as RiskClass,
                      label: "Balanced",
                      description: "Measured concentration",
                    },
                    {
                      value: "Aggressive" as RiskClass,
                      label: "Aggressive",
                      description: "Higher turnover and dispersion",
                    },
                  ]}
                />
              </Field>

              <Field label="Maximum drawdown response">
                <Select
                  ariaLabel="Maximum drawdown response"
                  value={state.maxDrawdownResponse}
                  onChange={(v) => set("maxDrawdownResponse", v)}
                  options={[
                    "Reduce gross exposure 25%",
                    "Halve position sizing",
                    "Raise reserve to 45%",
                    "Halt new risk entirely",
                  ].map((v) => ({ value: v, label: v }))}
                />
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Slider
                  label="Maximum position"
                  min={5}
                  max={50}
                  value={state.maxPosition}
                  onChange={(v) => set("maxPosition", v)}
                  format={(v) => `${v}%`}
                />
                <Slider
                  label="Maximum sector concentration"
                  min={20}
                  max={100}
                  value={state.maxSectorConcentration}
                  onChange={(v) => set("maxSectorConcentration", v)}
                  format={(v) => `${v}%`}
                />
                <Slider
                  label="Turnover ceiling"
                  min={5}
                  max={100}
                  value={state.turnoverCeiling}
                  onChange={(v) => set("turnoverCeiling", v)}
                  format={(v) => `${v}% / quarter`}
                />
              </div>

              <Toggle
                checked={state.emergencyPause}
                onChange={(v) => set("emergencyPause", v)}
                label="Emergency pause authority"
                description="Allows the risk governor to halt all new risk without operator approval."
              />
            </div>
          )}

          {stage === 4 && (
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Slider
                  label="Builder fee"
                  min={0}
                  max={3}
                  step={0.25}
                  value={state.builderFee}
                  onChange={(v) => set("builderFee", v)}
                  format={(v) => `${v}% annual`}
                />
                <Slider
                  label="Performance fee"
                  min={0}
                  max={30}
                  value={state.performanceFee}
                  onChange={(v) => set("performanceFee", v)}
                  format={(v) => `${v}%`}
                />
              </div>

              <Toggle
                checked={state.highWaterMark}
                onChange={(v) => set("highWaterMark", v)}
                label="High-water mark"
                description="Performance fees accrue only above the firm's previous peak NAV."
              />

              <Field label="Capacity" hint="Maximum tracked capital">
                <Select
                  ariaLabel="Capacity"
                  value={String(state.capacity)}
                  onChange={(v) => set("capacity", Number(v))}
                  options={[
                    { value: "1000000", label: "1M USDG · seed" },
                    { value: "5000000", label: "5M USDG · standard" },
                    { value: "25000000", label: "25M USDG · institutional" },
                  ]}
                />
              </Field>

              <div className="rounded-[12px] border border-white/[0.07] bg-white/[0.018] px-4 py-3.5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="label text-slate">Agent bond required</span>
                  <span className="num text-[15px] font-medium text-gallery">
                    {agentBond(state).toLocaleString("en-US")} USDG
                  </span>
                </div>
                <p className="mt-2.5 text-[11.5px] leading-relaxed text-mist">
                  The bond is posted by the builder and is slashable on a mandate
                  breach. It scales with capacity and with the performance fee
                  the firm charges.
                </p>
              </div>
            </div>
          )}

          {stage === 5 && (
            <div className="space-y-6">
              {/* Visual preview of the resulting firm */}
              <div className="rounded-[16px] border border-white/[0.08] bg-[#0b0d0c] p-5">
                <div className="flex items-start gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-[14px] border border-lime/25 bg-white/[0.03] text-gallery">
                    <Sigil
                      id={`${state.shortId || state.name || "firm"}-${state.sigilSeed}`}
                      className="size-9"
                      active
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <h3 className="text-[18px] font-medium tracking-[-0.02em] text-gallery">
                        {state.name || "UNNAMED"}
                      </h3>
                      <span className="mono label rounded-full border border-white/10 px-2 py-1 text-slate">
                        {state.shortId || "———"}-1.0
                      </span>
                    </div>
                    <p className="mt-2 max-w-[54ch] text-[12.5px] leading-relaxed text-mist">
                      {state.description ||
                        "No description provided. The firm will publish its mandate on deployment."}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <RiskBadge risk={state.riskProfile} />
                      <span aria-hidden className="h-3 w-px bg-white/12" />
                      <span className="text-[11.5px] text-mist">
                        {state.universe}
                      </span>
                      <span aria-hidden className="h-3 w-px bg-white/12" />
                      <span className="text-[11.5px] text-mist">
                        {state.rebalanceCadence} rebalance
                      </span>
                    </div>
                  </div>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-4 sm:grid-cols-4">
                  {[
                    { l: "Max position", v: `${state.maxPosition}%` },
                    { l: "Min reserve", v: `${state.minReserve}%` },
                    { l: "Performance fee", v: `${state.performanceFee}%` },
                    {
                      l: "Capacity",
                      v: `${(state.capacity / 1_000_000).toFixed(0)}M USDG`,
                    },
                  ].map((m) => (
                    <div key={m.l}>
                      <dt className="label text-slate">{m.l}</dt>
                      <dd className="num mt-2 text-[14px] text-gallery">{m.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {prepared && (
                <div className="rounded-[14px] border border-lime/25 bg-lime/[0.05] px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-6 place-items-center rounded-full border border-lime/35 bg-lime/10 text-lime">
                      <Check className="size-3.5" strokeWidth={2.2} />
                    </span>
                    <p className="text-[14px] font-medium tracking-[-0.015em] text-gallery">
                      Deployment manifest ready
                    </p>
                  </div>
                  <p className="mt-2.5 max-w-[62ch] text-[12.5px] leading-relaxed text-mist">
                    The manifest below fully describes the firm. Nothing has been
                    deployed — submitting it to Robinhood Chain requires the
                    production factory contract, which is not yet configured on
                    this deployment.
                  </p>
                  <Button variant="signal" size="sm" className="mt-4" onClick={download}>
                    <Download className="size-3.5" strokeWidth={1.7} />
                    Download manifest
                  </Button>
                  {downloadError && (
                    <ErrorState
                      className="mt-4"
                      title="Manifest not saved"
                      body={downloadError}
                    />
                  )}
                </div>
              )}

              <div>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h3 className="label text-slate">Deployment manifest</h3>
                  <span className="mono text-[11px] text-slate">
                    firm.deployment.manifest/v1
                  </span>
                </div>
                <pre className="mono max-h-[420px] overflow-auto rounded-[12px] border border-white/[0.07] bg-black/45 p-4 text-[11.5px] leading-[1.7] text-titanium">
                  <code>{JSON.stringify(manifest, null, 2)}</code>
                </pre>
              </div>
            </div>
          )}

          {/* ---------------- Stage controls ---------------- */}
          <div className="mt-8 flex items-center gap-2.5 border-t border-white/[0.06] pt-6">
            {stage > 0 && (
              <Button
                variant="outline"
                onClick={() => setStage((s) => s - 1)}
                iconOnly
                aria-label="Previous stage"
              >
                <ArrowLeft className="size-4" strokeWidth={1.6} />
              </Button>
            )}

            {stage < STAGES.length - 1 ? (
              <Button
                variant="primary"
                className="flex-1 sm:flex-none"
                disabled={!canAdvance}
                onClick={() => {
                  setTouched(true);
                  if (canAdvance) setStage((s) => s + 1);
                }}
              >
                Continue to {STAGES[stage + 1].label}
                <ArrowRight className="size-3.5" strokeWidth={1.6} />
              </Button>
            ) : (
              <Button
                variant="signal"
                className="flex-1 sm:flex-none"
                disabled={prepared}
                onClick={() => setPrepared(true)}
              >
                {prepared ? "Manifest prepared" : "Prepare deployment"}
              </Button>
            )}

            <button
              type="button"
              onClick={reset}
              className="focus-ring ml-auto inline-flex items-center gap-1.5 rounded px-2 text-[11.5px] text-slate transition-colors hover:text-titanium lg:hidden"
            >
              <RotateCcw className="size-3" strokeWidth={1.6} />
              Reset
            </button>
          </div>
        </div>

        <p className="mt-5 text-[11.5px] leading-relaxed text-slate">
          Your configuration is stored locally in this browser so a refresh does
          not lose it. It is never sent anywhere, and no contract is deployed
          from this screen.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function validate(s: BuilderState) {
  const errors: { name?: string; shortId?: string } = {};
  if (s.name.trim().length < 2)
    errors.name = "Give the firm a name of at least two characters.";
  if (s.shortId.length < 2 || s.shortId.length > 6)
    errors.shortId = "The short identifier must be 2–6 characters.";
  return errors;
}

function agentBond(s: BuilderState) {
  return Math.round((s.capacity * 0.01 + s.performanceFee * 1000) / 100) * 100;
}

function buildManifest(s: BuilderState): DeploymentManifest {
  return {
    schema: "firm.deployment.manifest/v1",
    identity: {
      name: s.name || "UNNAMED",
      shortId: s.shortId || "———",
      description: s.description,
      personality: s.personality,
      sigilSeed: s.sigilSeed,
    },
    mandate: {
      universe: s.universe,
      assets: s.assets,
      maxSinglePosition: s.maxSinglePosition,
      maxSectorExposure: s.maxSectorExposure,
      rebalanceCadence: s.rebalanceCadence,
      benchmark: s.benchmark,
      minReserve: s.minReserve,
    },
    intelligence: {
      primaryModel: s.primaryModel,
      researchAgent: s.researchAgent,
      riskAgent: s.riskAgent,
      executionAgent: s.executionAgent,
      decisionFrequency: s.decisionFrequency,
      explanationDepth: s.explanationDepth,
    },
    risk: {
      profile: s.riskProfile,
      maxDrawdownResponse: s.maxDrawdownResponse,
      maxPosition: s.maxPosition,
      maxSectorConcentration: s.maxSectorConcentration,
      turnoverCeiling: s.turnoverCeiling,
      emergencyPause: s.emergencyPause,
    },
    economics: {
      builderFee: s.builderFee,
      performanceFee: s.performanceFee,
      highWaterMark: s.highWaterMark,
      agentBond: agentBond(s),
      capacity: s.capacity,
    },
    network: {
      chain: "Robinhood Chain",
      chainId: 4663,
      settlementAsset: "USDG",
    },
  };
}
