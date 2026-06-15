// src/engine/sprint.ts - Sprint 循环引擎
import { GameState, SprintRecord, Action, GameEvent } from '@/types/game';
import { generateErrorLogs, checkP0Incident } from './errorLogEngine';
import { calculateResourceChanges, applyResourceChanges } from './resources';
import { generateRequirements } from './requirementEngine';
import { triggerRandomEvents } from './eventEngine';
import { checkEnding } from './endingEngine';


export function createInitialState(): GameState {
  return {
    sprint: 1,
    phase: 'sprint_start',
    resources: {
      compute: 1000,
      techDebt: 20,
      nps: 50,
      morale: 70,
    },
    errorLogs: [],
    dataSources: [
      {
        id: 'users',
        name: '用户中心',
        fields: [
          { id: 'u1', name: 'user_id', type: 'INT', semantic: '用户唯一标识', sample: '10042' },
          { id: 'u2', name: 'username', type: 'STRING', semantic: '用户名', sample: 'alice_dev' },
          { id: 'u3', name: 'created_at', type: 'TIMESTAMP', semantic: '注册时间', sample: '2024-01-15T09:30:00Z' },
        ],
        reliability: 95,
        integrationStatus: 'connected',
      },
    ],
    requirements: [],
    team: [
      {
        id: 'emp-1',
        name: '你 (CTO)',
        role: 'principal',
        skills: ['架构设计', 'LLM', '系统设计'],
        salary: 0,
        trait: '全栈',
      },
    ],
    techStack: {
      primary: 'langchain',
      addons: [],
    },
    history: [],
    config: {
      maxSprints: 36,
      hoursPerSprint: 10,
      difficulty: 'normal',
    },
    events: [],
    achievements: [],
  };
}

export function sprintStartEngine(state: GameState): GameState {
  // 1. 生成新错误日志
  const newLogs = generateErrorLogs(state);

  // 2. 年龄增长
  const agedLogs = state.errorLogs.map((l) => ({ ...l, age: l.age + 1 }));

  // 3. 检查新需求
  const newRequirements = generateRequirements(state);

  // 4. 创建新的 SprintRecord
  const newRecord: SprintRecord = {
    sprint: state.sprint,
    startResources: { ...state.resources },
    endResources: { ...state.resources },
    actions: [],
    events: [],
  };

  return {
    ...state,
    phase: 'player_turn',
    errorLogs: [...agedLogs, ...newLogs],
    requirements: [...state.requirements, ...newRequirements],
    history: [...state.history, newRecord],
  };
}

export function sprintEndEngine(state: GameState): GameState {
  // 1. 资源自动结算
  const changes = calculateResourceChanges(state);
  const newResources = applyResourceChanges(state.resources, changes);

  // 2. 检查未处理日志的惩罚
  const pendingLogs = state.errorLogs.filter((l) => l.status === 'pending');
  const techDebtFromLogs = pendingLogs.reduce((sum, l) => sum + l.age * 1.5, 0);

  // 3. P0 事故检查
  let p0Triggered = checkP0Incident(state);
  let p0Events: GameEvent[] = [];
  if (p0Triggered) {
    p0Events.push({
      id: 'p0-incident',
      title: '🚨 P0 事故！',
      description: '某模块的 ERROR 日志已连续 3 个 Sprint 未处理，系统出现严重故障！',
      choices: [
        {
          id: 'handle',
          label: '紧急处理 (消耗 3 工时)',
          description: '立即投入资源处理紧急故障',
          effects: { techDebt: -10, nps: -5, compute: -100 },
        },
      ],
    });
    newResources.nps -= 15;
    newResources.compute -= 200;
  }

  // 4. 更新资源（应用惩罚）
  const finalResources = {
    ...newResources,
    techDebt: Math.min(100, newResources.techDebt + techDebtFromLogs),
  };

  // 5. 更新当前 SprintRecord
  const updatedHistory = [...state.history];
  const currentRecord = updatedHistory[updatedHistory.length - 1];
  if (currentRecord) {
    currentRecord.endResources = { ...finalResources };
  }

  // 6. 检查结局
  const ending = checkEnding({ ...state, resources: finalResources });

  // 7. 随机事件
  const events = [...p0Events, ...triggerRandomEvents({ ...state, resources: finalResources })];

  return {
    ...state,
    sprint: state.sprint + 1,
    phase: ending ? 'game_over' : 'sprint_start',
    resources: finalResources,
    history: updatedHistory,
    events,
  };
}

export function addAction(state: GameState, action: Action): GameState {
  const updatedHistory = [...state.history];
  const currentRecord = updatedHistory[updatedHistory.length - 1];
  if (currentRecord) {
    currentRecord.actions = [...currentRecord.actions, action];
  }
  return {
    ...state,
    history: updatedHistory,
  };
}
