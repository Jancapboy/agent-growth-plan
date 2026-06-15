export interface Resources {
  treasury: number;  // 国库
  military: number;  // 兵力
  morale: number;    // 民心 (0-100)
  food: number;      // 粮食
}

export interface Official {
  id: string;
  name: string;
  ability: number;   // 能力值
  loyalty: number;   // 忠诚度
  trait: string;
}

export interface Decree {
  id: string;
  title: string;
  description: string;
  effects: Partial<Resources>;
  cost: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  choices: { label: string; effects: Partial<Resources> }[];
}

export interface GameState {
  turn: number;
  maxTurns: number;
  resources: Resources;
  officials: Official[];
  decrees: Decree[];
  events: Event[];
  phase: 'turn_start' | 'player_turn' | 'turn_end' | 'game_over';
  history: TurnRecord[];
}

export interface TurnRecord {
  turn: number;
  startResources: Resources;
  endResources: Resources;
  actions: string[];
}

export interface GameStore {
  state: GameState;
  startTurn: () => void;
  endTurn: () => void;
  issueDecree: (decreeId: string) => void;
  recruitOfficial: () => void;
  handleEvent: (eventId: string, choiceIndex: number) => void;
  newGame: () => void;
  getAvailableActions: () => number;
}

export const createInitialState = (): GameState => ({
  turn: 1,
  maxTurns: 20,
  resources: {
    treasury: 1000,
    military: 500,
    morale: 70,
    food: 800,
  },
  officials: [
    { id: 'off-1', name: '宰相', ability: 85, loyalty: 90, trait: '贤相' },
  ],
  decrees: [],
  events: [],
  phase: 'turn_start',
  history: [],
});
