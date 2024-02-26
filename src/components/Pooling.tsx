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
export default function Pooling() {
  const { ethersProvider } = useWalletContext();
  const { selectedAddress } = useAddressStore();
  const { eoas, credentials, signerId, addCredential, addEoa } = useSignerStore();
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

  /**
   * Compare signers locally and on the contract
   */
  const compareSigner = async () => {
    const owners = await listOwner();
    const ownersList = Object.values(owners);

    if (owners.length > eoas.length + credentials.length) {
      // optimize store
      ownersList.forEach((item: any) => {
        const prefixString = item.slice(0, 26);
        if (parseInt(prefixString) === 0) {
          // is eoa
          const addressToAdd = `0x${item.slice(-40)}`;
          if (!eoas.includes(addressToAdd)) {
            addEoa(addressToAdd);
          }
        } else {
          if (credentials.filter((cre: ICredentialItem) => cre.publicKey === item).length > 0) return;
          // is passkey
          addCredential({
            id: '',
            algorithm: '',
            name: 'Unknown Passkey',
            publicKey: item,
          });
        }
        console.log('1is address', item, isAddress(item), isAddressable(item));
      });
    }
  };

  useEffect(() => {
    if (!selectedAddress || !selectedChainId) return;
    compareSigner();
  }, [selectedAddress, selectedChainId]);

  return <></>;
}
