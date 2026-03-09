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

export type ConfidenceLevel = "verified" | "inferred" | "assumption";
export type MarketMaturity = "bleeding-edge" | "emerging" | "established";
export type IntegrationComplexity = "low" | "medium" | "high";

export interface CapabilityMapEntry {
  area: string;
  status: string;
  currentApproach: string;
  recommendation: string;
  reasoning: string;
  confidence: ConfidenceLevel;
}

export interface IntelligenceOption {
  title: string;
  description: string;
  whyItMatters: string;
  howItWorks: string;
  marketMaturity: MarketMaturity;
  realWorldExample: string;
  vendorsAndPartners: string;
  integrationComplexity: IntegrationComplexity;
  risks: string;
  dealAlignment: string;
  confidence: ConfidenceLevel;
  confidenceReasoning: string;
}

export interface IntelligenceCard {
  area: string;
  status: string;
  conventionalApproach: string;
  options: IntelligenceOption[];
}

export interface EfficiencyOpportunity {
  opportunity: string;
  description: string;
  estimatedImpact: string;
  confidence: ConfidenceLevel;
}

export interface PartnerEntry {
  partner: string;
  relevantArea: string;
  whatTheyOffer: string;
  whyTheyFit: string;
  confidence: ConfidenceLevel;
}

export interface StrategicWarning {
  warning: string;
  impact: string;
  suggestedAction: string;
}

export interface GeneratedReport {
  reportTitle: string;
  generatedDate: string;
  scopeSummary: string;
  capabilityMap: CapabilityMapEntry[];
  intelligenceCards: IntelligenceCard[];
  efficiencyOpportunities: EfficiencyOpportunity[];
  partnerLandscape: PartnerEntry[];
  strategicWarnings: StrategicWarning[];
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
  report: GeneratedReport | null;
  setReport: (r: GeneratedReport | null) => void;
  clearBrief: () => void;
}

const BriefContext = createContext<BriefContextValue | null>(null);

export function BriefProvider({ children }: { children: React.ReactNode }) {
  const [document, setDocument] = useState<ExtractedDocument | null>(null);
  const [scopeAnalysis, setScopeAnalysis] = useState<ScopeAnalysis | null>(null);
  const [capabilities, setCapabilities] = useState<CapabilityAssessment[]>([]);
  const [strategy, setStrategy] = useState<StrategyInput | null>(null);
  const [report, setReport] = useState<GeneratedReport | null>(null);

  const clearBrief = useCallback(() => {
    setDocument(null);
    setScopeAnalysis(null);
    setCapabilities([]);
    setStrategy(null);
    setReport(null);
  }, []);

  return (
    <BriefContext.Provider value={{ document, setDocument, scopeAnalysis, setScopeAnalysis, capabilities, setCapabilities, strategy, setStrategy, report, setReport, clearBrief }}>
      {children}
    </BriefContext.Provider>
  );
}

export function useBrief() {
  const ctx = useContext(BriefContext);
  if (!ctx) throw new Error("useBrief must be used within BriefProvider");
  return ctx;
}
