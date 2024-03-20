/**
 * Pooling for user state
 */

import { useEffect } from 'react';
import { useAddressStore } from '@/store/address';
import { useHistoryStore } from '@/store/history';
import { useBalanceStore } from '@/store/balance';
import useConfig from '@/hooks/useConfig';
import { useChainStore } from '@/store/chain';
import useWalletContext from '@/context/hooks/useWalletContext';
export default function Pooling() {
  const { ethersProvider } = useWalletContext();
  const { selectedAddress } = useAddressStore();
  const { fetchHistory } = useHistoryStore();
  const { selectedChainItem } = useConfig();
  const { selectedChainId } = useChainStore();
  const { fetchTokenBalance } = useBalanceStore();

  useEffect(() => {
    const { chainIdHex } = selectedChainItem;

    if (!selectedAddress || !selectedChainId) {
      return;
    }

    fetchTokenBalance(selectedAddress, chainIdHex);
    // fetchHistory(selectedAddress, [selectedChainId], ethersProvider);

    const interval = setInterval(() => {
      fetchTokenBalance(selectedAddress, chainIdHex);
      // fetchHistory(selectedAddress, [selectedChainId], ethersProvider);
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedAddress, selectedChainId]);

  return <></>;
}
