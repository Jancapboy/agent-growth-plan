import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'

type TabId = 'logs' | 'alignment' | 'requirements' | 'team' | 'events'

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'logs', label: '错误日志', icon: '🐛' },
  { id: 'alignment', label: '字段对齐', icon: '🌐' },
  { id: 'requirements', label: '需求看板', icon: '📝' },
  { id: 'team', label: '团队', icon: '👥' },
  { id: 'events', label: '事件', icon: '⚡' },
]

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<TabId>('logs')
  const { state } = useGameStore()

  // 未处理日志数量
  const pendingLogs = state.errorLogs.filter(l => l.status === 'pending').length
  // 未处理事件数量
  const pendingEvents = state.events.length

  return (
    <aside className="w-48 bg-bg-secondary border-r border-border flex flex-col"
>
      <nav className="flex flex-col gap-1 p-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded text-left text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-accent/20 text-accent'
                : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="flex-1">{tab.label}</span>
            {tab.id === 'logs' && pendingLogs > 0 && (
              <span className="bg-danger text-white text-xs px-1.5 py-0.5 rounded-full">{pendingLogs}</span>
            )}
            {tab.id === 'events' && pendingEvents > 0 && (
              <span className="bg-warning text-white text-xs px-1.5 py-0.5 rounded-full">{pendingEvents}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-3 border-t border-border">
        <div className="text-xs text-text-muted space-y-1">
          <div>Phase: <span className="text-text-secondary">{state.phase}</span></div>
          <div>Team: <span className="text-text-secondary">{state.team.length} 人</span></div>
          <div>Data Sources: <span className="text-text-secondary">{state.dataSources.length}</span></div>
        </div>
      </div>
    </aside>
  )
}
