// src/components/events/EventPanel.tsx
import { useGameStore } from '@/store/gameStore'
import { motion } from 'framer-motion'

export function EventPanel() {
  const { state, handleEvent } = useGameStore()

  if (state.events.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <div className="text-4xl mb-4">🌤️</div>
        <p>当前没有待处理的事件</p>
        <p className="text-sm mt-2">Sprint 结束时可能会触发随机事件</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-text-primary mb-4">
        ⚡ 随机事件 ({state.events.length})
      </h2>

      {state.events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="border border-warning/30 bg-warning/5 rounded-lg p-4"
        >
          <h3 className="font-bold text-text-primary mb-2">{event.title}</h3>
          <p className="text-sm text-text-secondary mb-4">{event.description}</p>

          <div className="flex flex-wrap gap-2">
            {event.choices.map(choice => (
              <button
                key={choice.id}
                onClick={() => handleEvent(event.id, choice.id)}
                className="px-4 py-2 text-sm bg-bg-tertiary border border-border rounded hover:border-warning hover:text-warning transition-colors text-left"
              >
                <div className="font-medium">{choice.label}</div>
                <div className="text-xs text-text-muted mt-1">{choice.description}</div>
                <div className="text-xs text-text-muted mt-1">
                  {choice.effects.compute && <span>💰 {choice.effects.compute > 0 ? '+' : ''}{choice.effects.compute} </span>}
                  {choice.effects.techDebt && <span>⚠️ {choice.effects.techDebt > 0 ? '+' : ''}{choice.effects.techDebt} </span>}
                  {choice.effects.nps && <span>😊 {choice.effects.nps > 0 ? '+' : ''}{choice.effects.nps} </span>}
                  {choice.effects.morale && <span>💪 {choice.effects.morale > 0 ? '+' : ''}{choice.effects.morale}</span>}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
