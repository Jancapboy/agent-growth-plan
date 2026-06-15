# DEV_SPEC - Agent Empire（智能体帝国）

> **文档状态**: Draft v0.1  
> **技术栈**: React 18 + Vite + TypeScript + Tailwind CSS + Zustand + Framer Motion  
> **测试**: Vitest  
> **构建目标**: 静态 SPA（GitHub Pages 部署）

---

## 1. 项目结构

```
agent-growth-plan/
├── public/
│   └── (静态资源)
├── src/
│   ├── main.tsx              # 入口
│   ├── App.tsx               # 根组件 + 路由
│   ├── index.css             # Tailwind + 全局样式
│   │
│   ├── types/                # 核心类型定义
│   │   ├── game.ts           # 游戏状态、资源、实体类型
│   │   ├── errorLog.ts       # 错误日志系统类型
│   │   ├── dataSource.ts     # 字段对齐系统类型
│   │   ├── requirement.ts    # 需求公式化系统类型
│   │   └── events.ts         # 随机事件类型
│   │
│   ├── data/                 # 游戏内容数据（JSON/TS）
│   │   ├── errorLogs/        # 错误日志模板库
│   │   ├── dataSources/      # 数据源定义
│   │   ├── requirements/     # 需求卡片库
│   │   ├── candidates.ts     # 候选人池
│   │   ├── events.ts         # 随机事件库
│   │   └── techStacks.ts     # 技术栈定义
│   │
│   ├── store/                # Zustand 状态管理
│   │   ├── gameStore.ts      # 主游戏状态
│   │   ├── sprintStore.ts    # Sprint 回合逻辑
│   │   └── selectors.ts      # 派生状态选择器
│   │
│   ├── engine/               # 游戏核心逻辑（纯函数，可测试）
│   │   ├── sprint.ts         # Sprint 循环引擎
│   │   ├── resources.ts      # 资源结算公式
│   │   ├── errorLogEngine.ts # 错误日志生成与处理
│   │   ├── alignmentEngine.ts# 字段对齐逻辑
│   │   ├── formulaEngine.ts  # 需求公式化逻辑
│   │   ├── eventEngine.ts    # 随机事件触发
│   │   └── endingEngine.ts   # 结局判定
│   │
│   ├── components/           # React 组件
│   │   ├── layout/
│   │   │   ├── Header.tsx        # 顶部资源栏
│   │   │   ├── Sidebar.tsx       # 左侧导航
│   │   │   └── MainPanel.tsx     # 主内容区
│   │   ├── errorLogs/
│   │   │   ├── ErrorLogList.tsx  # 日志列表
│   │   │   ├── ErrorLogCard.tsx  # 单条日志卡片
│   │   │   └── ErrorLogModal.tsx # 处理选项弹窗
│   │   ├── alignment/
│   │   │   ├── DataSourceMap.tsx # 数据源关系图
│   │   │   ├── FieldCard.tsx     # 字段卡片
│   │   │   └── AlignmentMiniGame.tsx # 对齐小游戏
│   │   ├── requirements/
│   │   │   ├── RequirementBoard.tsx  # 需求看板
│   │   │   ├── FormulaizationPanel.tsx # 公式化面板
│   │   │   └── StepCard.tsx      # 公式化步骤卡片
│   │   ├── team/
│   │   │   ├── TeamPanel.tsx     # 团队管理
│   │   │   ├── CandidateCard.tsx # 候选人卡片
│   │   │   └── RecruitModal.tsx  # 招聘弹窗
│   │   ├── events/
│   │   │   └── EventModal.tsx    # 随机事件弹窗
│   │   └── common/
│   │       ├── ResourceBar.tsx   # 资源条组件
│   │       ├── ActionButton.tsx  # 行动按钮
│   │       ├── Card.tsx          # 通用卡片容器
│   │       └── Modal.tsx         # 通用弹窗
│   │
│   ├── hooks/                # 自定义 Hooks
│   │   ├── useGameActions.ts # 游戏操作封装
│   │   ├── useSprintPhase.ts # Sprint 阶段管理
│   │   └── useAutoSave.ts    # 自动存档
│   │
│   └── utils/                # 工具函数
│       ├── random.ts         # 随机数/采样
│       ├── formatters.ts     # 格式化（数字、时间）
│       └── validators.ts     # 输入验证
│
├── docs/
│   ├── PRD.md
│   └── DEV_SPEC.md
├── tests/                    # 测试文件
│   ├── engine/               # 核心引擎测试
│   └── components/           # 组件测试
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 2. 核心类型系统

### 2.1 游戏状态（GameState）

```typescript
// src/types/game.ts

export interface GameState {
  // 元信息
  sprint: number;           // 当前 Sprint 数（1-36）
  phase: GamePhase;         // 当前阶段
  
  // 四维资源
  resources: Resources;
  
  // 核心实体
  errorLogs: ErrorLog[];            // 当前待处理日志
  dataSources: DataSource[];        // 已接入数据源
  requirements: Requirement[];      // 需求看板
  team: Employee[];                 // 团队
  techStack: TechStackChoice;       // 当前技术栈
  
  // 历史
  history: SprintRecord[];          // 每 Sprint 的结算记录
  
  // 配置
  config: GameConfig;
}

export interface Resources {
  compute: number;        // 算力（金钱）
  techDebt: number;       // 技术债务 (0-100)
  nps: number;            // 用户满意度 (0-100)
  morale: number;         // 团队士气 (0-100)
}

export type GamePhase = 
  | 'sprint_start'    // Sprint 开始，生成内容
  | 'player_turn'     // 玩家行动阶段
  | 'sprint_end'      // Sprint 结算
  | 'event'           // 随机事件
  | 'game_over';      // 游戏结束

export interface SprintRecord {
  sprint: number;
  startResources: Resources;
  endResources: Resources;
  actions: Action[];
  events: GameEvent[];
}
```

### 2.2 错误日志系统

```typescript
// src/types/errorLog.ts

export interface ErrorLog {
  id: string;
  level: ErrorLevel;
  source: string;           // 模块名
  message: string;          // 错误描述
  age: number;              // 存在 Sprint 数
  status: 'pending' | 'processing' | 'resolved' | 'ignored';
  resolution?: ErrorResolution;
}

export type ErrorLevel = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface ErrorResolution {
  strategy: ResolutionStrategy;
  cost: number;             // 实际消耗工时
  techDebtDelta: number;
  npsDelta: number;
  resolvedAt: number;       // Sprint 数
}

export type ResolutionStrategy = 
  | 'quickFix'      // 临时补丁
  | 'properFix'     // 正经修复
  | 'ignore'        // 搁置
  | 'delegate';     // 委派
```

### 2.3 字段对齐系统

```typescript
// src/types/dataSource.ts

export interface DataSource {
  id: string;
  name: string;
  fields: Field[];
  reliability: number;      // 0-100
  integrationStatus: IntegrationStatus;
}

export interface Field {
  id: string;
  name: string;             // 源内字段名
  type: FieldType;
  semantic: string;         // 语义描述
  sample: string;           // 示例值
  canonicalName?: string;   // 对齐后的统一名
}

export type FieldType = 'STRING' | 'INT' | 'FLOAT' | 'JSON' | 'TIMESTAMP' | 'BOOLEAN';

export type IntegrationStatus = 'unconnected' | 'connected' | 'aligned';

export interface AlignmentConflict {
  id: string;
  fieldA: Field & { sourceId: string };
  fieldB: Field & { sourceId: string };
  semanticMatch: number;    // 语义相似度 0-100
  status: 'pending' | 'resolved';
  resolution?: AlignmentResolution;
}

export interface AlignmentResolution {
  strategy: AlignmentStrategy;
  cost: number;
  techDebtDelta: number;
  npsDelta: number;
}

export type AlignmentStrategy =
  | 'manualMap'     // 手动映射
  | 'middleware'    // 中间层
  | 'forceCast'     // 强制转换
  | 'defer';        // 推迟
```

### 2.4 需求公式化系统

```typescript
// src/types/requirement.ts

export interface Requirement {
  id: string;
  title: string;            // 业务标题
  description: string;      // 模糊描述（PM 原话）
  urgency: UrgencyLevel;
  status: RequirementStatus;
  formulaization: FormulaizationProgress;
  implementation?: Implementation;
}

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export type RequirementStatus = 
  | 'backlog'       // 待拆解
  | 'formulaizing'  // 公式化中
  | 'ready'         // 已公式化，待开发
  | 'developing'    // 开发中
  | 'done';         // 已完成

export interface FormulaizationProgress {
  steps: FormulaStep[];
  currentStepIndex: number;
  quality: number;          // 0-100
}

export interface FormulaStep {
  id: string;
  name: string;
  description: string;
  cost: number;             // 工时消耗
  options: StepOption[];
  completed: boolean;
  selectedOptionId?: string;
}

export interface StepOption {
  id: string;
  label: string;
  description: string;
  qualityContribution: number;  // -20 ~ +30
  costMultiplier: number;       // 0.5 ~ 2.0
  techDebtDelta: number;
}

export interface Implementation {
  quality: number;          // 最终质量 0-100
  cost: number;             // 实际消耗工时
  completedAt: number;      // Sprint 数
}
```

---

## 3. 状态管理（Zustand）

### 3.1 主 Store 结构

```typescript
// src/store/gameStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameStore {
  // State
  state: GameState;
  
  // Actions - Sprint 流程
  startSprint: () => void;
  endSprint: () => void;
  
  // Actions - 玩家操作
  resolveErrorLog: (logId: string, strategy: ResolutionStrategy) => void;
  alignFields: (conflictId: string, strategy: AlignmentStrategy) => void;
  advanceFormulaization: (reqId: string, optionId: string) => void;
  implementRequirement: (reqId: string, hours: number) => void;
  recruit: (candidateId: string) => void;
  releaseVersion: (type: 'hotfix' | 'feature' | 'major') => void;
  
  // Actions - 系统
  newGame: () => void;
  loadGame: (saveData: GameState) => void;
  exportSave: () => string;  // JSON string
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      state: createInitialState(),
      
      startSprint: () => {
        const state = get().state;
        const newState = sprintStartEngine(state);
        set({ state: newState });
      },
      
      resolveErrorLog: (logId, strategy) => {
        const state = get().state;
        const newState = resolveErrorLogEngine(state, logId, strategy);
        set({ state: newState });
      },
      
      // ... 其他 actions
    }),
    {
      name: 'agent-empire-save',
      partialize: (state) => ({ state: state.state }),
    }
  )
);
```

### 3.2 派生状态选择器

```typescript
// src/store/selectors.ts

export const selectAvailableHours = (state: GameState): number => {
  const used = state.history[state.sprint - 1]?.actions.reduce((sum, a) => sum + a.cost, 0) ?? 0;
  return 10 - used;
};

export const selectCriticalErrors = (state: GameState): ErrorLog[] => 
  state.errorLogs.filter(l => l.level === 'CRITICAL' && l.status === 'pending');

export const selectPendingAlignments = (state: GameState): AlignmentConflict[] =>
  // 从 dataSources 中计算
  [];

export const selectGameStatus = (state: GameState): 'playing' | 'won' | 'lost' => {
  if (state.resources.techDebt >= 100) return 'lost';
  if (state.resources.compute <= 0 && state.sprint > 2) return 'lost';
  if (state.sprint >= 36 && state.resources.nps >= 80) return 'won';
  return 'playing';
};
```

---

## 4. 核心引擎（纯函数，优先测试）

### 4.1 Sprint 循环引擎

```typescript
// src/engine/sprint.ts

export function sprintStartEngine(state: GameState): GameState {
  // 1. 生成新错误日志（基于 TechDebt 和随机因子）
  const newLogs = generateErrorLogs(state);
  
  // 2. 检查字段对齐冲突（基于数据源变化）
  const newConflicts = detectAlignmentConflicts(state);
  
  // 3. 检查新需求（基于 Sprint 数和随机）
  const newRequirements = generateRequirements(state);
  
  // 4. 年龄增长（未处理日志 age+1）
  const agedLogs = state.errorLogs.map(l => ({ ...l, age: l.age + 1 }));
  
  // 5. 检查 P0 事故
  const p0Triggered = checkP0Incident(agedLogs);
  
  return {
    ...state,
    phase: 'player_turn',
    errorLogs: [...agedLogs, ...newLogs],
    // ... 其他更新
  };
}

export function sprintEndEngine(state: GameState): GameState {
  // 1. 资源自动结算
  const resources = calculateResourceChanges(state);
  
  // 2. 检查未处理日志的惩罚
  const pendingLogs = state.errorLogs.filter(l => l.status === 'pending');
  const techDebtFromLogs = pendingLogs.reduce((sum, l) => sum + l.age * 2, 0);
  
  // 3. 检查未对齐字段的惩罚
  const alignmentPenalty = calculateAlignmentPenalty(state);
  
  // 4. 团队士气变化
  const moraleChange = calculateMoraleChange(state);
  
  // 5. 随机事件
  const events = triggerRandomEvents(state);
  
  // 6. 检查结局
  const ending = checkEnding({ ...state, resources });
  
  return {
    ...state,
    sprint: state.sprint + 1,
    phase: ending ? 'game_over' : 'sprint_start',
    resources: {
      compute: resources.compute,
      techDebt: Math.min(100, resources.techDebt + techDebtFromLogs),
      nps: Math.max(0, Math.min(100, resources.nps + alignmentPenalty.nps)),
      morale: Math.max(0, Math.min(100, resources.morale + moraleChange)),
    },
  };
}
```

### 4.2 资源结算公式

```typescript
// src/engine/resources.ts

export function calculateResourceChanges(state: GameState): ResourceChanges {
  const { resources, team, requirements, dataSources } = state;
  
  // 算力收入 = 用户量相关（简化模型）
  const activeUsers = resources.nps * 100;  // 简化：NPS 直接映射用户数
  const revenue = activeUsers * 0.01;       // ARPU 简化
  const infraCost = team.length * 50 + dataSources.length * 30;
  const computeDelta = revenue - infraCost;
  
  // 技术债务自然增长（基础）
  const techDebtDelta = 2;  // 每 Sprint 基础增长
  
  // NPS 自然衰减（用户倦怠）
  const npsDelta = -1;
  
  return {
    compute: computeDelta,
    techDebt: techDebtDelta,
    nps: npsDelta,
    morale: 0,
  };
}
```

### 4.3 错误日志处理引擎

```typescript
// src/engine/errorLogEngine.ts

export function resolveErrorLogEngine(
  state: GameState,
  logId: string,
  strategy: ResolutionStrategy
): GameState {
  const log = state.errorLogs.find(l => l.id === logId);
  if (!log) return state;
  
  // 根据策略计算结果
  const resolution = calculateResolution(log, strategy, state.team);
  
  // 检查工时是否足够
  const availableHours = selectAvailableHours(state);
  if (resolution.cost > availableHours) {
    // 工时不足，返回原状态（UI 层应提前阻止）
    return state;
  }
  
  // 更新日志状态
  const updatedLogs = state.errorLogs.map(l => 
    l.id === logId 
      ? { ...l, status: 'resolved' as const, resolution }
      : l
  );
  
  // 更新资源
  const updatedResources = {
    ...state.resources,
    techDebt: Math.max(0, Math.min(100, state.resources.techDebt + resolution.techDebtDelta)),
    nps: Math.max(0, Math.min(100, state.resources.nps + resolution.npsDelta)),
  };
  
  return {
    ...state,
    errorLogs: updatedLogs,
    resources: updatedResources,
  };
}

function calculateResolution(
  log: ErrorLog,
  strategy: ResolutionStrategy,
  team: Employee[]
): ErrorResolution {
  const base = {
    quickFix: { cost: 1, techDebtDelta: 2, npsDelta: 0 },
    properFix: { cost: 2, techDebtDelta: -5, npsDelta: 2 },
    ignore: { cost: 0, techDebtDelta: log.age * 2, npsDelta: -getLevelWeight(log.level) * 3 },
    delegate: { cost: 0, techDebtDelta: -3, npsDelta: 1 },
  };
  
  // 如果有"代码洁癖"特质的员工，properFix 额外 -2 TechDebt
  const hasCleanFreak = team.some(e => e.trait === 'clean_freak');
  const result = { ...base[strategy] };
  if (hasCleanFreak && strategy === 'properFix') {
    result.techDebtDelta -= 2;
  }
  
  return { ...result, strategy, resolvedAt: 0 };
}
```

---

## 5. 组件设计规范

### 5.1 通用组件

```typescript
// src/components/common/Card.tsx
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'critical' | 'success' | 'warning';
  onClick?: () => void;
  className?: string;
}

// src/components/common/ActionButton.tsx
interface ActionButtonProps {
  label: string;
  cost: number;           // 工时消耗
  available: boolean;     // 是否可点击
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}
```

### 5.2 关键组件

**ErrorLogCard** - 错误日志卡片
```typescript
interface ErrorLogCardProps {
  log: ErrorLog;
  onResolve: (strategy: ResolutionStrategy) => void;
  disabled: boolean;  // 工时不足时禁用
}
// 视觉：左侧彩色竖条表示 level，中间摘要，右侧处理按钮组
```

**FieldAlignmentMiniGame** - 字段对齐小游戏
```typescript
interface FieldAlignmentMiniGameProps {
  conflict: AlignmentConflict;
  onResolve: (strategy: AlignmentStrategy) => void;
}
// 视觉：两个字段卡片，中间显示冲突类型，底部策略选择
```

**FormulaizationPanel** - 需求公式化面板
```typescript
interface FormulaizationPanelProps {
  requirement: Requirement;
  onSelectOption: (stepId: string, optionId: string) => void;
  onImplement: (hours: number) => void;
}
// 视觉：步骤进度条，当前步骤高亮，选项卡片列表
```

---

## 6. 动画规范（Framer Motion）

### 6.1 全局过渡

```typescript
// 页面/面板切换
const panelVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

// 资源变化动画
const resourceChangeVariants = {
  initial: { scale: 1 },
  change: { scale: [1, 1.2, 1], transition: { duration: 0.4 } },
};
```

### 6.2 交互反馈

```typescript
// 卡片悬停
const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

// 错误日志处理成功
const resolveSuccess = {
  initial: { opacity: 1, y: 0 },
  resolved: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

// 新 Sprint 开始
const sprintStartAnimation = {
  overlay: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  text: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { delay: 0.3, duration: 0.5 } },
  },
};
```

---

## 7. 数据内容规范

### 7.1 错误日志模板结构

```typescript
// src/data/errorLogs/index.ts

export interface ErrorLogTemplate {
  id: string;
  level: ErrorLevel;
  source: string;
  messages: string[];       // 同一类型的多条变体描述
  minSprint: number;        // 最早出现的 Sprint
  weight: number;           // 生成权重
}

export const errorLogTemplates: ErrorLogTemplate[] = [
  {
    id: 'rag_chunk_overlap',
    level: 'WARN',
    source: 'RAG检索',
    messages: [
      'chunk_overlap 设为 0.9，召回率 12%。用户问"怎么退款"得到「公司成立于2018年」',
      'Top-k 设为 50，但 relevant chunks 只有 2 个，噪音严重',
      'Embedding 模型把 "Apple" 和 "苹果" 映射到了正交方向',
    ],
    minSprint: 1,
    weight: 10,
  },
  // ... 更多模板
];
```

### 7.2 需求卡片结构

```typescript
// src/data/requirements/index.ts

export interface RequirementTemplate {
  id: string;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  minSprint: number;
  weight: number;
  steps: FormulaStepTemplate[];
}

export const requirementTemplates: RequirementTemplate[] = [
  {
    id: 'emotion_aware',
    title: '让 Agent 更有人情味',
    description: '咱们 Agent 现在回答太机械了，要更有人情味。最好像真人客服那样，能感知用户情绪，然后调整语气。这个应该不难吧？我看 OpenAI 的 demo 挺简单的。',
    urgency: 'medium',
    minSprint: 3,
    weight: 8,
    steps: [
      {
        name: '明确"人情味"的量化指标',
        description: 'PM 说"人情味"，但我们需要可量化的指标',
        options: [
          { id: 'emotion_acc', label: '情绪识别准确率', qualityContribution: 15 },
          { id: 'diversity', label: '回答多样性 (perplexity)', qualityContribution: 5 },
          { id: 'user_score', label: '用户情感评分', qualityContribution: 20 },
        ],
      },
      // ... 更多步骤
    ],
  },
];
```

---

## 8. 测试策略

### 8.1 单元测试（Vitest）

```typescript
// tests/engine/errorLogEngine.test.ts
import { describe, it, expect } from 'vitest';
import { resolveErrorLogEngine } from '@/engine/errorLogEngine';
import { createMockState } from '../fixtures';

describe('resolveErrorLogEngine', () => {
  it('should reduce techDebt when using properFix', () => {
    const state = createMockState({ techDebt: 50 });
    const newState = resolveErrorLogEngine(state, 'log-1', 'properFix');
    expect(newState.resources.techDebt).toBeLessThan(50);
  });
  
  it('should not allow resolution when insufficient hours', () => {
    const state = createMockState({ availableHours: 0 });
    const newState = resolveErrorLogEngine(state, 'log-1', 'properFix');
    expect(newState).toEqual(state); // 无变化
  });
  
  it('should trigger P0 incident after 3 sprints of ignored CRITICAL', () => {
    // ... 测试 P0 事故逻辑
  });
});

// tests/engine/resources.test.ts
describe('calculateResourceChanges', () => {
  it('should decrease compute when team is large', () => {
    // ...
  });
  
  it('should cap techDebt at 100', () => {
    // ...
  });
});
```

### 8.2 集成测试

```typescript
// tests/engine/sprint.test.ts
describe('full sprint cycle', () => {
  it('should complete 36 sprints without crashing', () => {
    let state = createInitialState();
    for (let i = 1; i <= 36; i++) {
      state = sprintStartEngine(state);
      // 模拟玩家随机操作
      state = simulateRandomActions(state);
      state = sprintEndEngine(state);
    }
    expect(state.sprint).toBe(36);
  });
});
```

### 8.3 测试覆盖率目标

| 模块 | 目标覆盖率 |
|------|-----------|
| engine/* | > 90% |
| store/* | > 70% |
| components/* | > 50%（关键交互路径）|

---

## 9. 构建与部署

### 9.1 开发命令

```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 测试（watch 模式）
npm run test

# 生产构建
npm run build

# 预览构建产物
npm run preview
```

### 9.2 GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/
  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### 9.3 vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/agent-growth-plan/',  // GitHub Pages 子路径
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
```

---

## 10. 性能考虑

- **状态更新频率**: 玩家操作时才触发，非实时游戏，无需 requestAnimationFrame
- **大数据量**: 36 Sprint × 每 Sprint 7 条日志 = 252 条日志 max，完全在 React 处理能力内
- **动画**: 使用 Framer Motion 的 `layout` 属性处理列表重排，避免全量重渲染
- **存档**: LocalStorage 存储压缩后的 JSON，预估 < 100KB

---

## 11. 扩展预留

| 扩展点 | 预留方案 |
|--------|----------|
| 多语言 | 所有文本抽离到 `src/i18n/`，使用 key 引用 |
| 音效 | 预留 `src/audio/` 目录，使用 Howler.js |
| 成就系统 | `achievements` 字段已预留于 GameState |
| 难度选择 | GameConfig.difficulty: 'easy' \| 'normal' \| 'hard' |
| 沙盒模式 | 无限资源、无结局，用于测试 |
