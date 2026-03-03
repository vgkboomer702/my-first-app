"use client";

import { useRouter } from "next/navigation";
import Stepper from "@/components/Stepper";

export default function ReportPage() {
  const router = useRouter();

  return (
    <>
      <Stepper />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-body">Solution Intelligence Brief</h1>
            <p className="mt-1 text-sm text-muted">
              Your comprehensive analysis and strategy recommendations.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-body transition-colors hover:bg-subtle">
              Export PDF
            </button>
            <button
              onClick={() => router.push("/")}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              New Brief
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">
              Executive Summary
            </h2>
            <div className="rounded-md bg-subtle p-4">
              <p className="text-sm text-muted italic">
                Your Solution Intelligence Brief will appear here — including executive summary,
                scope analysis, capability mapping, risk assessment, and strategic recommendations.
              </p>
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">
                Key Requirements
              </h2>
              <div className="rounded-md bg-subtle p-4">
                <p className="text-sm text-muted italic">Extracted requirements will appear here.</p>
              </div>
            </section>

            <section className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">
                Capability Fit
              </h2>
              <div className="rounded-md bg-subtle p-4">
                <p className="text-sm text-muted italic">Capability assessment results will appear here.</p>
              </div>
            </section>

            <section className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">
                Risk Assessment
              </h2>
              <div className="rounded-md bg-subtle p-4">
                <p className="text-sm text-muted italic">Identified risks and mitigations will appear here.</p>
              </div>
            </section>

            <section className="rounded-lg border border-border bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand">
                Win Strategy
              </h2>
              <div className="rounded-md bg-subtle p-4">
                <p className="text-sm text-muted italic">Strategic recommendations will appear here.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
