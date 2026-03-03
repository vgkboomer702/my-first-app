"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Stepper from "@/components/Stepper";

export default function GeneratePage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Stepper />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-white p-16 shadow-sm">
          <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-brand-light border-t-brand" />
          <h1 className="text-xl font-bold text-body">
            Generating your intelligence brief...
          </h1>
          <p className="mt-2 text-sm text-muted">
            Analyzing document, assessing capabilities, and compiling strategy recommendations.
          </p>
          <div className="mt-8 w-full max-w-md">
            <div className="flex items-center justify-between text-xs text-muted mb-2">
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
          {progress >= 100 && (
            <button
              onClick={() => router.push("/report")}
              className="mt-8 rounded-md bg-brand px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              View Report
            </button>
          )}
        </div>
      </main>
    </>
  );
}
