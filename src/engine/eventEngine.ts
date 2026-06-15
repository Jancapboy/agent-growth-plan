// src/engine/eventEngine.ts - 随机事件引擎

import { GameState, GameEvent } from '@/types/game';
import { eventTemplates } from '@/data/events';
import { random } from '@/utils/random';

export function triggerRandomEvents(state: GameState): GameEvent[] {
  const events: GameEvent[] = [];
  const count = random.int(0, 2); // 0-2 个随机事件

  for (let i = 0; i < count; i++) {
    const template = random.weightedPick(eventTemplates);
    if (!template) continue;
    if (template.minSprint > state.sprint) continue;

    // 检查触发条件
    if (template.condition) {
      if (!checkCondition(state, template.condition)) continue;
    }

    events.push({
      id: `${template.id}-${state.sprint}-${i}`,
      title: template.title,
      description: template.description,
      choices: template.choices,
    });
  }

  return events;
}

function checkCondition(
  state: GameState,
  condition: { type: string; resource?: string; threshold?: number; operator?: string; min?: number; max?: number; chance?: number }
): boolean {
  switch (condition.type) {
    case 'resource_threshold': {
      if (!condition.resource || condition.threshold === undefined) return true;
      const value = state.resources[condition.resource as keyof typeof state.resources] as number;
      switch (condition.operator) {
        case 'gt': return value > condition.threshold;
        case 'lt': return value < condition.threshold;
        case 'eq': return value === condition.threshold;
        default: return true;
      }
    }
    case 'sprint_range': {
      return state.sprint >= (condition.min || 0) && state.sprint <= (condition.max || Infinity);
    }
    case 'probability': {
      return random.chance(condition.chance || 0.5);
    }
    default:
      return true;
  }
}
