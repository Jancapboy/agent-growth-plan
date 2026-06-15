import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { MainPanel } from '@/components/layout/MainPanel'
import { GameOverScreen } from '@/components/layout/GameOverScreen'
import './index.css'

function App() {
  const { state, startSprint, getGameStatus } = useGameStore()

  // 初始化游戏
  useEffect(() => {
    if (state.sprint === 1 && state.phase === 'sprint_start' && state.errorLogs.length === 0) {
      startSprint()
    }
  }, [])

  const gameStatus = getGameStatus()

  if (gameStatus !== 'playing') {
    return <GameOverScreen />
  }

  return (
    <div className="flex flex-col h-screen bg-bg-primary text-text-primary font-mono overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainPanel />
      </div>
    </div>
  )
}

export default App
