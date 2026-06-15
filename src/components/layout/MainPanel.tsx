import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { ErrorLogList } from '@/components/errorLogs/ErrorLogList'
import { AlignmentPanel } from '@/components/alignment/AlignmentPanel'
import { RequirementPanel } from '@/components/requirements/RequirementPanel'
import { EventPanel } from '@/components/events/EventPanel'

type TabId = 'logs' | 'alignment' | 'requirements' | 'team' | 'events'

export function MainPanel() {
  const [activeTab, setActiveTab] = useState<TabId>('logs')
  const { state, endSprint } = useGameStore()

  const renderContent = () => {
    switch (activeTab) {
      case 'logs':
        return <ErrorLogList />
      case 'events':
        return <EventPanel />
      case 'alignment':
        return <AlignmentPanel />
      case 'requirements':
        return <RequirementPanel />
      case 'team':
        return (
          <div className="p-8 text-center text-text-muted">
            <div className="text-4xl mb-4">👥</div>
            <p>团队管理</p>
            <p className="text-sm mt-2">招聘、面试和团队建设</p>
            <p className="text-xs mt-4 text-text-secondary">（MVP 阶段暂未实现完整功能）</p>
          </div>
        )
      default:
        return <ErrorLogList />
    }
  }

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-bg-secondary/50">
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-3 py-1 rounded text-sm ${activeTab === 'logs' ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:text-text-primary'}`}
        >
          🐛 错误日志
        </button>
        <button
          onClick={() => setActiveTab('alignment')}
          className={`px-3 py-1 rounded text-sm ${activeTab === 'alignment' ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:text-text-primary'}`}
        >
          🌐 字段对齐
        </button>
        <button
          onClick={() => setActiveTab('requirements')}
          className={`px-3 py-1 rounded text-sm ${activeTab === 'requirements' ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:text-text-primary'}`}
        >
          📝 需求看板
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`px-3 py-1 rounded text-sm ${activeTab === 'team' ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:text-text-primary'}`}
        >
          👥 团队
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-3 py-1 rounded text-sm ${activeTab === 'events' ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:text-text-primary'}`}
        >
          ⚡ 事件 {state.events.length > 0 && `(${state.events.length})`}
        </button>
        
        <div className="flex-1" />
        
        <button
          onClick={endSprint}
          className="px-4 py-1.5 bg-success text-white rounded text-sm font-medium hover:bg-success-light transition-colors"
        >
          ✅ 结束 Sprint
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderContent()}
      </div>
    </main>
  )
}
