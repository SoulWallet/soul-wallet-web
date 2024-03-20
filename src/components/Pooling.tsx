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

    fetchTokenBalance(selectedAddress, selectedChainId);
    fetchHistory(selectedAddress, selectedChainId);

    const interval = setInterval(() => {
      fetchTokenBalance(selectedAddress, selectedChainId);
      fetchHistory(selectedAddress, selectedChainId);
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedAddress, selectedChainId]);

  return <></>;
}
