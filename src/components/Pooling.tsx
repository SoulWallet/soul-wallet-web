/**
 * Pooling for user state
 */

import { useEffect } from 'react';
import { useAddressStore } from '@/store/address';
import { useHistoryStore } from '@/store/history';
import { useBalanceStore } from '@/store/balance';
import { useChainStore } from '@/store/chain';
export default function Pooling() {
  const { selectedAddress } = useAddressStore();
  const { fetchHistory } = useHistoryStore();
  const { selectedChainId } = useChainStore();
  const { fetchTokenBalance, fetchApy, fetchInterest } = useBalanceStore();

  const getPoolingInfo = () => {
    fetchTokenBalance(selectedAddress, selectedChainId);
    fetchHistory(selectedAddress, selectedChainId);
    fetchInterest(selectedAddress, selectedChainId);
    fetchApy();
  };

  useEffect(() => {
    if (!selectedAddress || !selectedChainId) {
      return;
    }
    getPoolingInfo();
    const interval = setInterval(() => {
      getPoolingInfo();
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedAddress, selectedChainId]);

  return <></>;
}
