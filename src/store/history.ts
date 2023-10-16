import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import scanApi from '@/lib/scanApi';

export interface IHistoryStore {
  historyList: any[];
  //   getHistory: (tokenAddress: string) => any;
  fetchHistory: (address: string, chainId: string) => void;
}

export const useHistoryStore = create<IHistoryStore>()(
  persist(
    (set, get) => ({
      historyList: [],
      fetchHistory: async (address: string, chainId: string) => {
        const res = await scanApi.op.list(address, chainId);
        set({ historyList: res.data.ops });
      },
    }),
    {
      name: 'history-storage',
    },
  ),
);
