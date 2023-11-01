import { createContext, useState, useEffect, createRef, useMemo } from 'react';
import { ethers } from 'ethers';
import { L1KeyStore } from '@soulwallet/sdk';
import SignTransactionModal from '@/components/SignTransactionModal';
import SignPaymentModal from '@/components/SignPaymentModal';
import SignMessageModal from '@/components/SignMessageModal';
import useConfig from '@/hooks/useConfig';
import { useCredentialStore } from '@/store/credential';
import { useBalanceStore } from '@/store/balance';
import api from '@/lib/api';
import { useGuardianStore } from '@/store/guardian';
import { useChainStore } from '@/store/chain';
import { useAddressStore } from '@/store/address';
import useWallet from '@/hooks/useWallet';

interface IWalletContext {
  ethersProvider: ethers.JsonRpcProvider;
  showSignTransaction: (
    txns: any,
    origin?: string,
    sendTo?: string,
    showSelectChain?: boolean,
    showAmount?: string,
  ) => Promise<void>;
  showSignPayment: (txns: any, origin?: string, sendTo?: string) => Promise<void>;
  showSignMessage: (messageToSign: any, origin?: string) => Promise<void>;
  checkActivated: () => Promise<boolean>;
}

export const WalletContext = createContext<IWalletContext>({
  ethersProvider: new ethers.JsonRpcProvider(),
  showSignTransaction: async () => {},
  showSignPayment: async () => {},
  showSignMessage: async () => {},
  checkActivated: async () => false,
});

export const WalletContextProvider = ({ children }: any) => {
  console.log('Render WalletContext');
  const { selectedChainItem } = useConfig();
  const { checkRecoverStatus } = useWallet();
  const { recoveringGuardiansInfo } = useGuardianStore();
  const recoveryRecordID = recoveringGuardiansInfo.recoveryRecordID;
  const { selectedChainId } = useChainStore();
  const [recoverCheckInterval, setRecoverCheckInterval] = useState<any>();
  const { selectedAddress, getIsActivated, toggleActivatedChain } = useAddressStore();
  const signTransactionModal = createRef<any>();
  const signPaymentModal = createRef<any>();
  const signMessageModal = createRef<any>();

  const ethersProvider = useMemo(() => {
    console.log('trigger ethers provider');
    if (!selectedChainItem) {
      return new ethers.JsonRpcProvider();
    }
    return new ethers.JsonRpcProvider(selectedChainItem.provider);
  }, [selectedChainItem]);

  useEffect(() => {
    console.log('recover id',recoveryRecordID )
    if (!recoveryRecordID) {
      return;
    }

    console.log('check recover status', recoveryRecordID);

    checkRecoverStatus(recoveryRecordID);

    const interval = setInterval(() => checkRecoverStatus(recoveryRecordID), 5000);

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

  const showSignTransaction = async (
    txns: any,
    origin?: string,
    sendTo?: string,
    showSelectChain?: boolean,
    showAmount?: string,
  ) => {
    return await signTransactionModal.current.show(txns, origin, sendTo, showSelectChain, showAmount);
  };

  const showSignPayment = async (txns: any, origin?: string, sendTo?: string) => {
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
