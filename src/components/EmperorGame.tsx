import { useEffect } from 'react';
import { useEmperorStore } from '@/store/emperorStore';
import { motion, AnimatePresence } from 'framer-motion';

function ResourceBar({ icon, value, max, label }: { icon: string; value: number; max?: number; label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1">
      <span className="text-lg">{icon}</span>
      <div className="flex flex-col min-w-[80px]">
        <span className="text-xs text-gray-400">{label}</span>
        <span className={`font-bold ${value < 20 ? 'text-red-400' : 'text-white'}`}>
          {value.toFixed(0)}{max ? `/${max}` : ''}
        </span>
      </div>
    </div>
  );
}

export function EmperorGame() {
  const { state, actionsUsed, maxActions, startTurn, endTurn, issueDecree, recruitOfficial, handleEvent, newGame, getEndingText } = useEmperorStore();

  useEffect(() => {
    if (state.turn === 1 && state.phase === 'turn_start') {
      startTurn();
    }
  }, []);

  if (state.phase === 'game_over') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white font-mono">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="text-6xl mb-4">👑</div>
          <h1 className="text-3xl font-bold mb-4">游戏结束</h1>
          <p className="text-xl text-gray-300 mb-8">{getEndingText()}</p>
          <div className="bg-gray-800 rounded-lg p-6 mb-8 space-y-2 text-left">
            <div className="flex justify-between"><span>在位回合</span><span>{state.turn}</span></div>
            <div className="flex justify-between"><span>国库</span><span>{state.resources.treasury}</span></div>
            <div className="flex justify-between"><span>兵力</span><span>{state.resources.military}</span></div>
            <div className="flex justify-between"><span>民心</span><span>{state.resources.morale}</span></div>
            <div className="flex justify-between"><span>粮食</span><span>{state.resources.food}</span></div>
          </div>
          <button onClick={newGame} className="px-8 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-bold">再来一局</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-mono">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-yellow-400">👑 皇帝成长计划</h1>
          <span className="px-2 py-0.5 bg-gray-700 rounded text-sm">第 {state.turn}/{state.maxTurns} 回合</span>
        </div>
        <div className="flex items-center">
          <ResourceBar icon="💰" value={state.resources.treasury} label="国库" />
          <ResourceBar icon="⚔️" value={state.resources.military} label="兵力" />
          <ResourceBar icon="❤️" value={state.resources.morale} max={100} label="民心" />
          <ResourceBar icon="🌾" value={state.resources.food} label="粮食" />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-4">
        {/* Actions remaining */}
        <div className="mb-4 text-center">
          <span className="text-sm text-gray-400">剩余行动点: </span>
          <span className="text-lg font-bold text-yellow-400">{maxActions - actionsUsed}</span>
        </div>

        {/* Event */}
        <AnimatePresence>
          {state.events.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-6"
            >
              <h3 className="font-bold text-red-400 mb-2">⚡ {state.events[0].title}</h3>
              <p className="text-sm text-gray-300 mb-3">{state.events[0].description}</p>
              <div className="flex gap-2">
                {state.events[0].choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleEvent(idx)}
                    className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded border border-gray-600"
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Officials */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-400 mb-2">👥 官员 ({state.officials.length})</h2>
          <div className="flex gap-2 flex-wrap">
            {state.officials.map((off) => (
              <div key={off.id} className="bg-gray-800 px-3 py-2 rounded text-sm">
                <span className="font-bold">{off.name}</span>
                <span className="text-gray-400 ml-2">能力{off.ability} 忠诚{off.loyalty}</span>
              </div>
            ))}
            <button
              onClick={recruitOfficial}
              disabled={actionsUsed >= maxActions || state.resources.treasury < 100}
              className="px-3 py-2 bg-yellow-700/50 hover:bg-yellow-600/50 rounded text-sm disabled:opacity-30"
            >
              + 科举招人 (100💰)
            </button>
          </div>
        </div>

        {/* Decrees */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-400 mb-2">📜 政令</h2>
          <div className="grid grid-cols-2 gap-3">
            {state.decrees.map((decree) => (
              <motion.button
                key={decree.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => issueDecree(decree.id, decree.effects)}
                disabled={actionsUsed >= maxActions}
                className="bg-gray-800 border border-gray-700 hover:border-yellow-500/50 rounded-lg p-3 text-left disabled:opacity-30"
              >
                <div className="font-bold text-sm">{decree.title}</div>
                <div className="text-xs text-gray-400 mt-1">{decree.description}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {Object.entries(decree.effects).map(([k, v]) => (
                    <span key={k} className={`mr-2 ${v > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {v > 0 ? '+' : ''}{v} {k === 'treasury' ? '💰' : k === 'military' ? '⚔️' : k === 'morale' ? '❤️' : k === 'food' ? '🌾' : k}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* End Turn */}
        <div className="text-center">
          <button
            onClick={endTurn}
            className="px-6 py-2 bg-green-700 hover:bg-green-600 rounded-lg font-bold"
          >
            ✅ 结束本回合
          </button>
        </div>
      </main>
    </div>
  );
}
