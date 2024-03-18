/**
 * Pooling for user state
 */

import { useEffect } from 'react';
import { useAddressStore } from '@/store/address';
import { useHistoryStore } from '@/store/history';
import { useBalanceStore } from '@/store/balance';
import useConfig from '@/hooks/useConfig';
import { useChainStore } from '@/store/chain';
import { ICredentialItem, useSignerStore } from '@/store/signer';
import useWalletContext from '@/context/hooks/useWalletContext';
import useWalletContract from '@/hooks/useWalletContract';
import { isAddress, isAddressable } from 'ethers';
import useTools from '@/hooks/useTools';
export default function Pooling() {
  const { ethersProvider, checkActivated } = useWalletContext();
  const { selectedAddress } = useAddressStore();
  const { credentials, signerId, addCredential } = useSignerStore();
  const { fetchHistory } = useHistoryStore();
  const { selectedChainItem } = useConfig();
  const { selectedChainId } = useChainStore();
  const { fetchTokenBalance } = useBalanceStore();
  const { listOwner } = useWalletContract();

  useEffect(() => {
    const { chainIdHex, paymasterTokens } = selectedChainItem;

    if (!selectedAddress || !selectedChainId) {
      return;
    }

    fetchTokenBalance(selectedAddress, chainIdHex, paymasterTokens);
    fetchHistory(selectedAddress, [selectedChainId], ethersProvider);

    const interval = setInterval(() => {
      fetchTokenBalance(selectedAddress, chainIdHex, paymasterTokens);
      fetchHistory(selectedAddress, [selectedChainId], ethersProvider);
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedAddress, selectedChainId]);

  return <></>;
}
