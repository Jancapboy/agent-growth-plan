// src/engine/requirementEngine.ts - 需求公式化引擎

import { GameState } from '@/types/game';
import { Requirement, RequirementStatus } from '@/types/requirement';
import { requirementTemplates } from '@/data/requirements';
import { random } from '@/utils/random';

export function generateRequirements(state: GameState): Requirement[] {
  const count = random.chance(0.7) ? 1 : 0; // 70% 概率生成新需求
  const requirements: Requirement[] = [];

  for (let i = 0; i < count; i++) {
    const template = random.weightedPick(requirementTemplates);
    if (template.minSprint > state.sprint) continue;

    requirements.push({
      id: `req-${state.sprint}-${i}-${Date.now()}`,
      title: template.title,
      description: template.description,
      urgency: template.urgency,
      status: 'backlog',
      formulaization: {
        steps: template.steps.map((s, idx) => ({
          id: `step-${idx}`,
          name: s.name,
          description: s.description,
          cost: 1,
          options: s.options,
          completed: false,
        })),
        currentStepIndex: 0,
        quality: 0,
      },
    });
  }

  return requirements;
}

export function advanceFormulaization(
  state: GameState,
  reqId: string,
  optionId: string
): GameState {
  const req = state.requirements.find((r) => r.id === reqId);
  if (!req) return state;
  
  // Handle starting formulaization from backlog
  if (req.status === 'backlog' && optionId === 'start') {
    const updatedRequirements = state.requirements.map((r) =>
      r.id === reqId
        ? { ...r, status: 'formulaizing' as RequirementStatus }
        : r
    );
    return {
      ...state,
      requirements: updatedRequirements,
    };
  }
  
  if (req.status !== 'formulaizing') return state;

  const progress = req.formulaization;
  const currentStep = progress.steps[progress.currentStepIndex];
  if (!currentStep || currentStep.completed) return state;

  const option = currentStep.options.find((o) => o.id === optionId);
  if (!option) return state;

  // 更新步骤
  const updatedSteps = progress.steps.map((s, idx) =>
    idx === progress.currentStepIndex
      ? { ...s, completed: true, selectedOptionId: optionId }
      : s
  );

  const newQuality = Math.min(100, progress.quality + option.qualityContribution);
  const newStepIndex = progress.currentStepIndex + 1;
  const allCompleted = newStepIndex >= progress.steps.length;

  const updatedRequirements = state.requirements.map((r) =>
    r.id === reqId
      ? {
          ...r,
          status: allCompleted ? ('ready' as RequirementStatus) : ('formulaizing' as RequirementStatus),
          formulaization: {
            ...progress,
            steps: updatedSteps,
            currentStepIndex: newStepIndex,
            quality: newQuality,
          },
        }
      : r
  );

  return {
    ...state,
    requirements: updatedRequirements,
    resources: {
      ...state.resources,
      techDebt: Math.max(0, Math.min(100, state.resources.techDebt + option.techDebtDelta)),
    },
  };
}
