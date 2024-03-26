import { create } from 'zustand';
import api from '@/lib/api';
import { persist } from 'zustand/middleware';
import { ethers } from 'ethers';
import IconDefaultToken from '@/assets/tokens/default.svg';
import IconEth from '@/assets/tokens/eth.svg';
import BN from 'bignumber.js';
import { usdcArbPoolReserveId } from '@/config/constants';

export interface ITokenBalanceItem {
  chainID: string;
  contractAddress: string;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
  tokenBalance: string;
  tokenBalanceFormatted: string;
  tokenPrice: string;
  usdValue?: string;
  type?: number;
}

const defaultEthBalance: ITokenBalanceItem = {
  chainID: '1',
  contractAddress: ethers.ZeroAddress,
  decimals: 18,
  logoURI: IconEth,
  name: 'Ethereum',
  symbol: 'ETH',
  tokenBalance: '0',
  tokenBalanceFormatted: '0',
  tokenPrice: '0',
  usdValue: '0',
};

export interface IBalanceStore {
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  fetchFeeData: (provider: any) => void;
  sevenDayApy: string;
  fetchApy: () => void;
  oneDayInterest: string;
  totalInterest: string;
  fetchInterest: (address: string, chainID: string) => void;
  totalUsdValue: string;
  tokenBalance: ITokenBalanceItem[];
  clearBalance: () => void;
  getTokenBalance: (tokenAddress: string) => any;
  fetchTokenBalance: (address: string, chainId: string) => void;
}

export interface priceMapping {
  [address: string]: number;
}

export const formatTokenBalance = (item: ITokenBalanceItem) => {
  if (!item.logoURI) {
    item.logoURI = IconDefaultToken;
  }
  if (!item.symbol) {
    item.symbol = 'Unknown';
  }
  if (!item.name) {
    item.name = 'Unknown';
  }
  if (item.tokenBalance) {
    item.tokenBalanceFormatted = ethers.formatUnits(item.tokenBalance, item.decimals);
  }
  return item;
};

export const useBalanceStore = create<IBalanceStore>()(
  persist(
    (set, get) => ({
      maxFeePerGas: "0x",
      maxPriorityFeePerGas: "0x",
      totalUsdValue: '0',
      apy: '0',
      sevenDayApy: '0',
      oneDayInterest: '0',
      totalInterest: '0',
      fetchFeeData: async (provider) => {
        const feeData = await provider.getFeeData();
        set({
          maxFeePerGas: `0x${feeData.maxFeePerGas?.toString(16)}`,
          maxPriorityFeePerGas: `0x${feeData.maxPriorityFeePerGas?.toString(16)}`,
        })
      },
      fetchApy: async () => {
        const res = await api.aave.apy({
          reserveId: usdcArbPoolReserveId,
          resolutionInHours: 6,
        });

        const latest7Days = res.data.slice(326);

        const totalApy = latest7Days.reduce((acc: number, cur: any) => {
          return acc + cur.liquidityRate_avg;
        }, 0);

        set({ sevenDayApy: ((totalApy / latest7Days.length) * 100).toFixed(2) });
      },
      fetchInterest: async (address, chainID) => {
        const res = await api.token.interest({
          chainID,
          address,
          // 24 hours before
          startTime: Math.floor(Date.now() / 1000) - 24 * 60 * 60,
        });

        set({ oneDayInterest: res.data.interest });
      },
      tokenBalance: [defaultEthBalance],
      nftBalance: [],
      getTokenBalance: (tokenAddress: string) => {
        return get().tokenBalance.filter((item: ITokenBalanceItem) => item.contractAddress.toLowerCase() === tokenAddress.toLowerCase())[0];
      },
      clearBalance: () => {
        set({ tokenBalance: [defaultEthBalance], totalUsdValue: '0' });
      },
      fetchTokenBalance: async (address: string, chainId: string) => {
        if (!address || !chainId) {
          return;
        }

        const res = await api.token.balance({
          address,
          chainID: chainId,
        });
        // const resPrice = await api.price.token({});
        // const targetedItem = resPrice.data.filter((item: any) => item.chainID === chainId)[0];
        let totalUsdValue = BN('0');
        const tokenList = res.data.balances.map((item: ITokenBalanceItem) => {
          let formattedItem = formatTokenBalance(item);
          totalUsdValue = totalUsdValue.plus(item.tokenBalanceFormatted);
          return formattedItem;
        });
        // format balance list here
        set({ tokenBalance: tokenList, totalUsdValue: totalUsdValue.toString() });
      },
    }),
    {
      name: 'balance-storage',
    },
  ),
);
