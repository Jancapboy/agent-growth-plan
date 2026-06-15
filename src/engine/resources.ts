// src/engine/resources.ts - 资源结算公式

import { GameState, Resources } from '@/types/game';

export interface ResourceChanges {
  compute: number;
  techDebt: number;
  nps: number;
  morale: number;
}

export function calculateResourceChanges(state: GameState): ResourceChanges {
  const { resources, team } = state;

  // 算力收入: 简化模型 - NPS 映射到用户量，再算收入
  const activeUsers = resources.nps * 100;
  const revenue = activeUsers * 0.01;
  // 基础设施成本: 团队人数 × 50 + 数据源数 × 30
  const infraCost = team.length * 50 + state.dataSources.length * 30;
  // 技术债务基础增长
  const techDebtBase = 2;
  // NPS 自然衰减
  const npsDelta = -1;
  // 士气: 基于技术债务
  const moraleFromDebt = resources.techDebt > 50 ? -2 : 0;
  // 未处理错误日志的惩罚
  const pendingLogs = state.errorLogs.filter(l => l.status === 'pending');
  const npsFromLogs = pendingLogs.reduce((sum, l) => {
    const weight = l.level === 'CRITICAL' ? 3 : l.level === 'ERROR' ? 2 : 1;
    return sum - weight;
  }, 0);

  return {
    compute: revenue - infraCost,
    techDebt: techDebtBase,
    nps: npsDelta + npsFromLogs,
    morale: moraleFromDebt,
  };
}

export function applyResourceChanges(
  resources: Resources,
  changes: ResourceChanges
): Resources {
  return {
    compute: Math.max(0, resources.compute + changes.compute),
    techDebt: Math.max(0, Math.min(100, resources.techDebt + changes.techDebt)),
    nps: Math.max(0, Math.min(100, resources.nps + changes.nps)),
    morale: Math.max(0, Math.min(100, resources.morale + changes.morale)),
  };
}
