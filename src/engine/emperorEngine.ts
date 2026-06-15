// src/engine/emperorEngine.ts
import { GameState, Resources, Decree, Event, Official } from '@/types/emperor';
import { random } from '@/utils/random';

export function createInitialState(): GameState {
  return {
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
  };
}

export const decreeTemplates: Decree[] = [
  {
    id: 'tax',
    title: '📜 加征税赋',
    description: '增加税收，充实国库，但民心下降',
    effects: { treasury: 150, morale: -10 },
    cost: 1,
  },
  {
    id: 'relief',
    title: '📜 开仓赈灾',
    description: '发放粮食救济百姓，民心提升',
    effects: { food: -100, morale: 15 },
    cost: 1,
  },
  {
    id: 'train',
    title: '📜 练兵强军',
    description: '训练军队，提升兵力',
    effects: { military: 80, treasury: -50 },
    cost: 1,
  },
  {
    id: 'build',
    title: '📜 兴修水利',
    description: '建设基础设施，粮食产量提升',
    effects: { food: 120, treasury: -80 },
    cost: 1,
  },
  {
    id: 'banquet',
    title: '📜 举办宴会',
    description: '宴请群臣，提升官员忠诚度',
    effects: { treasury: -100, morale: 5 },
    cost: 1,
  },
];

export const eventTemplates: Event[] = [
  {
    id: 'famine',
    title: '🌾 饥荒',
    description: '某地发生饥荒，百姓流离失所',
    choices: [
      { label: '开仓赈灾 (-200粮食, +20民心)', effects: { food: -200, morale: 20 } },
      { label: '置之不理 (-30民心)', effects: { morale: -30 } },
    ],
  },
  {
    id: 'invasion',
    title: '⚔️ 边境告急',
    description: '外敌入侵，需要立即应对',
    choices: [
      { label: '出兵迎击 (-100兵力, -50国库)', effects: { military: -100, treasury: -50 } },
      { label: '求和赔款 (-300国库)', effects: { treasury: -300 } },
    ],
  },
  {
    id: 'rebellion',
    title: '🔥 民变',
    description: '民心过低，某地发生叛乱',
    choices: [
      { label: '派兵镇压 (-150兵力)', effects: { military: -150 } },
      { label: '安抚民心 (-100国库, +10民心)', effects: { treasury: -100, morale: 10 } },
    ],
  },
  {
    id: 'merchant',
    title: '💰 商人献礼',
    description: '富商希望捐赠，但请求特权',
    choices: [
      { label: '接受 (+200国库)', effects: { treasury: 200 } },
      { label: '拒绝 (+10民心)', effects: { morale: 10 } },
    ],
  },
  {
    id: 'general',
    title: '⭐ 名将投奔',
    description: '一位名将前来投奔',
    choices: [
      { label: '接纳 (+100兵力)', effects: { military: 100 } },
      { label: '考验 (-20国库, +50兵力)', effects: { treasury: -20, military: 50 } },
    ],
  },
];

export const officialNames = ['李斯', '萧何', '张良', '诸葛亮', '魏征', '房玄龄', '杜如晦', '寇准', '于谦', '张居正'];

export function generateDecrees(): Decree[] {
  return decreeTemplates.map(d => ({ ...d, id: `${d.id}-${Date.now()}-${random.int(0, 1000)}` }));
}

export function generateEvents(): Event[] {
  if (random.chance(0.6)) {
    const template = random.pick(eventTemplates);
    return [{ ...template, id: `${template.id}-${Date.now()}` }];
  }
  return [];
}

export function recruitOfficial(): Official {
  return {
    id: `off-${Date.now()}`,
    name: random.pick(officialNames),
    ability: random.int(60, 100),
    loyalty: random.int(50, 100),
    trait: random.pick(['贤臣', '猛将', '谋士', '清官', '奸臣']),
  };
}

export function calculateEndOfTurn(state: GameState): Resources {
  const { resources } = state;
  
  // 基础消耗
  const foodConsumption = 50 + state.officials.length * 5;
  const treasuryIncome = Math.floor(resources.morale * 2);
  
  return {
    treasury: resources.treasury + treasuryIncome - 30,
    military: resources.military - 5,
    morale: Math.max(0, Math.min(100, resources.morale - 2)),
    food: resources.food - foodConsumption,
  };
}

export function checkEnding(state: GameState): 'victory' | 'defeat' | null {
  if (state.turn >= state.maxTurns) {
    return state.resources.morale >= 60 && state.resources.treasury >= 500 ? 'victory' : 'defeat';
  }
  if (state.resources.morale <= 0) return 'defeat';
  if (state.resources.food <= 0) return 'defeat';
  if (state.resources.treasury <= -500) return 'defeat';
  return null;
}

export function getEndingText(ending: 'victory' | 'defeat'): string {
  if (ending === 'victory') return '🏆 千古一帝 - 你在位期间国泰民安，名垂青史！';
  return '💀 王朝覆灭 - 国家在你的统治下走向衰败...';
}
