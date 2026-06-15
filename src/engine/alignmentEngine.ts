// src/engine/alignmentEngine.ts - 字段对齐引擎

import { GameState } from '@/types/game';
import { DataSource, Field, AlignmentConflict } from '@/types/dataSource';
import { dataSourceTemplates } from '@/data/dataSources';
import { random } from '@/utils/random';

export function generateNewDataSource(state: GameState): DataSource | null {
  // 每 3-5 Sprint 可能新增一个数据源
  if (!random.chance(0.3)) return null;
  
  const availableSources = dataSourceTemplates.filter(
    t => !state.dataSources.some(ds => ds.id === t.id)
  );
  if (availableSources.length === 0) return null;
  
  const template = random.pick(availableSources);
  return {
    ...template,
    integrationStatus: 'unconnected',
  };
}

export function detectAlignmentConflicts(state: GameState): AlignmentConflict[] {
  const conflicts: AlignmentConflict[] = [];
  const connectedSources = state.dataSources.filter(ds => ds.integrationStatus !== 'unconnected');
  
  // 检查所有数据源对之间的字段语义匹配
  for (let i = 0; i < connectedSources.length; i++) {
    for (let j = i + 1; j < connectedSources.length; j++) {
      const sourceA = connectedSources[i];
      const sourceB = connectedSources[j];
      
      for (const fieldA of sourceA.fields) {
        for (const fieldB of sourceB.fields) {
          const matchScore = calculateSemanticMatch(fieldA, fieldB);
          if (matchScore > 60) {
            conflicts.push({
              id: `conflict-${sourceA.id}-${fieldA.id}-${sourceB.id}-${fieldB.id}`,
              fieldA: { ...fieldA, sourceId: sourceA.id, sourceName: sourceA.name },
              fieldB: { ...fieldB, sourceId: sourceB.id, sourceName: sourceB.name },
              semanticMatch: matchScore,
              status: 'pending',
            });
          }
        }
      }
    }
  }
  
  return conflicts;
}

function calculateSemanticMatch(fieldA: Field, fieldB: Field): number {
  // 简化：基于语义关键词匹配
  const semanticA = fieldA.semantic.toLowerCase();
  const semanticB = fieldB.semantic.toLowerCase();
  
  // 完全相同
  if (semanticA === semanticB) return 100;
  
  // 包含关系
  if (semanticA.includes(semanticB) || semanticB.includes(semanticA)) return 85;
  
  // 关键词重叠
  const wordsA = semanticA.split(/[\s,，、]+/);
  const wordsB = semanticB.split(/[\s,，、]+/);
  const overlap = wordsA.filter(w => wordsB.includes(w)).length;
  const total = new Set([...wordsA, ...wordsB]).size;
  
  return Math.round((overlap / total) * 100);
}

export function connectDataSource(state: GameState, sourceId: string): GameState {
  return {
    ...state,
    dataSources: state.dataSources.map(ds =>
      ds.id === sourceId ? { ...ds, integrationStatus: 'connected' as const } : ds
    ),
  };
}

export function calculateAlignmentPenalty(state: GameState): { nps: number; compute: number } {
  // 未对齐字段的惩罚
  const pendingAlignments = detectAlignmentConflicts(state).filter(c => c.status === 'pending');
  return {
    nps: -pendingAlignments.length * 0.5,
    compute: -pendingAlignments.length * 10,
  };
}
