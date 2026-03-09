"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Stepper from "@/components/Stepper";
import { useBrief, type GeneratedReport } from "@/components/BriefContext";

const STAGES = [
  { label: "Analyzing scope and requirements...", pct: 20 },
  { label: "Mapping capability gaps...", pct: 40 },
  { label: "Researching market solutions...", pct: 70 },
  { label: "Synthesizing intelligence brief...", pct: 90 },
  { label: "Finalizing report...", pct: 100 },
];

export default function GeneratePage() {
  const router = useRouter();
  const { document: doc, scopeAnalysis, capabilities, strategy, setReport } =
    useBrief();

  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const called = useRef(false);

  // Animate through stages
  useEffect(() => {
    if (done || error) return;
    const interval = setInterval(() => {
      setStageIdx((prev) => {
        const next = prev < STAGES.length - 1 ? prev + 1 : prev;
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [done, error]);

  // Smooth progress toward current stage target
  useEffect(() => {
    if (done) {
      setProgress(100);
      return;
    }
    const target = STAGES[stageIdx].pct;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= target) {
          clearInterval(interval);
          return target;
        }
        return prev + 1;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [stageIdx, done]);

  const generate = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scopeAnalysis,
          capabilities,
          strategy,
          documentText: doc?.text || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Report generation failed");
      setReport(data.report as GeneratedReport);
      setDone(true);
      setTimeout(() => router.push("/report"), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  }, [scopeAnalysis, capabilities, strategy, doc, setReport, router]);

  // Auto-trigger on mount
  useEffect(() => {
    if (called.current) return;
    if (!scopeAnalysis) {
      router.push("/");
      return;
    }
    called.current = true;
    generate();
  }, [scopeAnalysis, router, generate]);

  return (
    <>
      <Stepper />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-white p-16 shadow-sm">
          {!error ? (
            <>
              <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-brand-light border-t-brand" />
              <h1 className="text-xl font-bold text-body">
                Generating your intelligence brief...
              </h1>
              <p className="mt-2 text-sm font-medium text-brand">
                {STAGES[stageIdx].label}
              </p>
              <p className="mt-1 text-xs text-muted">
                This may take 30-60 seconds for large documents.
              </p>
              <div className="mt-8 w-full max-w-md">
                <div className="mb-2 flex items-center justify-between text-xs text-muted">
                  <span>Processing</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-brand-light">
                  <div
                    className="h-full rounded-full bg-brand transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-7 w-7 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-body">
                Generation Failed
              </h1>
              <p className="mt-2 max-w-md text-center text-sm text-red-600">
                {error}
              </p>
              <button
                onClick={() => {
                  called.current = false;
                  setProgress(0);
                  setStageIdx(0);
                  setDone(false);
                  generate();
                  called.current = true;
                }}
                className="mt-6 rounded-md bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
              >
                Retry Generation
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
