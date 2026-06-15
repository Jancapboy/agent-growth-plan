// src/engine/errorLogEngine.ts - 错误日志处理引擎

import { GameState, Employee } from '@/types/game';
import {
  ErrorLog,
  ErrorResolution,
  ResolutionStrategy,
  ErrorLevel,
} from '@/types/errorLog';
import { errorLogTemplates } from '@/data/errorLogs';
import { random } from '@/utils/random';

function getLevelWeight(level: ErrorLevel): number {
  const weights: Record<ErrorLevel, number> = {
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    CRITICAL: 5,
  };
  return weights[level];
}

export function generateErrorLogs(state: GameState): ErrorLog[] {
  const techDebtFactor = Math.floor(state.resources.techDebt / 20);
  const count = random.int(2 + techDebtFactor, 4 + techDebtFactor);
  const logs: ErrorLog[] = [];

  for (let i = 0; i < count; i++) {
    const template = random.weightedPick(errorLogTemplates);
    if (template.minSprint > state.sprint) continue;

    const message = random.pick(template.messages);
    logs.push({
      id: `log-${state.sprint}-${i}-${Date.now()}`,
      level: template.level,
      source: template.source,
      message,
      age: 0,
      status: 'pending',
    });
  }

  return logs;
}

export function calculateResolution(
  log: ErrorLog,
  strategy: ResolutionStrategy,
  team: Employee[]
): ErrorResolution {
  const base: Record<ResolutionStrategy, Omit<ErrorResolution, 'strategy' | 'resolvedAt'>> = {
    quickFix: { cost: 1, techDebtDelta: 2, npsDelta: 0 },
    properFix: { cost: 2, techDebtDelta: -5, npsDelta: 2 },
    ignore: { cost: 0, techDebtDelta: log.age * 2, npsDelta: -getLevelWeight(log.level) * 3 },
    delegate: { cost: 0, techDebtDelta: -3, npsDelta: 1 },
  };

  const result = { ...base[strategy] };

  // 特质加成: 代码洁癖员工使 properFix 额外 -2 TechDebt
  const hasCleanFreak = team.some((e) => e.trait === 'clean_freak');
  if (hasCleanFreak && strategy === 'properFix') {
    result.techDebtDelta -= 2;
  }

  // 特质加成: 资深开发者使 delegate 效果更好
  const hasSenior = team.some((e) => e.role === 'senior' || e.role === 'staff');
  if (hasSenior && strategy === 'delegate') {
    result.techDebtDelta -= 2;
    result.npsDelta += 1;
  }

  return {
    ...result,
    strategy,
    resolvedAt: 0,
  };
}

export function resolveErrorLog(
  state: GameState,
  logId: string,
  strategy: ResolutionStrategy
): GameState {
  const log = state.errorLogs.find((l) => l.id === logId);
  if (!log || log.status !== 'pending') return state;

  const resolution = calculateResolution(log, strategy, state.team);
  const availableHours = getAvailableHours(state);

  if (resolution.cost > availableHours) {
    return state; // 工时不足
  }

  const updatedLogs = state.errorLogs.map((l) =>
    l.id === logId
      ? { ...l, status: 'resolved' as const, resolution: { ...resolution, resolvedAt: state.sprint } }
      : l
  );

  const updatedResources = {
    ...state.resources,
    techDebt: Math.max(0, Math.min(100, state.resources.techDebt + resolution.techDebtDelta)),
    nps: Math.max(0, Math.min(100, state.resources.nps + resolution.npsDelta)),
    compute: state.resources.compute - resolution.cost * 10, // 工时消耗算力
  };

  return {
    ...state,
    errorLogs: updatedLogs,
    resources: updatedResources,
  };
}

export function getAvailableHours(state: GameState): number {
  const currentRecord = state.history[state.sprint - 1];
  if (!currentRecord) return state.config.hoursPerSprint;
  const used = currentRecord.actions.reduce((sum, a) => sum + a.cost, 0);
  return state.config.hoursPerSprint - used;
}

export function checkP0Incident(state: GameState): boolean {
  // 检查是否有模块连续 3 Sprint 出现 ERROR+ 未处理
  const criticalPending = state.errorLogs.filter(
    (l) => (l.level === 'ERROR' || l.level === 'CRITICAL') && l.status === 'pending' && l.age >= 3
  );
  return criticalPending.length > 0;
}
