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

  const getUserInfo = () => {
    fetchTokenBalance(selectedAddress, selectedChainId);
    fetchHistory(selectedAddress, selectedChainId);
    fetchInterest(selectedAddress, selectedChainId);
  };

  const getCommonInfo = () => {
    fetchApy();
  };

  useEffect(() => {
    if (!selectedAddress || !selectedChainId) {
      return;
    }
    getUserInfo();
    const interval = setInterval(() => {
      getUserInfo();
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedAddress, selectedChainId]);

  useEffect(() => {
    getCommonInfo();
    const interval = setInterval(() => {
      getCommonInfo();
    }, 6000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <></>;
}
