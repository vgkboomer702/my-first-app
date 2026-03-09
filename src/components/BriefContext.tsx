"use client";

import { createContext, useContext, useState, useCallback } from "react";

export interface ExtractedDocument {
  text: string;
  filename: string;
  fileType: string;
  pageCount?: number;
}

export interface ScopeRequirement {
  id: string;
  category: string;
  description: string;
  priority: "must-have" | "should-have" | "nice-to-have";
}

export interface EvaluationCriterion {
  criterion: string;
  weight: string;
  notes: string;
}

export interface Constraint {
  type: string;
  description: string;
}

export interface ClientPriority {
  priority: string;
  evidence: string;
}

export interface CapabilityArea {
  area: string;
  description: string;
  relevanceToScope: string;
}

export type CapabilityStatus = "strong-current" | "strong-stale" | "weak" | "gap";

export interface CapabilityAssessment {
  areaId: string;
  area: string;
  status: CapabilityStatus | null;
  description: string;
  partnerships: string;
}

export interface StrategyInput {
  winThemes: string;
  differentiators: string;
  positioning: string;
  competitors: string;
  additionalContext: string;
}

export interface ScopeAnalysis {
  requirements: ScopeRequirement[];
  evaluationCriteria: EvaluationCriterion[];
  constraints: Constraint[];
  clientPriorities: ClientPriority[];
  capabilityAreas: CapabilityArea[];
  scopeSummary: string;
}

interface BriefContextValue {
  document: ExtractedDocument | null;
  setDocument: (doc: ExtractedDocument | null) => void;
  scopeAnalysis: ScopeAnalysis | null;
  setScopeAnalysis: (scope: ScopeAnalysis | null) => void;
  capabilities: CapabilityAssessment[];
  setCapabilities: (caps: CapabilityAssessment[]) => void;
  strategy: StrategyInput | null;
  setStrategy: (s: StrategyInput | null) => void;
  clearBrief: () => void;
}

const BriefContext = createContext<BriefContextValue | null>(null);

export function BriefProvider({ children }: { children: React.ReactNode }) {
  const [document, setDocument] = useState<ExtractedDocument | null>(null);
  const [scopeAnalysis, setScopeAnalysis] = useState<ScopeAnalysis | null>(null);
  const [capabilities, setCapabilities] = useState<CapabilityAssessment[]>([]);
  const [strategy, setStrategy] = useState<StrategyInput | null>(null);

  const clearBrief = useCallback(() => {
    setDocument(null);
    setScopeAnalysis(null);
    setCapabilities([]);
    setStrategy(null);
  }, []);

  return (
    <BriefContext.Provider value={{ document, setDocument, scopeAnalysis, setScopeAnalysis, capabilities, setCapabilities, strategy, setStrategy, clearBrief }}>
      {children}
    </BriefContext.Provider>
  );
}

export function useBrief() {
  const ctx = useContext(BriefContext);
  if (!ctx) throw new Error("useBrief must be used within BriefProvider");
  return ctx;
}
