// src/engine/endingEngine.ts - 结局判定引擎

import { GameState, GameStatus } from '@/types/game';

export function checkEnding(state: GameState): GameStatus | null {
  // 失败条件
  if (state.resources.techDebt >= 100) {
    return 'lost'; // 系统崩溃
  }
  if (state.resources.compute <= 0 && state.sprint > 2) {
    return 'lost'; // 资金耗尽
  }
  if (state.resources.morale <= 0) {
    return 'lost'; // 众叛亲离
  }
  if (state.resources.nps <= 0) {
    return 'lost'; // 用户流失
  }

  // 胜利条件 (36 Sprint 后)
  if (state.sprint >= state.config.maxSprints) {
    if (state.resources.nps >= 80 && state.resources.techDebt < 40) {
      return 'won'; // IPO 上市
    }
    if (state.resources.nps >= 70) {
      return 'won'; // 独角兽收购
    }
    return 'lost'; // 佛系 CTO - 没有重大突破
  }

  return null;
}

export function getEndingText(state: GameState): string {
  if (state.resources.techDebt >= 100) {
    return '💀 系统崩溃 - 技术债务爆炸，数据库 corruption，所有用户数据丢失。';
  }
  if (state.resources.compute <= 0) {
    return '📉 资金耗尽 - 云服务被关停，公司关门大吉。';
  }
  if (state.resources.morale <= 0) {
    return '😭 众叛亲离 - 最后一个工程师离职，你独自维护系统。';
  }
  if (state.resources.nps <= 0) {
    return '📉 用户流失 - 所有用户都走了，产品成为废墟。';
  }
  if (state.sprint >= state.config.maxSprints) {
    if (state.resources.nps >= 80 && state.resources.techDebt < 40) {
      return '🏆 IPO 上市 - 你在纳斯达克敲钟，Agent 成为行业标准！';
    }
    if (state.resources.nps >= 70) {
      return '🦄 独角兽收购 - 大厂出价 10 亿美元，你选择财富自由。';
    }
    return '🧘 佛系 CTO - 公司不温不火，但你每天 5 点下班。';
  }
  return '';
}
