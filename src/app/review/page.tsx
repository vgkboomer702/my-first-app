"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import { useBrief, type ScopeAnalysis } from "@/components/BriefContext";

const PRIORITY_STYLES = {
  "must-have": "bg-red-100 text-red-700",
  "should-have": "bg-amber-100 text-amber-700",
  "nice-to-have": "bg-green-100 text-green-700",
} as const;

function SectionHeader({ title, onEdit }: { title: string; onEdit?: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-brand">{title}</h3>
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-xs font-medium text-muted transition-colors hover:text-brand"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Edit
        </button>
      )}
    </div>
  );
}

export default function ReviewPage() {
  const { document, scopeAnalysis, setScopeAnalysis } = useBrief();
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textExpanded, setTextExpanded] = useState(false);

  useEffect(() => {
    if (document && !scopeAnalysis && !isAnalyzing) {
      runAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document]);

  async function runAnalysis() {
    if (!document) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze-scope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: document.text, filename: document.filename }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Analysis failed");
        return;
      }

      setScopeAnalysis(data.analysis as ScopeAnalysis);
    } catch {
      setError("Failed to connect to the analysis service. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (!document) {
    return (
      <StepLayout
        title="Review Scope"
        subtitle="Review and confirm the extracted scope from the uploaded document."
        backHref="/upload"
        nextLabel="Confirm & Continue"
        nextHref="/capabilities"
        nextDisabled
      >
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-light">
            <svg className="h-7 w-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-muted">No document uploaded yet</p>
          <button
            onClick={() => router.push("/upload")}
            className="mt-4 text-sm font-medium text-brand hover:underline"
          >
            Go to Upload
          </button>
        </div>
      </StepLayout>
    );
  }

  return (
    <StepLayout
      title="Review Scope"
      subtitle="Review and confirm the extracted scope from the uploaded document."
      backHref="/upload"
      nextLabel="Confirm & Continue"
      nextHref="/capabilities"
      nextDisabled={!scopeAnalysis}
    >
      {/* Document info bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
          {document.fileType}
        </span>
        <span className="text-sm font-medium text-body">{document.filename}</span>
        {document.pageCount && (
          <span className="text-xs text-muted">
            {document.pageCount} {document.fileType === "XLSX" || document.fileType === "XLS" ? "sheet" : "page"}{document.pageCount !== 1 ? "s" : ""}
          </span>
        )}
        <span className="text-xs text-muted">
          {document.text.length.toLocaleString()} characters extracted
        </span>
      </div>

      {/* Loading state */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-3 border-brand-light border-t-brand" />
          <p className="text-sm font-semibold text-brand">Analyzing document with AI...</p>
          <p className="mt-1 text-xs text-muted">Extracting requirements, evaluation criteria, and strategic insights.</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{error}</p>
          <button
            onClick={runAnalysis}
            className="mt-2 text-sm font-medium text-brand hover:underline"
          >
            Retry Analysis
          </button>
        </div>
      )}

      {/* Scope analysis results */}
      {scopeAnalysis && (
        <div className="space-y-6">
          {/* Scope Summary */}
          <div className="rounded-md border-l-4 border-brand bg-brand-light p-4">
            <SectionHeader title="Scope Summary" onEdit={() => {}} />
            <p className="text-sm leading-relaxed text-body">{scopeAnalysis.scopeSummary}</p>
          </div>

          {/* Requirements Table */}
          <div>
            <SectionHeader title="Requirements" onEdit={() => {}} />
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-subtle">
                    <th className="px-4 py-2.5 text-left font-semibold text-muted">ID</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-muted">Category</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-muted">Description</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-muted">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {scopeAnalysis.requirements.map((req, i) => (
                    <tr key={req.id || i} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 font-mono text-xs text-muted">{req.id}</td>
                      <td className="px-4 py-2.5 font-medium text-body">{req.category}</td>
                      <td className="px-4 py-2.5 text-body">{req.description}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${PRIORITY_STYLES[req.priority] || "bg-gray-100 text-gray-600"}`}>
                          {req.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Evaluation Criteria */}
          <div>
            <SectionHeader title="Evaluation Criteria" onEdit={() => {}} />
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-subtle">
                    <th className="px-4 py-2.5 text-left font-semibold text-muted">Criterion</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-muted">Weight</th>
                    <th className="px-4 py-2.5 text-left font-semibold text-muted">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {scopeAnalysis.evaluationCriteria.map((ec, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 font-medium text-body">{ec.criterion}</td>
                      <td className="px-4 py-2.5">
                        <span className="rounded-full bg-teal-light px-2.5 py-0.5 text-xs font-semibold text-teal">{ec.weight}</span>
                      </td>
                      <td className="px-4 py-2.5 text-body">{ec.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Constraints */}
          <div>
            <SectionHeader title="Constraints" onEdit={() => {}} />
            <div className="space-y-2">
              {scopeAnalysis.constraints.map((c, i) => (
                <div key={i} className="flex gap-3 rounded-md border border-border bg-white p-3">
                  <span className="shrink-0 rounded bg-brand-light px-2 py-0.5 text-xs font-semibold text-brand">{c.type}</span>
                  <p className="text-sm text-body">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Client Priorities */}
          <div>
            <SectionHeader title="Client Priorities" onEdit={() => {}} />
            <div className="space-y-2">
              {scopeAnalysis.clientPriorities.map((cp, i) => (
                <div key={i} className="rounded-md border border-border bg-white p-3">
                  <p className="text-sm font-medium text-body">{cp.priority}</p>
                  <p className="mt-1 border-l-2 border-teal pl-3 text-xs italic text-muted">{cp.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Capability Areas */}
          <div>
            <SectionHeader title="Capability Areas" onEdit={() => {}} />
            <div className="grid gap-3 sm:grid-cols-2">
              {scopeAnalysis.capabilityAreas.map((ca, i) => (
                <div key={i} className="rounded-md border border-border bg-white p-3">
                  <p className="text-sm font-semibold text-brand">{ca.area}</p>
                  <p className="mt-1 text-xs text-body">{ca.description}</p>
                  <p className="mt-2 text-xs text-muted">
                    <span className="font-medium">Relevance:</span> {ca.relevanceToScope}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Collapsible raw text */}
      <div className="mt-8 border-t border-border pt-6">
        <button
          onClick={() => setTextExpanded(!textExpanded)}
          className="flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wider text-muted hover:text-brand"
        >
          Extracted Document Text
          <svg
            className={`h-4 w-4 transition-transform ${textExpanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {textExpanded && (
          <div className="mt-3 max-h-[28rem] overflow-y-auto rounded-md border border-border bg-white p-4">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-body">
              {document.text}
            </pre>
          </div>
        )}
      </div>
    </StepLayout>
  );
}
