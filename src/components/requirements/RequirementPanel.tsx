// src/components/requirements/RequirementPanel.tsx
import { useGameStore } from '@/store/gameStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Requirement, RequirementStatus } from '@/types/requirement'

function RequirementCard({ req }: { req: Requirement }) {
  const { advanceFormulaization } = useGameStore()
  const progress = req.formulaization
  const currentStep = progress.steps[progress.currentStepIndex]

  const statusLabels: Record<RequirementStatus, string> = {
    backlog: '待拆解',
    formulaizing: '公式化中',
    ready: '待开发',
    developing: '开发中',
    done: '已完成',
  }

  const statusColors: Record<RequirementStatus, string> = {
    backlog: 'text-text-muted',
    formulaizing: 'text-warning',
    ready: 'text-success',
    developing: 'text-accent',
    done: 'text-success',
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border bg-bg-secondary rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm">{req.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded bg-bg-tertiary ${statusColors[req.status]}`}>
          {statusLabels[req.status]}
        </span>
      </div>

      <p className="text-xs text-text-muted mb-3">{req.description}</p>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-text-muted">公式化质量</span>
          <span className={progress.quality > 60 ? 'text-success' : progress.quality > 30 ? 'text-warning' : 'text-danger'}>
            {progress.quality}/100
          </span>
        </div>
        <div className="w-full h-1.5 bg-bg-tertiary rounded-full">
          <div
            className={`h-full rounded-full transition-all ${
              progress.quality > 60 ? 'bg-success' : progress.quality > 30 ? 'bg-warning' : 'bg-danger'
            }`}
            style={{ width: `${progress.quality}%` }}
          />
        </div>
      </div>

      {req.status === 'formulaizing' && currentStep && (
        <div className="space-y-2">
          <div className="text-xs text-text-muted mb-2">
            步骤 {progress.currentStepIndex + 1}/{progress.steps.length}: {currentStep.name}
          </div>
          <p className="text-xs text-text-secondary mb-2">{currentStep.description}</p>
          <div className="flex flex-wrap gap-2">
            {currentStep.options.map(option => (
              <button
                key={option.id}
                onClick={() => advanceFormulaization(req.id, option.id)}
                className="px-3 py-1.5 text-xs bg-bg-tertiary border border-border rounded hover:border-accent hover:text-accent transition-colors text-left"
              >
                <div className="font-medium">{option.label}</div>
                <div className="text-text-muted mt-0.5">{option.description}</div>
                <div className="text-text-muted mt-0.5">
                  {option.qualityContribution > 0 ? '+' : ''}{option.qualityContribution} 质量
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {req.status === 'backlog' && (
        <button
          onClick={() => advanceFormulaization(req.id, 'start')}
          className="px-3 py-1.5 text-xs bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
        >
          🔍 开始公式化 (1h)
        </button>
      )}
    </motion.div>
  )
}

export function RequirementPanel() {
  const { state } = useGameStore()
  const reqs = state.requirements

  const backlog = reqs.filter(r => r.status === 'backlog')
  const formulaizing = reqs.filter(r => r.status === 'formulaizing')
  const ready = reqs.filter(r => r.status === 'ready' || r.status === 'developing')
  const done = reqs.filter(r => r.status === 'done')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-text-primary">
          📝 需求看板 {reqs.length > 0 && <span className="text-text-muted">({reqs.length})</span>}
        </h2>
      </div>

      {reqs.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <div className="text-4xl mb-4">📋</div>
          <p>当前没有待处理的需求</p>
          <p className="text-sm mt-2">Sprint 进行中可能会收到新的需求</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-3">待拆解 ({backlog.length})</h3>
            <div className="space-y-3">
              <AnimatePresence>
                {backlog.map(req => (
                  <RequirementCard key={req.id} req={req} />
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-3">公式化中 ({formulaizing.length})</h3>
            <div className="space-y-3">
              <AnimatePresence>
                {formulaizing.map(req => (
                  <RequirementCard key={req.id} req={req} />
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-3">待开发 ({ready.length})</h3>
            <div className="space-y-3">
              <AnimatePresence>
                {ready.map(req => (
                  <RequirementCard key={req.id} req={req} />
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-3">已完成 ({done.length})</h3>
            <div className="space-y-3">
              <AnimatePresence>
                {done.map(req => (
                  <RequirementCard key={req.id} req={req} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
