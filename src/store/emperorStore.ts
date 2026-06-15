import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Resources } from '@/types/emperor';
import {
  createInitialState,
  generateDecrees,
  generateEvents,
  recruitOfficial,
  calculateEndOfTurn,
  checkEnding,
  getEndingText,
} from '@/engine/emperorEngine';

interface EmperorStore {
  state: GameState;
  actionsUsed: number;
  maxActions: number;

  startTurn: () => void;
  endTurn: () => void;
  issueDecree: (decreeId: string, effects: Partial<Resources>) => void;
  recruitOfficial: () => void;
  handleEvent: (choiceIndex: number) => void;
  newGame: () => void;
  getEndingText: () => string;
}

export const useEmperorStore = create<EmperorStore>()(
  persist(
    (set, get) => ({
      state: createInitialState(),
      actionsUsed: 0,
      maxActions: 5,

      startTurn: () => {
        set((s) => ({
          state: {
            ...s.state,
            phase: 'player_turn',
            decrees: generateDecrees(),
          },
          actionsUsed: 0,
        }));
      },

      endTurn: () => {
        set((s) => {
          const newResources = calculateEndOfTurn(s.state);
          const newEvents = generateEvents();
          const ending = checkEnding({ ...s.state, resources: newResources });

          return {
            state: {
              ...s.state,
              turn: s.state.turn + 1,
              resources: newResources,
              events: newEvents,
              phase: ending ? 'game_over' : 'turn_end',
              history: [
                ...s.state.history,
                {
                  turn: s.state.turn,
                  startResources: s.state.resources,
                  endResources: newResources,
                  actions: [],
                },
              ],
            },
            actionsUsed: 0,
          };
        });

        // Auto start next turn after a delay if not game over
        setTimeout(() => {
          const { state } = get();
          if (state.phase === 'turn_end') {
            get().startTurn();
          }
        }, 500);
      },

      issueDecree: (decreeId, effects) => {
        set((s) => {
          if (s.actionsUsed >= s.maxActions) return s;

          const newResources = { ...s.state.resources };
          Object.entries(effects).forEach(([key, value]) => {
            if (value !== undefined) {
              (newResources as any)[key] = Math.max(0, (newResources as any)[key] + value);
            }
          });

          return {
            state: {
              ...s.state,
              resources: newResources,
              decrees: s.state.decrees.filter((d) => d.id !== decreeId),
            },
            actionsUsed: s.actionsUsed + 1,
          };
        });
      },

      recruitOfficial: () => {
        set((s) => {
          if (s.actionsUsed >= s.maxActions || s.state.resources.treasury < 100) return s;

          const official = recruitOfficial();
          return {
            state: {
              ...s.state,
              officials: [...s.state.officials, official],
              resources: {
                ...s.state.resources,
                treasury: s.state.resources.treasury - 100,
              },
            },
            actionsUsed: s.actionsUsed + 1,
          };
        });
      },

      handleEvent: (choiceIndex) => {
        set((s) => {
          const event = s.state.events[0];
          if (!event) return s;

          const choice = event.choices[choiceIndex];
          if (!choice) return s;

          const newResources = { ...s.state.resources };
          Object.entries(choice.effects).forEach(([key, value]) => {
            if (value !== undefined) {
              (newResources as any)[key] = Math.max(0, (newResources as any)[key] + value);
            }
          });

          return {
            state: {
              ...s.state,
              resources: newResources,
              events: [],
            },
          };
        });
      },

      newGame: () => {
        set({
          state: createInitialState(),
          actionsUsed: 0,
        });
        setTimeout(() => get().startTurn(), 100);
      },

      getEndingText: () => {
        const { state } = get();
        const ending = checkEnding(state);
        return ending ? getEndingText(ending) : '';
      },
    }),
    {
      name: 'emperor-empire-save',
      partialize: (state) => ({ state: state.state }),
    }
  )
);
