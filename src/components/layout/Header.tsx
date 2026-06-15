import { useGameStore } from '@/store/gameStore'

function ResourceItem({ icon, value, max, colorClass, label }: {
  icon: string
  value: number
  max?: number
  colorClass: string
  label: string
}) {
  const percentage = max ? Math.min(100, (value / max) * 100) : 100
  
  return (
    <div className="flex items-center gap-2 px-3 py-1">
      <span className="text-lg">{icon}</span>
      <div className="flex flex-col min-w-[80px]">
        <span className="text-xs text-text-muted">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`font-bold ${colorClass}`}>{value.toFixed(0)}</span>
          {max && (
            <div className="w-16 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${colorClass.replace('text-', 'bg-')}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Header() {
  const { state, getAvailableHours } = useGameStore()
  const availableHours = getAvailableHours()
  
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-bg-secondary border-b border-border">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-accent">
          🏢 Agent Empire
        </h1>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span className="px-2 py-0.5 bg-bg-tertiary rounded">Sprint {state.sprint}/{state.config.maxSprints}</span>
          <span className="px-2 py-0.5 bg-bg-tertiary rounded">⏱️ {availableHours}h left</span>
        </div>
      </div>
      
      <div className="flex items-center">
        <ResourceItem icon="💰" value={state.resources.compute} colorClass="text-success" label="Compute" />
        <ResourceItem icon="⚠️" value={state.resources.techDebt} max={100} colorClass="text-danger" label="TechDebt" />
        <ResourceItem icon="😊" value={state.resources.nps} max={100} colorClass="text-accent" label="NPS" />
        <ResourceItem icon="💪" value={state.resources.morale} max={100} colorClass="text-warning" label="Morale" />
      </div>
    </header>
  )
}
