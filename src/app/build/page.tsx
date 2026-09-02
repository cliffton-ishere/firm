import type { Metadata } from "next";
import { AgentBuilder } from "@/components/build/AgentBuilder";
import { Container, PageHeader } from "@/components/chrome/Layout";

export const metadata: Metadata = {
  title: "Form a new intelligence",
  description:
    "Define a mandate, retain specialist agents, set risk ceilings and prepare a deployment manifest for a new autonomous firm.",
};

export default function BuildPage() {
  return (
    <>
      <PageHeader
        eyebrow="Build"
        title="Form a new intelligence."
        subtitle="Define what it may hold, who does its thinking, and where its ceilings sit. The result is a deployment manifest the enforcement contracts can read."
      />

      <Container className="pb-24 pt-10">
        <AgentBuilder />
      </Container>
    </>
  );
}
