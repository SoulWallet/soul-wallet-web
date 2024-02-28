/**
 * Used for direct contract interaction
 */

import { useMemo } from 'react';
import { ethers } from 'ethers';
import useConfig from './useConfig';
import { ABI_SoulWallet } from '@soulwallet/abi';
import useWalletContext from '@/context/hooks/useWalletContext';

export default function useWalletContract() {
  const { selectedChainItem, selectedAddressItem } = useConfig();
  const { ethersProvider, checkActivated } = useWalletContext();

  const publicClient = useMemo(() => {
    if (!selectedChainItem || !selectedAddressItem) return null;
    return new ethers.Contract(selectedAddressItem.address, ABI_SoulWallet, ethersProvider);
  }, [selectedChainItem?.chainId, selectedAddressItem?.address]);

  const listOwner = async () => {
    if (!publicClient || !checkActivated()) return;
    return await publicClient.listOwner();
  };

  const listOwnerByAddress = async (rpc: string, address: string) => {
    const provider = new ethers.JsonRpcProvider(rpc);
    const client = new ethers.Contract(address, ABI_SoulWallet, provider);
    return await client.listOwner();
  };

  return { listOwner, listOwnerByAddress };
}
