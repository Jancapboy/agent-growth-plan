// src/types/game.ts - 核心游戏状态类型

export interface Resources {
  compute: number;
  techDebt: number;
  nps: number;
  morale: number;
}

export type GamePhase =
  | 'sprint_start'
  | 'player_turn'
  | 'sprint_end'
  | 'event'
  | 'game_over';

export interface Employee {
  id: string;
  name: string;
  role: 'junior' | 'mid' | 'senior' | 'staff' | 'principal';
  skills: string[];
  salary: number;
  trait: string;
}

export interface TechStackChoice {
  primary: string;
  addons: string[];
}

export interface Action {
  type: string;
  cost: number;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

export interface SprintRecord {
  sprint: number;
  startResources: Resources;
  endResources: Resources;
  actions: Action[];
  events: GameEvent[];
}

export interface GameConfig {
  maxSprints: number;
  hoursPerSprint: number;
  difficulty: 'easy' | 'normal' | 'hard';
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
}

export interface EventChoice {
  id: string;
  label: string;
  description: string;
  effects: ResourceEffects;
}

export interface ResourceEffects {
  compute?: number;
  techDebt?: number;
  nps?: number;
  morale?: number;
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  sprint: number;
  phase: GamePhase;
  resources: Resources;
  errorLogs: import('./errorLog').ErrorLog[];
  dataSources: import('./dataSource').DataSource[];
  requirements: import('./requirement').Requirement[];
  team: Employee[];
  techStack: TechStackChoice;
  history: SprintRecord[];
  config: GameConfig;
  events: GameEvent[];
  achievements: string[];
}
