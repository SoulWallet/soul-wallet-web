import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

export interface IHistoryStore {
  historyList: any[];
  fetchHistory: (address: string, chainId: string) => void;
  clearHistory: () => void;
}

export const fetchHistoryApi = async (address: string, chainId: string) => {
  const res = await api.token.history({ address, chainID: chainId });

  res.data.history.forEach((historyItem: any) => {
    historyItem.tokenSymbol = [
      String(import.meta.env.VITE_TOKEN_AUSDC).toLowerCase(),
      String(import.meta.env.VITE_TOKEN_USDC).toLowerCase(),
    ].includes(historyItem.item.tokenAddress.toLowerCase())
      ? 'USDC'
      : 'Unknown';
    if (historyItem.type === 'ERC20_TRANSFER') {
      if (historyItem.item.from !== address && historyItem.item.to === address) {
        historyItem.action = 'Deposit';
      } else if (historyItem.item.from === address && historyItem.item.to !== address) {
        historyItem.action = 'Withdraw';
      }
    }
  });

  // IMPORTANT TODO, cache decode result
  // for (let i = 0; i < res.data.ops.length; i++) {
  //   const item = res.data.ops[i];
  //   // decode calldata
  //   const callDataDecodes = await decodeCalldata(item.chainId, item.entrypointAddress, item.userOp, ethersProvider);

  //   const functionName = callDataDecodes
  //     .map((item: any) => item.functionName || (item.method && item.method.name))
  //     .join(', ');

  //   res.data.ops[i] = {
  //     ...res.data.ops[i],
  //     functionName,
  //     to: callDataDecodes[0].to,
  //   };
  // }

  console.log('history', res.data.history);

  return res.data.history;
};

export const useHistoryStore = create<IHistoryStore>()(
  persist(
    (set, get) => ({
      historyList: [],
      fetchHistory: async (address: string, chainId: string) => {
        const res: any = await fetchHistoryApi(address, chainId);
        set({ historyList: res });
      },
      clearHistory: () => {
        set({
          historyList: [],
        });
      },
    }),
    {
      name: 'history-storage',
    },
  ),
);
