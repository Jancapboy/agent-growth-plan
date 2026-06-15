// src/types/requirement.ts - 需求公式化系统类型

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type RequirementStatus =
  | 'backlog'
  | 'formulaizing'
  | 'ready'
  | 'developing'
  | 'done';

export interface Requirement {
  id: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  status: RequirementStatus;
  formulaization: FormulaizationProgress;
  implementation?: Implementation;
}

export interface FormulaizationProgress {
  steps: FormulaStep[];
  currentStepIndex: number;
  quality: number;
}

export interface FormulaStep {
  id: string;
  name: string;
  description: string;
  cost: number;
  options: StepOption[];
  completed: boolean;
  selectedOptionId?: string;
}

export interface StepOption {
  id: string;
  label: string;
  description: string;
  qualityContribution: number;
  costMultiplier: number;
  techDebtDelta: number;
}

export interface Implementation {
  quality: number;
  cost: number;
  completedAt: number;
}

export interface RequirementTemplate {
  id: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  minSprint: number;
  weight: number;
  steps: FormulaStepTemplate[];
}

export interface FormulaStepTemplate {
  name: string;
  description: string;
  options: StepOption[];
}