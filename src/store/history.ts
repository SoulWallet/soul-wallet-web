// import { create } from 'zustand';
// import api from '@/lib/api';
// import { persist } from 'zustand/middleware';
// import { ethers } from 'ethers';
// import IconEth from '@/assets/tokens/eth.svg';
// import scanApi from '@/lib/scanApi';


// const defaultEthBalance: ITokenBalanceItem = {
//   chainId: 1,
//   contractAddress: ethers.ZeroAddress,
//   decimals: 18,
//   logoURI: IconEth,
//   name: 'Ethereum',
//   symbol: 'ETH',
//   tokenBalance: '0',
//   tokenBalanceFormatted: '0',
// };

// export interface IHistoryStore {
//   tokenBalance: ITokenBalanceItem[];
//   nftBalance: INftBalanceItem[];
//   getHistory: (tokenAddress: string) => any;
//   fetchHistory: (address: string, chainId: string, paymasterTokens: string[]) => void;
//   getNftBalance: (tokenAddress: string) => any;
//   fetchNftBalance: (address: string, chainId: number) => void;
// }



// export const useBalanceStore = create<IHistoryStore>()(
//   persist(
//     (set, get) => ({
//       tokenBalance: [defaultEthBalance],
//       nftBalance: [],
//       getHistory: (tokenAddress: string) => {
//         return get().tokenBalance.filter((item: ITokenBalanceItem) => item.contractAddress === tokenAddress)[0];
//       },
//       fetchHistory: async (address: string, chainId: string, paymasterTokens: string[]) => {

//         const res = await scanApi.op.list(selectedAddress, selectedChainId);



//         const res = await api.balance.token({
//           walletAddress: address,
//           chainId,
//           reservedTokenAddresses: paymasterTokens,
//         });

//         const tokenList = res.data.map((item: ITokenBalanceItem) => formatTokenBalance(item));

//         // format balance list here
//         set({ tokenBalance: tokenList });
//       },
//     }),
//     {
//       name: 'history-storage',
//     },
//   ),
// );
