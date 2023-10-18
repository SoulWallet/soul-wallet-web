import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import scanApi from '@/lib/scanApi';
import { decodeCalldata } from '@/lib/tools';
import { ActivityStatusEn } from '@/pages/wallet/comp/Activity/comp/ActivityItem';

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

        // IMPORTANT TODO, cache decode result
        for (let i = 0; i < res.data.ops.length; i++) {
          const item = res.data.ops[i];
          // decode calldata
          const callDataDecodes = await decodeCalldata(item.chainId, item.entrypointAddress, item.userOp);
          // TODO, skip decode when exists in store
          // console.log('activity decoded', callDataDecodes);

          const functionName = callDataDecodes.map((item: any) => item.functionName || item.method.name).join(', ');

          const status = item.success ? ActivityStatusEn.Success : ActivityStatusEn.Error;

          res.data.ops[i] = {
            ...res.data.ops[i],
            functionName,
            to: callDataDecodes[0].to,
            status,
          };
        }

        set({ historyList: res.data.ops });
      },
    }),
    {
      name: 'history-storage',
    },
  ),
);
