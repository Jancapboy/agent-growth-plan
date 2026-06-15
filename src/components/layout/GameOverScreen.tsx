import { useGameStore } from '@/store/gameStore'
import { motion } from 'framer-motion'

export function GameOverScreen() {
  const { state, getEndingText, newGame } = useGameStore()
  const endingText = getEndingText()

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-bg-primary text-text-primary font-mono">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center max-w-lg px-8"
      >
        <div className="text-6xl mb-6">📊</div>
        <h1 className="text-3xl font-bold mb-4">
          {endingText.includes('🏆') || endingText.includes('🦄') || endingText.includes('🌟')
            ? '恭喜通关！'
            : '游戏结束'}
        </h1>
        <p className="text-lg text-text-secondary mb-8">{endingText}</p>

        <div className="bg-bg-secondary rounded-lg p-6 mb-8 text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-text-muted">Sprint 数</span>
            <span className="font-bold">{state.sprint}/{state.config.maxSprints}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">剩余算力</span>
            <span className={`font-bold ${state.resources.compute > 0 ? 'text-success' : 'text-danger'}`}>
              {state.resources.compute.toFixed(0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">技术债务</span>
            <span className={`font-bold ${state.resources.techDebt < 50 ? 'text-success' : 'text-danger'}`}>
              {state.resources.techDebt.toFixed(0)}/100
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">用户满意度</span>
            <span className={`font-bold ${state.resources.nps > 60 ? 'text-success' : 'text-warning'}`}>
              {state.resources.nps.toFixed(0)}/100
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">团队士气</span>
            <span className={`font-bold ${state.resources.morale > 50 ? 'text-success' : 'text-danger'}`}>
              {state.resources.morale.toFixed(0)}/100
            </span>
          </div>
        </div>

        <button
          onClick={newGame}
          className="px-8 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-hover transition-colors"
        >
          🔄 再来一局
        </button>
      </motion.div>
    </div>
  )
}
