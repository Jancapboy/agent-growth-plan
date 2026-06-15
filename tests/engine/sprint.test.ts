// tests/engine/sprint.test.ts
import { describe, it, expect } from 'vitest'
import { createInitialState, sprintStartEngine, sprintEndEngine } from '@/engine/sprint'
import { GameState } from '@/types/game'

describe('createInitialState', () => {
  it('should create state with correct initial values', () => {
    const state = createInitialState()
    expect(state.sprint).toBe(1)
    expect(state.resources.compute).toBe(1000)
    expect(state.resources.techDebt).toBe(20)
    expect(state.resources.nps).toBe(50)
    expect(state.resources.morale).toBe(70)
    expect(state.phase).toBe('sprint_start')
    expect(state.team.length).toBe(1)
  })
})

describe('sprintStartEngine', () => {
  it('should generate new error logs', () => {
    const state = createInitialState()
    const newState = sprintStartEngine(state)
    expect(newState.errorLogs.length).toBeGreaterThan(0)
    expect(newState.phase).toBe('player_turn')
  })

  it('should age existing logs', () => {
    const state = createInitialState()
    state.errorLogs = [{
      id: 'old-log',
      level: 'WARN',
      source: 'DB',
      message: 'Old error',
      age: 0,
      status: 'pending'
    }]
    const newState = sprintStartEngine(state)
    const oldLog = newState.errorLogs.find(l => l.id === 'old-log')
    expect(oldLog?.age).toBe(1)
  })
})

describe('sprintEndEngine', () => {
  it('should increment sprint number', () => {
    const state = createInitialState()
    state.phase = 'player_turn'
    state.history = [{
      sprint: 1,
      startResources: { ...state.resources },
      endResources: { ...state.resources },
      actions: [],
      events: []
    }]
    const newState = sprintEndEngine(state)
    expect(newState.sprint).toBe(2)
  })

  it('should apply resource changes', () => {
    const state = createInitialState()
    state.phase = 'player_turn'
    state.history = [{
      sprint: 1,
      startResources: { ...state.resources },
      endResources: { ...state.resources },
      actions: [],
      events: []
    }]
    const newState = sprintEndEngine(state)
    // techDebt should increase due to base growth
    expect(newState.resources.techDebt).toBeGreaterThanOrEqual(state.resources.techDebt)
  })
})
