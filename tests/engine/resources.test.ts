// tests/engine/resources.test.ts
import { describe, it, expect } from 'vitest'
import { calculateResourceChanges, applyResourceChanges } from '@/engine/resources'
import { createInitialState } from '@/engine/sprint'
import { GameState } from '@/types/game'

describe('calculateResourceChanges', () => {
  it('should decrease compute when team is large', () => {
    const state = createInitialState()
    state.team = [
      ...state.team,
      { id: 'e2', name: 'Bob', role: 'senior', skills: [], salary: 100, trait: 'normal' },
      { id: 'e3', name: 'Charlie', role: 'mid', skills: [], salary: 80, trait: 'normal' },
    ]
    const changes = calculateResourceChanges(state)
    expect(changes.compute).toBeLessThan(0) // 3 人团队基础设施成本 > 收入
  })

  it('should increase techDebt by base amount', () => {
    const state = createInitialState()
    const changes = calculateResourceChanges(state)
    expect(changes.techDebt).toBe(2)
  })

  it('should decrease nps by natural decay', () => {
    const state = createInitialState()
    const changes = calculateResourceChanges(state)
    expect(changes.nps).toBe(-1)
  })
})

describe('applyResourceChanges', () => {
  it('should cap techDebt at 100', () => {
    const resources = { compute: 1000, techDebt: 95, nps: 50, morale: 70 }
    const changes = { compute: 0, techDebt: 10, nps: 0, morale: 0 }
    const result = applyResourceChanges(resources, changes)
    expect(result.techDebt).toBe(100)
  })

  it('should floor nps at 0', () => {
    const resources = { compute: 1000, techDebt: 20, nps: 5, morale: 70 }
    const changes = { compute: 0, techDebt: 0, nps: -10, morale: 0 }
    const result = applyResourceChanges(resources, changes)
    expect(result.nps).toBe(0)
  })
})
