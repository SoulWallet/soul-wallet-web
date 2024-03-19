import { create } from 'zustand';
import api from '@/lib/api';
import { persist } from 'zustand/middleware';
import { ethers } from 'ethers';
import IconDefaultToken from '@/assets/tokens/default.svg';
import IconEth from '@/assets/tokens/eth.svg';
import BN from 'bignumber.js';
import { formatIPFS } from '@/lib/tools';

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

export interface INftBalanceItem {
  address: string;
  tokenId: string;
  balance: number;
  icon: string;
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
  totalUsdValue: string;
  tokenBalance: ITokenBalanceItem[];
  nftBalance: INftBalanceItem[];
  clearBalance: () => void;
  getTokenBalance: (tokenAddress: string) => any;
  fetchTokenBalance: (address: string, chainId: string) => void;
  getNftBalance: (tokenAddress: string) => any;
  fetchNftBalance: (address: string, chainId: number) => void;
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

const formatNftBalance = (item: any) => {
  const ipfsUrl = item.rawMetadata.image;

  return {
    logoURI: formatIPFS(ipfsUrl),
    title: item.title,
    tokenId: item.tokenId,
    balance: item.balance,
    tokenType: item.tokenType,
  };
};

export const useBalanceStore = create<IBalanceStore>()(
  persist(
    (set, get) => ({
      totalUsdValue: '0',
      tokenBalance: [defaultEthBalance],
      nftBalance: [],
      getTokenBalance: (tokenAddress: string) => {
        return get().tokenBalance.filter((item: ITokenBalanceItem) => item.contractAddress === tokenAddress)[0];
      },
      clearBalance: () => {
        set({ tokenBalance: [defaultEthBalance], nftBalance: [], totalUsdValue: '0' });
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
        set({ tokenBalance: tokenList, totalUsdValue: totalUsdValue.toFixed(2) });
      },
      getNftBalance: (tokenAddress: string) => {
        return get().nftBalance.filter((item: INftBalanceItem) => item.address === tokenAddress)[0];
      },
      fetchNftBalance: async (address: string, chainId: number) => {
        const res = await api.balance.nft({
          walletAddress: address,
          chainId: chainId,
        });

        const nftList = res.data.ownedNfts.map((item: any) => formatNftBalance(item));

        set({ nftBalance: nftList });
      },
    }),
    {
      name: 'balance-storage',
    },
  ),
);
