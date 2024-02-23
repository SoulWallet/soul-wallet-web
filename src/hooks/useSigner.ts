/**
 * Used for direct contract interaction
 */

import { useMemo } from 'react';
import { ethers } from 'ethers';
import useConfig from './useConfig';
import { ABI_SoulWallet } from '@soulwallet/abi';
import useWalletContext from '@/context/hooks/useWalletContext';

export default function useSigner() {
  const { selectedChainItem, selectedAddressItem } = useConfig();
  const { ethersProvider } = useWalletContext();

  const publicClient = useMemo(() => {
    if (!selectedChainItem || !selectedAddressItem) return null;
    return new ethers.Contract(selectedAddressItem.address, ABI_SoulWallet, ethersProvider);
  }, [selectedChainItem.chainId, selectedAddressItem.address]);

  const listOwner = async () => {
    if (!publicClient) return;
    return await publicClient.listOwner();
  };

  return { listOwner };
}
