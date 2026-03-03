"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STEPS = [
  { label: "Upload RFP", href: "/upload" },
  { label: "Review Scope", href: "/review" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Strategy", href: "/strategy" },
  { label: "Generate", href: "/generate" },
  { label: "Report", href: "/report" },
] as const;

export default function Stepper() {
  const pathname = usePathname();
  const currentIndex = STEPS.findIndex((s) => s.href === pathname);

  return (
    <nav className="border-b border-border bg-white">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <ol className="flex items-center gap-2">
          {STEPS.map((step, i) => {
            const isCompleted = currentIndex > i;
            const isCurrent = currentIndex === i;
            const isClickable = isCompleted;

            const content = (
              <span className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                    isCurrent
                      ? "border-brand bg-brand text-white"
                      : isCompleted
                        ? "border-teal bg-teal text-white"
                        : "border-border bg-white text-muted"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={`hidden text-sm font-medium sm:inline ${
                    isCurrent
                      ? "text-brand"
                      : isCompleted
                        ? "text-teal"
                        : "text-muted"
                  }`}
                >
                  {step.label}
                </span>
              </span>
            );

            return (
              <li key={step.href} className="flex items-center gap-2">
                {i > 0 && (
                  <div
                    className={`h-0.5 w-6 sm:w-10 ${
                      isCompleted || isCurrent ? "bg-brand" : "bg-border"
                    }`}
                  />
                )}
                {isClickable ? (
                  <Link href={step.href} className="transition-opacity hover:opacity-80">
                    {content}
                  </Link>
                ) : (
                  <span className={!isCurrent ? "opacity-60" : ""}>{content}</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
