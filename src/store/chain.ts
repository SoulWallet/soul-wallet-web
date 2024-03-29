import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import config from '@/config';
import BN from 'bignumber.js';

interface IChainItem {
  chainId: number;
  chainIdHex: string;
  chainName: string;
  icon: any;
  iconSquare?: any;
  contracts: any;
  provider: string;
  bundlerUrl: string;
  addressPrefix: string;
}

interface IChainStore {
  selectedChainId: string;
  chainList: IChainItem[];
  getSelectedChainItem: () => any;
  getChainItem: (chainId: string) => any;
  setSelectedChainId: (chainId: string) => void;
  updateChainItem: (chainId: string, chainItem: Partial<IChainItem>) => void;
  clearChainStore: () => void;
}

const getIndexByChainId = (chainList: IChainItem[], chainId: string) => {
  if(!chainList || !chainList.length || !chainId) return -1;
  return chainList.findIndex((item: IChainItem) => BN(item.chainIdHex).isEqualTo(chainId));
};

const createChainSlice = immer<IChainStore>((set, get) => ({
  // default first one
  selectedChainId: config.chainList[0].chainIdHex,
  chainList: config.chainList,
  getChainItem: (chainId: string) => {
    const index = getIndexByChainId(get().chainList, chainId);
    return get().chainList[index];
  },
  getSelectedChainItem: () => {
    const index = getIndexByChainId(get().chainList, get().selectedChainId);
    return get().chainList[index];
  },
  setSelectedChainId: (chainId: string) =>
    set({
      selectedChainId: chainId,
    }),
  updateChainItem: (chainId: string, chainItem: Partial<IChainItem>) => {
    set((state) => {
      const index = getIndexByChainId(state.chainList, chainId);
      const item = state.chainList.filter((item: IChainItem) => item.chainIdHex === chainId)[0];
      const itemToSet = {
        ...item,
        ...chainItem,
      };
      state.chainList[index] = itemToSet;
    });
  },
  clearChainStore: () => {
    set({
      selectedChainId: config.chainList[0].chainIdHex,
      chainList: config.chainList,
    });
  },
}));

export const useChainStore = create<IChainStore>()(
  persist((...set) => ({ ...createChainSlice(...set) }), {
    name: 'chain-storage',
    version: 5,
    // partialize: (state) => ({ selectedChainId: state.selectedChainId }),
  }),
);
