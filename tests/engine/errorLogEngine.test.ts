// tests/engine/errorLogEngine.test.ts
import { describe, it, expect } from 'vitest'
import { generateErrorLogs, resolveErrorLog, getAvailableHours, checkP0Incident } from '@/engine/errorLogEngine'
import { createInitialState } from '@/engine/sprint'
import { GameState } from '@/types/game'
import { ErrorLog } from '@/types/errorLog'

describe('generateErrorLogs', () => {
  it('should generate logs based on techDebt', () => {
    const state = createInitialState()
    state.resources.techDebt = 50
    const logs = generateErrorLogs(state)
    expect(logs.length).toBeGreaterThan(0)
    expect(logs.length).toBeLessThanOrEqual(8) // 4 + 50/20 = 6, plus random
  })

  it('should not generate logs with age > 0 initially', () => {
    const state = createInitialState()
    const logs = generateErrorLogs(state)
    logs.forEach(log => expect(log.age).toBe(0))
  })
})

describe('resolveErrorLog', () => {
  it('should reduce techDebt when using properFix', () => {
    const state = createInitialState()
    state.errorLogs = [{
      id: 'test-log',
      level: 'ERROR',
      source: 'API',
      message: 'Test error',
      age: 0,
      status: 'pending'
    }]
    state.history = [{
      sprint: 1,
      startResources: { ...state.resources },
      endResources: { ...state.resources },
      actions: [],
      events: []
    }]
    
    const newState = resolveErrorLog(state, 'test-log', 'properFix')
    expect(newState.resources.techDebt).toBeLessThan(state.resources.techDebt)
    expect(newState.errorLogs[0].status).toBe('resolved')
  })

  it('should not allow resolution when insufficient hours', () => {
    const state = createInitialState()
    state.errorLogs = [{
      id: 'test-log',
      level: 'ERROR',
      source: 'API',
      message: 'Test error',
      age: 0,
      status: 'pending'
    }]
    state.history = [{
      sprint: 1,
      startResources: { ...state.resources },
      endResources: { ...state.resources },
      actions: [
        { type: 'test', cost: 10 } // Use all hours
      ],
      events: []
    }]
    
    const newState = resolveErrorLog(state, 'test-log', 'properFix')
    expect(newState).toEqual(state)
  })

  it('should trigger P0 incident after 3 sprints of ignored ERROR', () => {
    const state = createInitialState()
    state.errorLogs = [{
      id: 'test-log',
      level: 'ERROR',
      source: 'API',
      message: 'Test error',
      age: 3,
      status: 'pending'
    }]
    
    expect(checkP0Incident(state)).toBe(true)
  })
})
