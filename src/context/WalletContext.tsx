import { createContext, useState, useEffect, createRef, useMemo } from 'react';
import { ethers } from 'ethers';
import { L1KeyStore } from '@soulwallet/sdk';
import SignTransactionModal from '@/components/SignTransactionModal';
import SignPaymentModal from '@/components/SignPaymentModal';
import SignMessageModal from '@/components/SignMessageModal';
import useConfig from '@/hooks/useConfig';
import { useCredentialStore } from '@/store/credential';
import usePassKey from '@/hooks/usePasskey';
import api from '@/lib/api';
import { useGuardianStore } from '@/store/guardian';
import { useChainStore } from '@/store/chain';
import { useAddressStore } from '@/store/address';

interface IWalletContext {
  ethersProvider: ethers.JsonRpcProvider;
  showSign: () => Promise<void>;
  showSignTransaction: (txns: any, origin?: string, sendTo?: string) => Promise<void>;
  showSignPayment: (txns: any, origin?: string, sendTo?: string) => Promise<void>;
  showSignMessage: (messageToSign: any, origin?: string) => Promise<void>;
  checkActivated: () => Promise<boolean>;
}

export const WalletContext = createContext<IWalletContext>({
  ethersProvider: new ethers.JsonRpcProvider(),
  showSign: async () => {},
  showSignTransaction: async () => {},
  showSignPayment: async () => {},
  showSignMessage: async () => {},
  checkActivated: async () => false,
});

export const WalletContextProvider = ({ children }: any) => {
  const { selectedChainItem } = useConfig();
  const { getCoordinates } = usePassKey();
  const { recoveringGuardiansInfo, setGuardiansInfo, updateRecoveringGuardiansInfo } = useGuardianStore();
  const recoveryRecordID = recoveringGuardiansInfo.recoveryRecordID;
  const { setSelectedChainId, selectedChainId, updateChainItem } = useChainStore();
  const [recoverCheckInterval, setRecoverCheckInterval] = useState<any>();
  const { addressList, addAddressItem, selectedAddress, getIsActivated, setSelectedAddress, toggleActivatedChain } =
    useAddressStore();
  const credentials = recoveringGuardiansInfo.credentials

  const signModal = createRef<any>();
  const signTransactionModal = createRef<any>();
  const signPaymentModal = createRef<any>();
  const signMessageModal = createRef<any>();

  const ethersProvider = useMemo(() => {
    if (!selectedChainItem) {
      return new ethers.JsonRpcProvider();
    }
    return new ethers.JsonRpcProvider(selectedChainItem.provider);
  }, [selectedChainItem]);

  const checkRecoverStatus = async () => {
    const res = (await api.guardian.getRecoverRecord({ recoveryRecordID })).data;
    updateRecoveringGuardiansInfo({
      recoveryRecord: res,
    });
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
    if (res.status >= 3) {
      const currentKeysRaw = await Promise.all(credentials.map((credential: any) => getCoordinates(credential.publicKey)))
      const currentKeys = L1KeyStore.initialKeysToAddress(currentKeysRaw);
      const currentKeyHash = L1KeyStore.getKeyHash(currentKeys);
      const newKeyHash = L1KeyStore.getKeyHash(res.newOwners);
      if(newKeyHash !== currentKeyHash){
        setGuardiansInfo({
          guardians: recoveringGuardiansInfo.guardians,
          guardianNames: recoveringGuardiansInfo.guardianNames,
          threshold: recoveringGuardiansInfo.threshold,
        });
      }
    }

    // recover process finished
    if (res.status === 4) {
      updateRecoveringGuardiansInfo({
        recoveryRecordID: null,
      });
    }

    const chainRecoverStatus = res.statusData.chainRecoveryStatus;
    for (let item of chainRecoverStatus) {
      updateChainItem(item.chainId, {
        recovering: item.status === 0,
      });
    }

    // IMPORTANT TODO, Judge first available chain and set as default
    if (
      chainRecoverStatus.length &&
      chainRecoverStatus.filter((item: any) => item.status === 1).length === 0
    ) {
      // setSelectedChainId(chainRecoverStatus.filter((item: any) => item.status)[0].chainId);
    }
  };

  useEffect(() => {
    if (!recoveryRecordID) {
      return;
    }

    checkRecoverStatus();

    const interval = setInterval(checkRecoverStatus, 5000);

    setRecoverCheckInterval(interval);

    return () => {
      clearInterval(recoverCheckInterval);
    };
  }, [recoveryRecordID]);

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
    return res;
  };

  const showSign = async () => {
    await signModal.current.show();
  };

  const showSignTransaction = async (txns: any, origin?: string, sendTo?: string) => {
    console.log('show sign transac');
    return await signTransactionModal.current.show(txns, origin, sendTo);
  };

  const showSignPayment = async (txns: any, origin?: string, sendTo?: string) => {
    console.log('show sign payment');
    return await signPaymentModal.current.show(txns, origin, sendTo);
  };

  const showSignMessage = async (messageToSign: string, origin?: string) => {
    return await signMessageModal.current.show(messageToSign, origin);
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
        showSign,
        showSignTransaction,
        showSignMessage,
        showSignPayment,
        checkActivated,
      }}
    >
      {children}
      <SignTransactionModal ref={signTransactionModal} />
      <SignPaymentModal ref={signPaymentModal} />
      <SignMessageModal ref={signMessageModal} />
    </WalletContext.Provider>
  );
};

export const WalletContextConsumer = WalletContext.Consumer;
