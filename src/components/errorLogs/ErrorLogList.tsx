import { useGameStore } from '@/store/gameStore'
import { ErrorLog } from '@/types/errorLog'
import { motion, AnimatePresence } from 'framer-motion'

function ErrorLogCard({ log }: { log: ErrorLog }) {
  const { resolveErrorLog, getAvailableHours } = useGameStore()
  const availableHours = getAvailableHours()

  const levelColors: Record<string, { border: string; bg: string; badge: string }> = {
    INFO: { border: 'border-info/50', bg: 'bg-info/5', badge: 'bg-info text-white' },
    WARN: { border: 'border-warning/50', bg: 'bg-warning/5', badge: 'bg-warning text-white' },
    ERROR: { border: 'border-danger/50', bg: 'bg-danger/5', badge: 'bg-danger text-white' },
    CRITICAL: { border: 'border-danger', bg: 'bg-danger/10', badge: 'bg-danger text-white animate-pulse' },
  }

  const colors = levelColors[log.level] || levelColors.INFO

  if (log.status === 'resolved' || log.status === 'ignored') {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.4 }}
        className={`border rounded-lg p-3 ${colors.border} ${colors.bg}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded ${colors.badge}`}>{log.level}</span>
          <span className="text-xs text-text-muted">{log.source}</span>
          <span className="text-xs text-text-muted">{log.age} Sprint 前</span>
          <span className="text-xs text-success ml-auto">✓ {log.resolution?.strategy}</span>
        </div>
        <p className="text-sm text-text-secondary line-through">{log.message}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`border rounded-lg p-4 ${colors.border} ${colors.bg}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${colors.badge}`}>{log.level}</span>
        <span className="text-xs text-text-muted">{log.source}</span>
        {log.age > 0 && (
          <span className="text-xs text-warning">已存在 {log.age} Sprint</span>
        )}
      </div>
      
      <p className="text-sm text-text-primary mb-4">{log.message}</p>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => resolveErrorLog(log.id, 'quickFix')}
          disabled={availableHours < 1}
          className="px-3 py-1.5 text-xs bg-bg-tertiary border border-border rounded hover:border-warning hover:text-warning transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          🔧 临时补丁 (1h, +2 TechDebt)
        </button>
        <button
          onClick={() => resolveErrorLog(log.id, 'properFix')}
          disabled={availableHours < 2}
          className="px-3 py-1.5 text-xs bg-bg-tertiary border border-border rounded hover:border-success hover:text-success transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ✅ 正经修复 (2h, -5 TechDebt)
        </button>
        <button
          onClick={() => resolveErrorLog(log.id, 'ignore')}
          disabled={availableHours < 0}
          className="px-3 py-1.5 text-xs bg-bg-tertiary border border-border rounded hover:border-danger hover:text-danger transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ❌ 搁置 (0h, +{log.age * 2} TechDebt)
        </button>
        <button
          onClick={() => resolveErrorLog(log.id, 'delegate')}
          disabled={availableHours < 0}
          className="px-3 py-1.5 text-xs bg-bg-tertiary border border-border rounded hover:border-accent hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          👤 委派 (0h, -3 TechDebt, 需 senior)
        </button>
      </div>
    </motion.div>
  )
}

export function ErrorLogList() {
  const { state } = useGameStore()
  const pendingLogs = state.errorLogs.filter(l => l.status === 'pending')
  const resolvedLogs = state.errorLogs.filter(l => l.status === 'resolved' || l.status === 'ignored')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-text-primary">
          🐛 错误日志 {pendingLogs.length > 0 && <span className="text-danger">({pendingLogs.length} 待处理)</span>}
        </h2>
      </div>

      {pendingLogs.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <div className="text-4xl mb-4">🎉</div>
          <p>当前没有待处理的错误日志</p>
          <p className="text-sm mt-2">结束 Sprint 后会生成新的日志</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {pendingLogs.map(log => (
              <ErrorLogCard key={log.id} log={log} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {resolvedLogs.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-text-muted mb-3">
            已处理 ({resolvedLogs.length})
          </h3>
          <div className="space-y-2">
            {resolvedLogs.slice(-5).map(log => (
              <ErrorLogCard key={log.id} log={log} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
