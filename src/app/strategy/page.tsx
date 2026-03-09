"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import { useBrief, type StrategyInput } from "@/components/BriefContext";

const FIELDS: {
  key: keyof StrategyInput;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "winThemes",
    label: "Win Themes",
    placeholder:
      "What are the key themes you want to emphasize? e.g., 'Proven delivery at scale', 'Innovation in cloud migration', 'Cost efficiency through automation'",
  },
  {
    key: "differentiators",
    label: "Key Differentiators",
    placeholder:
      "What sets your company apart from competitors for this deal? e.g., 'Only vendor with FedRAMP High certification', 'Existing relationship with client's CTO'",
  },
  {
    key: "positioning",
    label: "Positioning Statement",
    placeholder:
      "How do you want to position your solution? e.g., 'Position as the safe, enterprise-grade choice' or 'Position as the innovative disruptor'",
  },
  {
    key: "competitors",
    label: "Known Competitors",
    placeholder:
      "List any known competitors on this deal and what you know about their approach...",
  },
  {
    key: "additionalContext",
    label: "Additional Context",
    placeholder:
      "Any other context that should shape the intelligence brief? e.g., budget constraints, timeline pressure, incumbent advantages...",
  },
];

const EMPTY_STRATEGY: StrategyInput = {
  winThemes: "",
  differentiators: "",
  positioning: "",
  competitors: "",
  additionalContext: "",
};

export default function StrategyPage() {
  const { strategy, setStrategy } = useBrief();
  const router = useRouter();
  const [form, setForm] = useState<StrategyInput>(EMPTY_STRATEGY);

  useEffect(() => {
    if (strategy) setForm(strategy);
  }, [strategy]);

  const update = useCallback((key: keyof StrategyInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleGenerate = useCallback(() => {
    setStrategy(form);
    router.push("/generate");
  }, [form, setStrategy, router]);

  return (
    <StepLayout
      title="Deal Strategy"
      subtitle="Define your win themes, competitive positioning, and deal strategy."
      backHref="/capabilities"
      nextLabel="Generate Brief"
      onNext={handleGenerate}
    >
      <div className="space-y-5">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
              {field.label}
            </label>
            <textarea
              value={form[field.key]}
              onChange={(e) => update(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-body placeholder:text-muted/50 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
        ))}
      </div>
    </StepLayout>
  );
}
