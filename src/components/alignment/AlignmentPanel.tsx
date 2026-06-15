// src/components/alignment/AlignmentPanel.tsx
import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { DataSource } from '@/types/dataSource'

function DataSourceCard({ source, onConnect }: { source: DataSource; onConnect?: () => void }) {
  const statusColors = {
    unconnected: 'border-text-muted text-text-muted',
    connected: 'border-warning text-warning',
    aligned: 'border-success text-success',
  }

  return (
    <div className={`border rounded-lg p-3 ${statusColors[source.integrationStatus]}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm">{source.name}</h3>
        <span className="text-xs px-2 py-0.5 rounded bg-bg-tertiary">
          {source.integrationStatus === 'unconnected' ? '未接入' : source.integrationStatus === 'connected' ? '已接入' : '已对齐'}
        </span>
      </div>
      <div className="text-xs text-text-muted mb-2">可靠度: {source.reliability}%</div>
      <div className="space-y-1">
        {source.fields.map(field => (
          <div key={field.id} className="flex items-center gap-2 text-xs">
            <span className="text-text-secondary">{field.name}</span>
            <span className="text-text-muted">({field.type})</span>
            <span className="text-text-muted truncate">→ {field.semantic}</span>
          </div>
        ))}
      </div>
      {source.integrationStatus === 'unconnected' && onConnect && (
        <button
          onClick={onConnect}
          className="mt-2 w-full px-2 py-1 text-xs bg-accent/20 text-accent rounded hover:bg-accent/30 transition-colors"
        >
          🔌 接入数据源 (1h)
        </button>
      )}
    </div>
  )
}

export function AlignmentPanel() {
  const { state, connectDataSource } = useGameStore()
  const [activeTab, setActiveTab] = useState<'sources' | 'conflicts'>('sources')

  // 计算冲突
  const connectedSources = state.dataSources.filter(ds => ds.integrationStatus !== 'unconnected')
  const unconnectedSources = state.dataSources.filter(ds => ds.integrationStatus === 'unconnected')

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setActiveTab('sources')}
          className={`px-3 py-1.5 rounded text-sm ${activeTab === 'sources' ? 'bg-accent/20 text-accent' : 'text-text-secondary'}`}
        >
          🌐 数据源 ({state.dataSources.length})
        </button>
        <button
          onClick={() => setActiveTab('conflicts')}
          className={`px-3 py-1.5 rounded text-sm ${activeTab === 'conflicts' ? 'bg-accent/20 text-accent' : 'text-text-secondary'}`}
        >
          ⚡ 字段冲突
        </button>
      </div>

      {activeTab === 'sources' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-3">已接入</h3>
            <div className="space-y-3">
              {connectedSources.map(source => (
                <DataSourceCard key={source.id} source={source} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-muted mb-3">未接入</h3>
            <div className="space-y-3">
              {unconnectedSources.map(source => (
                <DataSourceCard
                  key={source.id}
                  source={source}
                  onConnect={() => connectDataSource(source.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'conflicts' && (
        <div>
          <p className="text-sm text-text-muted mb-4">
            当两个数据源存在语义相同但命名/格式不同的字段时，需要手动对齐。
          </p>
          <div className="space-y-4">
            {/* 这里简化展示，实际需要 detectAlignmentConflicts 计算 */}
            <div className="text-center py-8 text-text-muted">
              <div className="text-4xl mb-4">🔍</div>
              <p>接入多个数据源后，字段冲突将自动检测</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
