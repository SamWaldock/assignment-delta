import { create } from 'zustand';

interface CoinStore {
  lastUpdatedTimestamps: Record<string, number>;
  setLastUpdated: (coinId: string) => void;
  getLastUpdated: (coinId: string) => number | undefined;
}

export const useCoinStore = create<CoinStore>((set, get) => ({
  lastUpdatedTimestamps: {},
  setLastUpdated: (coinId: string) =>
    set((state) => ({
      lastUpdatedTimestamps: {
        ...state.lastUpdatedTimestamps,
        [coinId]: Date.now(),
      },
    })),
  getLastUpdated: (coinId: string) => get().lastUpdatedTimestamps[coinId],
}));
