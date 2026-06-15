// src/types/events.ts - 随机事件类型

import { ResourceEffects } from './game';

export type EventTriggerCondition = 
  | { type: 'resource_threshold'; resource: string; threshold: number; operator: 'gt' | 'lt' | 'eq' }
  | { type: 'sprint_range'; min: number; max: number }
  | { type: 'probability'; chance: number };

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
  condition?: EventTriggerCondition;
}

export interface EventChoice {
  id: string;
  label: string;
  description: string;
  effects: ResourceEffects;
  followUp?: string;
}

export interface EventTemplate {
  id: string;
  title: string;
  description: string;
  weight: number;
  minSprint: number;
  condition?: EventTriggerCondition;
  choices: EventChoice[];
}