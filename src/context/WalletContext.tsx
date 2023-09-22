import React, { createContext, useState, useEffect, createRef, useMemo } from 'react';
import { ethers } from 'ethers';
import SignModal from '@/components/SignModal';
import useKeyring from '@/hooks/useKeyring';
import useConfig from '@/hooks/useConfig';
import api from '@/lib/api';
import { useGuardianStore } from '@/store/guardian';
import { useChainStore } from '@/store/chain';
import { useAddressStore } from '@/store/address';

interface IWalletContext {
  ethersProvider: ethers.JsonRpcProvider;
  account: string;
  getAccount: () => Promise<void>;
  replaceAddress: () => Promise<void>;
}

export const WalletContext = createContext<IWalletContext>({
  ethersProvider: new ethers.JsonRpcProvider(),
  account: '',
  getAccount: async () => {},
  replaceAddress: async () => {},
});

export const WalletContextProvider = ({ children }: any) => {
  const { selectedChainItem } = useConfig();
  const [account, setAccount] = useState<string>('');
  const {
    recoverRecordId,
    setRecoverRecordId,
    setGuardians,
    recoveringGuardians,
    setGuardianNames,
    recoveringGuardianNames,
    setThreshold,
    recoveringThreshold,
  } = useGuardianStore();
  const { setSelectedChainId, selectedChainId, updateChainItem } = useChainStore();
  const [recoverCheckInterval, setRecoverCheckInterval] = useState<any>();
  const { addressList, addAddressItem, selectedAddress, getIsActivated, setSelectedAddress, toggleActivatedChain } =
    useAddressStore();

  const signModal = createRef<any>();
  const keystore = useKeyring();

  const ethersProvider = useMemo(() => {
    if (!selectedChainItem) {
      return new ethers.JsonRpcProvider();
    }
    return new ethers.JsonRpcProvider(selectedChainItem.provider);
  }, [selectedChainItem]);

  const getAccount = async () => {
   
  };

  const replaceAddress = async () => {
    await keystore.replaceAddress();
    await getAccount();
  };

  const checkRecoverStatus = async () => {
    const res = (await api.guardian.getRecoverRecord({ recoveryRecordID: recoverRecordId })).data;
    const { addressList } = useAddressStore.getState();
    console.log('addresslist is:', addressList);
    if (addressList.length === 0) {
      // IMPORTANT TODO, the order??
      for (let [index, item] of Object.entries(res.addresses)) {
        addAddressItem({
          title: `Account ${index + 1}`,
          address: item as any,
          activatedChains: [],
          allowedOrigins: [],
        });
      }
      setSelectedAddress(res.addresses[0]);
    }

    // check if should replace key
    if (res.status >= 3 && account !== `0x${res.newKey.slice(-40)}`) {
      replaceAddress();
      setGuardians(recoveringGuardians);
      setGuardianNames(recoveringGuardianNames);
      setThreshold(recoveringThreshold);
    }

    // recover process finished
    if (res.status === 4) {
      setRecoverRecordId(null);
    }

    const chainRecoverStatus = res.statusData.chainRecoveryStatus;
    for (let item of chainRecoverStatus) {
      updateChainItem(item.chainId, {
        recovering: item.status === 0,
      });
    }

    // IMPORTANT TODO, Judge first available chain and set as default
    if (
      chainRecoverStatus.filter((item: any) => item.chainId === selectedChainItem.chainIdHex && item.status === 1)
        .length === 0
    ) {
      setSelectedChainId(chainRecoverStatus.filter((item: any) => item.status)[0].chainId);
    }
  };

  useEffect(() => {
    getAccount();
  }, []);

  useEffect(() => {
    if (!recoverRecordId) {
      return;
    }

    checkRecoverStatus();

    const interval = setInterval(checkRecoverStatus, 5000);

    setRecoverCheckInterval(interval);

    return () => {
      clearInterval(recoverCheckInterval);
    };
  }, [recoverRecordId]);

  const checkActivated = async () => {
    const res = getIsActivated(selectedAddress, selectedChainId);
    if (!res) {
      const contractCode = await ethersProvider.getCode(selectedAddress);
      console.log('check code result', res);
      // is already activated
      if (contractCode !== '0x') {
        toggleActivatedChain(selectedAddress, selectedChainId, true);
      }
    }
  };

  // if address on chain is not activated, check again
  useEffect(() => {
    if (!selectedAddress || !selectedChainId) {
      return;
    }
    checkActivated();
  }, [selectedAddress, selectedChainId]);

  return (
    <WalletContext.Provider
      value={{
        ethersProvider,
        account,
        getAccount,
        replaceAddress,
      }}
    >
      {children}
      <SignModal ref={signModal} />
    </WalletContext.Provider>
  );
};

export const WalletContextConsumer = WalletContext.Consumer;
