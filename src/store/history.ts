import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import BN from 'bignumber.js';
import { toFixed } from '@/lib/tools';
import { zeroAddress } from 'viem';

export interface IHistoryStore {
  historyList: any[];
  fetchHistory: (address: string, chainId: string) => void;
  clearHistory: () => void;
}

const ausdcAddress = import.meta.env.VITE_TOKEN_AUSDC;
const usdcAddress = import.meta.env.VITE_TOKEN_USDC;
const autoSaveAddress = import.meta.env.VITE_AaveUsdcSaveAutomation;

export const fetchHistoryApi = async (address: string, chainId: string) => {
  const res = await api.token.history({ address, chainID: chainId });

  const addressLowercase = address.toLowerCase();

  const finalList = res.data.history
    // filter txs
    .filter(
      (historyItem: any) =>
        historyItem.type === 'ERC20_TRANSFER' &&
        historyItem.item.tokenAddress === usdcAddress.toLowerCase() &&
        historyItem.item.from !== ausdcAddress.toLowerCase() &&
        historyItem.item.to !== autoSaveAddress.toLowerCase(),
    )
    .flatMap((historyItem: any) => {
      historyItem.amount = toFixed(BN(historyItem.item.value).shiftedBy(-6).toString(), 2);
      historyItem.tokenSymbol = 'USDC';
      historyItem.dateFormatted = new Date(historyItem.item.blockTimestamp * 1000).toLocaleString();
      if (historyItem.item.from === addressLowercase && historyItem.item.to === addressLowercase) {
        return [
          {
            action: 'Deposit',
            amountFormatted: `+ ${historyItem.amount}`,
          },
          {
            action: 'Transfer',
            amountFormatted: `+ ${historyItem.amount}`,
          },
        ];
      } else if (historyItem.item.to === addressLowercase) {
        historyItem.action = 'Deposit';
        historyItem.amountFormatted = `+ ${historyItem.amount}`;
        return [historyItem];
      } else if (historyItem.item.from === addressLowercase) {
        historyItem.action = 'Transfer';
        historyItem.amountFormatted = `- ${historyItem.amount}`;
        return [historyItem];
      }
    })
    .filter((historyItem: any) => historyItem.action);

  return finalList;
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
