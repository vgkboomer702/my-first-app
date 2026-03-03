"use client";

import { useRouter } from "next/navigation";
import Stepper from "./Stepper";

interface StepLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  backHref?: string;
  nextLabel?: string;
  nextHref?: string;
  nextDisabled?: boolean;
  onNext?: () => void;
}

export default function StepLayout({
  children,
  title,
  subtitle,
  backHref,
  nextLabel = "Continue",
  nextHref,
  nextDisabled = false,
  onNext,
}: StepLayoutProps) {
  const router = useRouter();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (nextHref) {
      router.push(nextHref);
    }
  };

  return (
    <>
      <Stepper />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-body">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>

        <div className="rounded-lg border border-border bg-white p-6 shadow-sm">
          {children}
        </div>

        <div className="mt-6 flex items-center justify-between">
          {backHref ? (
            <button
              onClick={() => router.push(backHref)}
              className="rounded-md border border-border bg-white px-5 py-2.5 text-sm font-medium text-body transition-colors hover:bg-subtle"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {nextHref || onNext ? (
            <button
              onClick={handleNext}
              disabled={nextDisabled}
              className="rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {nextLabel}
            </button>
          ) : null}
        </div>
      </main>
    </>
  );
}
