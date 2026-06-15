// src/utils/random.ts - 随机数工具

export const random = {
  int(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  pick<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  },

  weightedPick<T extends { weight: number }>(array: T[]): T {
    const totalWeight = array.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    for (const item of array) {
      random -= item.weight;
      if (random <= 0) return item;
    }
    return array[array.length - 1];
  },

  chance(probability: number): boolean {
    return Math.random() < probability;
  },

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },
};
