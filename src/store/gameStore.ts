// src/store/gameStore.ts - Zustand 主游戏状态管理

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Action } from '@/types/game';
import { ResolutionStrategy } from '@/types/errorLog';
import { createInitialState, sprintStartEngine, sprintEndEngine, addAction } from '@/engine/sprint';
import { resolveErrorLog as resolveErrorLogEngine } from '@/engine/errorLogEngine';
import { advanceFormulaization as advanceFormulaizationEngine } from '@/engine/requirementEngine';
import { checkEnding, getEndingText } from '@/engine/endingEngine';

interface GameStore {
  state: GameState;
  
  // Sprint 流程
  startSprint: () => void;
  endSprint: () => void;
  
  // 字段对齐
  connectDataSource: (sourceId: string) => void;
  resolveAlignment: (conflictId: string, strategy: string) => void;
  
  // 玩家操作
  resolveErrorLog: (logId: string, strategy: ResolutionStrategy) => void;
  advanceFormulaization: (reqId: string, optionId: string) => void;
  handleEvent: (eventId: string, choiceId: string) => void;
  
  // 系统
  newGame: () => void;
  exportSave: () => string;
  importSave: (json: string) => boolean;
  
  // 选择器
  getAvailableHours: () => number;
  getGameStatus: () => 'playing' | 'won' | 'lost';
  getEndingText: () => string;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      state: createInitialState(),
      
      startSprint: () => {
        set((store) => ({
          state: sprintStartEngine(store.state),
        }));
      },
      
      endSprint: () => {
        set((store) => {
          let newState = sprintEndEngine(store.state);
          
          // 自动推进到下一个 Sprint 开始（如果游戏未结束）
          if (newState.phase !== 'game_over') {
            newState = sprintStartEngine(newState);
          }
          
          return { state: newState };
        });
      },
      
      connectDataSource: (sourceId) => {
        set((store) => ({
          state: {
            ...store.state,
            dataSources: store.state.dataSources.map(ds =>
              ds.id === sourceId ? { ...ds, integrationStatus: 'connected' as const } : ds
            ),
            resources: {
              ...store.state.resources,
              compute: store.state.resources.compute - 50,
            },
          },
        }));
      },
      
      resolveAlignment: () => {
        // 简化实现，占位
      },
      
      resolveErrorLog: (logId, strategy) => {
        set((store) => {
          const newState = resolveErrorLogEngine(store.state, logId, strategy);
          const action: Action = {
            type: 'resolve_error_log',
            cost: newState.errorLogs.find(l => l.id === logId)?.resolution?.cost || 0,
            targetId: logId,
            metadata: { strategy },
          };
          return {
            state: addAction(newState, action),
          };
        });
      },
      
      advanceFormulaization: (reqId, optionId) => {
        set((store) => {
          const newState = advanceFormulaizationEngine(store.state, reqId, optionId);
          const action: Action = {
            type: 'advance_formulaization',
            cost: 1,
            targetId: reqId,
            metadata: { optionId },
          };
          return {
            state: addAction(newState, action),
          };
        });
      },
      
      handleEvent: (eventId, choiceId) => {
        set((store) => {
          const event = store.state.events.find(e => e.id === eventId);
          if (!event) return store;
          
          const choice = event.choices.find(c => c.id === choiceId);
          if (!choice) return store;
          
          const newResources = { ...store.state.resources };
          if (choice.effects.compute) newResources.compute = Math.max(0, newResources.compute + choice.effects.compute);
          if (choice.effects.techDebt) newResources.techDebt = Math.max(0, Math.min(100, newResources.techDebt + choice.effects.techDebt));
          if (choice.effects.nps) newResources.nps = Math.max(0, Math.min(100, newResources.nps + choice.effects.nps));
          if (choice.effects.morale) newResources.morale = Math.max(0, Math.min(100, newResources.morale + choice.effects.morale));
          
          const newEvents = store.state.events.filter(e => e.id !== eventId);
          
          return {
            state: {
              ...store.state,
              resources: newResources,
              events: newEvents,
            },
          };
        });
      },
      
      newGame: () => {
        set({ state: createInitialState() });
      },
      
      exportSave: () => {
        return JSON.stringify(get().state);
      },
      
      importSave: (json) => {
        try {
          const state = JSON.parse(json) as GameState;
          set({ state });
          return true;
        } catch {
          return false;
        }
      },
      
      getAvailableHours: () => {
        const state = get().state;
        const currentRecord = state.history[state.sprint - 1];
        if (!currentRecord) return state.config.hoursPerSprint;
        const used = currentRecord.actions.reduce((sum, a) => sum + a.cost, 0);
        return state.config.hoursPerSprint - used;
      },
      
      getGameStatus: () => {
        const state = get().state;
        if (state.phase === 'game_over') {
          const ending = checkEnding(state);
          return ending || 'lost';
        }
        return 'playing';
      },
      
      getEndingText: () => {
        return getEndingText(get().state);
      },
    }),
    {
      name: 'agent-empire-save',
      partialize: (state) => ({ state: state.state }),
    }
  )
);
