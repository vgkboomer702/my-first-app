"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import {
  useBrief,
  type CapabilityAssessment,
  type CapabilityStatus,
} from "@/components/BriefContext";

const STATUS_OPTIONS: {
  value: CapabilityStatus;
  label: string;
  colorClasses: string;
  hoverClasses: string;
}[] = [
  {
    value: "strong-current",
    label: "Strong + Current",
    colorClasses: "bg-green-100 text-green-700 border-green-300",
    hoverClasses: "hover:bg-green-50 hover:border-green-200",
  },
  {
    value: "strong-stale",
    label: "Strong + Stale",
    colorClasses: "bg-amber-100 text-amber-700 border-amber-300",
    hoverClasses: "hover:bg-amber-50 hover:border-amber-200",
  },
  {
    value: "weak",
    label: "Weak",
    colorClasses: "bg-orange-100 text-orange-700 border-orange-300",
    hoverClasses: "hover:bg-orange-50 hover:border-orange-200",
  },
  {
    value: "gap",
    label: "Gap",
    colorClasses: "bg-red-100 text-red-700 border-red-300",
    hoverClasses: "hover:bg-red-50 hover:border-red-200",
  },
];

function CapabilityCard({
  assessment,
  scopeArea,
  onUpdate,
}: {
  assessment: CapabilityAssessment;
  scopeArea?: { area: string; description: string; relevanceToScope: string };
  onUpdate: (
    areaId: string,
    field: keyof CapabilityAssessment,
    value: string | CapabilityStatus | null
  ) => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-brand">{assessment.area}</h3>
        {scopeArea && (
          <p className="mt-1 text-xs text-muted">{scopeArea.description}</p>
        )}
        {scopeArea?.relevanceToScope && (
          <p className="mt-1 text-xs text-muted">
            <span className="font-medium">Relevance:</span>{" "}
            {scopeArea.relevanceToScope}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">
          Current Capability Status
        </label>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => {
            const isSelected = assessment.status === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  onUpdate(
                    assessment.areaId,
                    "status",
                    isSelected ? null : opt.value
                  )
                }
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isSelected
                    ? opt.colorClasses
                    : `border-border bg-white text-muted ${opt.hoverClasses}`
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-3">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
          Capability Description
        </label>
        <textarea
          value={assessment.description}
          onChange={(e) =>
            onUpdate(assessment.areaId, "description", e.target.value)
          }
          placeholder="Describe your current approach, tools, or experience in this area..."
          rows={2}
          className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-body placeholder:text-muted/50 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
          Partnerships / Vendors
        </label>
        <textarea
          value={assessment.partnerships}
          onChange={(e) =>
            onUpdate(assessment.areaId, "partnerships", e.target.value)
          }
          placeholder="List any existing partners, vendors, or tools you use..."
          rows={2}
          className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-body placeholder:text-muted/50 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>
    </div>
  );
}

export default function CapabilitiesPage() {
  const { scopeAnalysis, capabilities, setCapabilities } = useBrief();
  const router = useRouter();
  const [assessments, setAssessments] = useState<CapabilityAssessment[]>([]);

  useEffect(() => {
    if (!scopeAnalysis?.capabilityAreas?.length) return;

    if (capabilities.length > 0) {
      setAssessments(capabilities);
      return;
    }

    const initial: CapabilityAssessment[] =
      scopeAnalysis.capabilityAreas.map((ca, i) => ({
        areaId: `area-${i}`,
        area: ca.area,
        status: null,
        description: "",
        partnerships: "",
      }));
    setAssessments(initial);
  }, [scopeAnalysis, capabilities]);

  const updateAssessment = useCallback(
    (
      areaId: string,
      field: keyof CapabilityAssessment,
      value: string | CapabilityStatus | null
    ) => {
      setAssessments((prev) =>
        prev.map((a) => (a.areaId === areaId ? { ...a, [field]: value } : a))
      );
    },
    []
  );

  const assessedCount = assessments.filter((a) => a.status !== null).length;
  const totalCount = assessments.length;
  const allAssessed = totalCount > 0 && assessedCount === totalCount;

  const handleContinue = useCallback(() => {
    setCapabilities(assessments);
    router.push("/strategy");
  }, [assessments, setCapabilities, router]);

  if (!scopeAnalysis?.capabilityAreas?.length) {
    return (
      <StepLayout
        title="Capability Assessment"
        subtitle="Map your organization's capabilities against the RFP requirements."
        backHref="/review"
        nextLabel="Continue"
        nextHref="/strategy"
        nextDisabled
      >
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-light">
            <svg
              className="h-7 w-7 text-brand"
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
          <p className="text-sm font-medium text-muted">
            No capability areas available
          </p>
          <p className="mt-1 text-xs text-muted">
            Upload and review an RFP document first.
          </p>
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
      title="Capability Assessment"
      subtitle="Map your organization's capabilities against the RFP requirements."
      backHref="/review"
      nextLabel="Continue"
      nextDisabled={!allAssessed}
      onNext={handleContinue}
    >
      <div className="mb-6 flex items-center justify-between rounded-md border border-border bg-subtle px-4 py-3">
        <span className="text-sm font-medium text-body">
          {assessedCount} of {totalCount} areas assessed
        </span>
        <div className="flex items-center gap-2">
          <div className="h-2 w-32 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{
                width: `${totalCount > 0 ? (assessedCount / totalCount) * 100 : 0}%`,
              }}
            />
          </div>
          <span className="text-xs font-medium text-muted">
            {totalCount > 0
              ? Math.round((assessedCount / totalCount) * 100)
              : 0}
            %
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment) => (
          <CapabilityCard
            key={assessment.areaId}
            assessment={assessment}
            scopeArea={scopeAnalysis.capabilityAreas.find(
              (ca) => ca.area === assessment.area
            )}
            onUpdate={updateAssessment}
          />
        ))}
      </div>
    </StepLayout>
  );
}
