"use client";

import StepLayout from "@/components/StepLayout";

export default function StrategyPage() {
  return (
    <StepLayout
      title="Deal Strategy"
      subtitle="Define your win themes, competitive positioning, and deal strategy."
      backHref="/capabilities"
      nextLabel="Generate Brief"
      nextHref="/generate"
    >
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-light">
          <svg className="h-7 w-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-muted">
          Deal strategy input will appear here
        </p>
        <p className="mt-1 text-xs text-muted">
          Capture win themes, pricing strategy, partner considerations, and competitive intelligence.
        </p>
      </div>
    </StepLayout>
  );
}
