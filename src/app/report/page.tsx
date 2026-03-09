"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Stepper from "@/components/Stepper";
import {
  useBrief,
  type CapabilityMapEntry,
  type IntelligenceCard,
  type IntelligenceOption,
  type ConfidenceLevel,
  type EfficiencyOpportunity,
  type PartnerEntry,
  type StrategicWarning,
} from "@/components/BriefContext";

const STATUS_COLORS: Record<string, string> = {
  "strong-current": "bg-green-100 text-green-700 border-green-300",
  "strong-stale": "bg-amber-100 text-amber-700 border-amber-300",
  weak: "bg-orange-100 text-orange-700 border-orange-300",
  gap: "bg-red-100 text-red-700 border-red-300",
};

const STATUS_LABELS: Record<string, string> = {
  "strong-current": "Strong + Current",
  "strong-stale": "Strong + Stale",
  weak: "Weak",
  gap: "Gap",
};

const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
  verified: "bg-green-100 text-green-700",
  inferred: "bg-amber-100 text-amber-700",
  assumption: "bg-red-100 text-red-700",
};

const MATURITY_COLORS: Record<string, string> = {
  "bleeding-edge": "bg-purple-100 text-purple-700",
  emerging: "bg-blue-100 text-blue-700",
  established: "bg-gray-100 text-gray-600",
};

const COMPLEXITY_COLORS: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand">
      {children}
    </h2>
  );
}

function CapabilityMapTable({ entries }: { entries: CapabilityMapEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
            <th className="pb-2 pr-4">Area</th>
            <th className="pb-2 pr-4">Status</th>
            <th className="pb-2 pr-4">Current Approach</th>
            <th className="pb-2 pr-4">Recommendation</th>
            <th className="pb-2">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0">
              <td className="py-3 pr-4 font-medium text-body">{e.area}</td>
              <td className="py-3 pr-4">
                <Badge className={STATUS_COLORS[e.status] || "bg-gray-100 text-gray-600"}>
                  {STATUS_LABELS[e.status] || e.status}
                </Badge>
              </td>
              <td className="py-3 pr-4 text-muted">{e.currentApproach}</td>
              <td className="py-3 pr-4 text-body">{e.recommendation}</td>
              <td className="py-3">
                <Badge className={CONFIDENCE_COLORS[e.confidence] || "bg-gray-100 text-gray-600"}>
                  {e.confidence}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IntelOptionCard({ option }: { option: IntelligenceOption }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-md border border-border bg-subtle p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-body">{option.title}</h4>
            <Badge className={MATURITY_COLORS[option.marketMaturity] || "bg-gray-100 text-gray-600"}>
              {option.marketMaturity}
            </Badge>
            <Badge className={COMPLEXITY_COLORS[option.integrationComplexity] || "bg-gray-100 text-gray-600"}>
              {option.integrationComplexity} complexity
            </Badge>
            <Badge className={CONFIDENCE_COLORS[option.confidence] || "bg-gray-100 text-gray-600"}>
              {option.confidence}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted">{option.description}</p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-3 shrink-0 text-xs font-medium text-brand hover:underline"
        >
          {expanded ? "Collapse" : "Details"}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-border pt-3 text-xs">
          <div>
            <span className="font-semibold text-body">Why it matters: </span>
            <span className="text-muted">{option.whyItMatters}</span>
          </div>
          <div>
            <span className="font-semibold text-body">How it works: </span>
            <span className="text-muted">{option.howItWorks}</span>
          </div>
          <div>
            <span className="font-semibold text-body">Real-world example: </span>
            <span className="text-muted">{option.realWorldExample}</span>
          </div>
          <div>
            <span className="font-semibold text-body">Vendors & partners: </span>
            <span className="text-muted">{option.vendorsAndPartners}</span>
          </div>
          <div>
            <span className="font-semibold text-body">Deal alignment: </span>
            <span className="text-muted">{option.dealAlignment}</span>
          </div>
          <div>
            <span className="font-semibold text-body">Risks: </span>
            <span className="text-muted">{option.risks}</span>
          </div>
          <div>
            <span className="font-semibold text-body">Confidence reasoning: </span>
            <span className="text-muted">{option.confidenceReasoning}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function IntelligenceCardSection({ card }: { card: IntelligenceCard }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-white shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <Badge className={STATUS_COLORS[card.status] || "bg-gray-100 text-gray-600"}>
            {STATUS_LABELS[card.status] || card.status}
          </Badge>
          <h3 className="text-sm font-semibold text-body">{card.area}</h3>
        </div>
        <svg
          className={`h-5 w-5 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-border px-5 pb-5">
          <div className="mt-4 rounded-md bg-gray-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Conventional Approach
            </p>
            <p className="mt-1 text-sm text-muted">{card.conventionalApproach}</p>
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">
              Recommended Options
            </p>
            {card.options?.map((opt, i) => (
              <IntelOptionCard key={i} option={opt} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EfficiencySection({ items }: { items: EfficiencyOpportunity[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-md border border-border bg-white p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-body">{item.opportunity}</h4>
            <Badge className={CONFIDENCE_COLORS[item.confidence] || "bg-gray-100 text-gray-600"}>
              {item.confidence}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted">{item.description}</p>
          <p className="mt-2 text-xs font-medium text-teal">
            Impact: {item.estimatedImpact}
          </p>
        </div>
      ))}
    </div>
  );
}

function PartnerSection({ items }: { items: PartnerEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
            <th className="pb-2 pr-4">Partner</th>
            <th className="pb-2 pr-4">Area</th>
            <th className="pb-2 pr-4">Offering</th>
            <th className="pb-2 pr-4">Why They Fit</th>
            <th className="pb-2">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0">
              <td className="py-3 pr-4 font-medium text-body">{p.partner}</td>
              <td className="py-3 pr-4 text-muted">{p.relevantArea}</td>
              <td className="py-3 pr-4 text-muted">{p.whatTheyOffer}</td>
              <td className="py-3 pr-4 text-muted">{p.whyTheyFit}</td>
              <td className="py-3">
                <Badge className={CONFIDENCE_COLORS[p.confidence] || "bg-gray-100 text-gray-600"}>
                  {p.confidence}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WarningsSection({ items }: { items: StrategicWarning[] }) {
  return (
    <div className="space-y-3">
      {items.map((w, i) => (
        <div key={i} className="rounded-md border border-amber-300 bg-amber-50 p-4">
          <h4 className="text-sm font-semibold text-amber-800">{w.warning}</h4>
          <p className="mt-1 text-xs text-amber-700">
            <span className="font-medium">Impact:</span> {w.impact}
          </p>
          <p className="mt-1 text-xs text-amber-700">
            <span className="font-medium">Suggested Action:</span> {w.suggestedAction}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function ReportPage() {
  const router = useRouter();
  const { report, clearBrief } = useBrief();

  if (!report) {
    return (
      <>
        <Stepper />
        <main className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-white p-16 shadow-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-light">
              <svg className="h-7 w-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-muted">No report generated yet</p>
            <p className="mt-1 text-xs text-muted">Complete the wizard to generate your intelligence brief.</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 text-sm font-medium text-brand hover:underline"
            >
              Start New Brief
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Stepper />
      <main className="mx-auto max-w-5xl px-6 py-8 print:px-0 print:py-0">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between print:mb-4">
          <div>
            <h1 className="text-2xl font-bold text-body">{report.reportTitle}</h1>
            <p className="mt-1 text-sm text-muted">
              Generated {new Date(report.generatedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-3 print:hidden">
            <button
              onClick={() => window.print()}
              className="rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-body transition-colors hover:bg-subtle"
            >
              Print Report
            </button>
            <button
              onClick={() => {
                clearBrief();
                router.push("/");
              }}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              New Brief
            </button>
          </div>
        </div>

        <div className="space-y-6 print:space-y-4">
          {/* Scope Summary */}
          <section className="rounded-lg border border-border bg-white p-6 shadow-sm print:shadow-none">
            <SectionHeader>Executive Summary</SectionHeader>
            <div className="rounded-md border-l-4 border-brand bg-brand-light/50 p-4">
              <p className="whitespace-pre-line text-sm leading-relaxed text-body">
                {report.scopeSummary}
              </p>
            </div>
          </section>

          {/* Capability Map */}
          {report.capabilityMap?.length > 0 && (
            <section className="rounded-lg border border-border bg-white p-6 shadow-sm print:shadow-none">
              <SectionHeader>Capability Map</SectionHeader>
              <CapabilityMapTable entries={report.capabilityMap} />
            </section>
          )}

          {/* Intelligence Cards */}
          {report.intelligenceCards?.length > 0 && (
            <section>
              <div className="mb-4 rounded-lg border border-border bg-white p-6 shadow-sm print:shadow-none">
                <SectionHeader>Intelligence Cards</SectionHeader>
                <p className="text-xs text-muted">
                  Expand each area to see conventional approaches and recommended alternatives.
                </p>
              </div>
              <div className="space-y-3">
                {report.intelligenceCards.map((card, i) => (
                  <IntelligenceCardSection key={i} card={card} />
                ))}
              </div>
            </section>
          )}

          {/* Efficiency Opportunities */}
          {report.efficiencyOpportunities?.length > 0 && (
            <section className="rounded-lg border border-border bg-white p-6 shadow-sm print:shadow-none">
              <SectionHeader>Efficiency Opportunities</SectionHeader>
              <EfficiencySection items={report.efficiencyOpportunities} />
            </section>
          )}

          {/* Partner Landscape */}
          {report.partnerLandscape?.length > 0 && (
            <section className="rounded-lg border border-border bg-white p-6 shadow-sm print:shadow-none">
              <SectionHeader>Partner Landscape</SectionHeader>
              <PartnerSection items={report.partnerLandscape} />
            </section>
          )}

          {/* Strategic Warnings */}
          {report.strategicWarnings?.length > 0 && (
            <section className="rounded-lg border border-border bg-white p-6 shadow-sm print:shadow-none">
              <SectionHeader>Strategic Warnings</SectionHeader>
              <WarningsSection items={report.strategicWarnings} />
            </section>
          )}
        </div>
      </main>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          header, .print\\:hidden { display: none !important; }
          main { max-width: 100% !important; }
          section { break-inside: avoid; }
          .shadow-sm { box-shadow: none !important; }
        }
      `}</style>
    </>
  );
}
