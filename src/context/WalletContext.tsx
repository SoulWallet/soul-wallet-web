import { createContext, useState, useEffect, useRef, useMemo } from 'react';
import { ethers } from 'ethers';
import SignTransactionModal from '@/components/SignTransactionModal';
import ConfirmPaymentModal from '@/components/ConfirmPaymentModal';
import SignMessageModal from '@/components/SignMessageModal';
import ClaimAssetsModal from '@/components/ClaimAssetsModal';
import LogoutModal from '@/components/LogoutModal';
import TestGuideModal from '@/components/TestGuideModal';
import FeedbackModal from '@/components/FeedbackModal';
import SendModal from '@/components/SendModal';
import ReceiveModal from '@/components/ReceiveModal';
import SetGuardianHintModal from '@/components/SetGuardianHintModal';
import useConfig from '@/hooks/useConfig';
import { useTempStore } from '@/store/temp';
import { useChainStore } from '@/store/chain';
import { useAddressStore } from '@/store/address';
import useWallet from '@/hooks/useWallet';

interface IWalletContext {
  ethersProvider: any;
  showSignTransaction: (txns: any, origin?: string, sendTo?: string) => Promise<void>;
  showConfirmPayment: (fee: any, origin?: string, sendTo?: string) => Promise<void>;
  showClaimAssets: () => Promise<void>;
  showTestGuide: () => Promise<void>;
  showSignMessage: (messageToSign: any, signType?: string) => Promise<any>;
  showReceive: () => Promise<void>;
  showSend: (tokenAddress?: string, transferType?: string) => Promise<void>;
  showFeedback: () => Promise<void>;
  showLogout: (_redirectUrl?: string) => Promise<void>;
  showSetGuardianHintModal: () => Promise<void>;
  checkActivated: () => Promise<boolean | undefined>;
}

export const WalletContext = createContext<IWalletContext>({
  ethersProvider: new ethers.JsonRpcProvider(),
  showSignTransaction: async () => {},
  showConfirmPayment: async () => {},
  showSignMessage: async () => {},
  showReceive: async () => {},
  showSend: async () => {},
  showClaimAssets: async () => {},
  showFeedback: async () => {},
  showLogout: async (_redirectUrl?: any) => {},
  showTestGuide: async () => {},
  checkActivated: async () => false,
  showSetGuardianHintModal: async () => {},
});

export const WalletContextProvider = ({ children }: any) => {
  console.log('Render WalletContext');
  const { selectedChainItem } = useConfig();
  const { checkRecoverStatus } = useWallet();
  const { recoverInfo } = useTempStore();
  const { selectedChainId } = useChainStore();
  const { selectedAddress, getIsActivated, toggleActivatedChain } = useAddressStore();
  const signTransactionModal = useRef<any>();
  const confirmPaymentModal = useRef<any>();
  const signMessageModal = useRef<any>();
  const receiveModal = useRef<any>();
  const sendModal = useRef<any>();
  const claimAssetsModal = useRef<any>();
  const logoutModal = useRef<any>();
  const testGuideModal = useRef<any>();
  const feedbackModal = useRef<any>();
  const setGuardianHintModal = useRef<any>();

  const ethersProvider = useMemo(() => {
    console.log('trigger ethers provider');
    if (!selectedChainItem) {
      return new ethers.JsonRpcProvider();
    }
    return new ethers.JsonRpcProvider(selectedChainItem.provider);
  }, [selectedChainItem]);

  useEffect(() => {
    const recoveryRecordID = recoverInfo.recoveryRecordID;

    if (!recoveryRecordID) {
      return;
    }

    checkRecoverStatus();

    const interval = setInterval(() => checkRecoverStatus(), 5000);

    return () => {
      clearInterval(interval);
    };
  }, [recoverInfo.recoveryRecordID]);

  const checkActivated = async () => {
    const res = getIsActivated(selectedAddress, selectedChainId);
    if (!res) {
      const contractCode = await ethersProvider.getCode(selectedAddress);
      console.log('check code result', contractCode);
      // is already activated
      if (contractCode !== '0x') {
        toggleActivatedChain(selectedAddress, selectedChainId, true);
        return true;
      }
    }
    return res;
  };

  const showSignTransaction = async (
    txns: any,
    origin?: string,
    sendTo?: string,
    // showSelectChain?: boolean,
    // showAmount?: string,
  ) => {
    return await signTransactionModal.current.show(txns, origin, sendTo);
  };

  const showConfirmPayment = async (fee: any, origin?: string, sendTo?: string) => {
    return await confirmPaymentModal.current.show(fee, origin, sendTo);
  };

  const showSignMessage = async (messageToSign: string, signType?: string) => {
    return await signMessageModal.current.show(messageToSign, signType);
  };

  const showReceive = async () => {
    return await receiveModal.current.show();
  };

  const showSend = async (tokenAddress?: string, transferType?: string) => {
    return await sendModal.current.show(tokenAddress, transferType);
  };

  const showClaimAssets = async () => {
    return await claimAssetsModal.current.show();
  };

  const showTestGuide = async () => {
    return await testGuideModal.current.show();
  };

  const showFeedback = async () => {
    return await feedbackModal.current.show();
  };

  const showLogout = async (_redirectUrl: any) => {
    return await logoutModal.current.show(_redirectUrl);
  };

  const showSetGuardianHintModal = async () => {
    return await setGuardianHintModal.current.show();
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
        showConfirmPayment,
        showReceive,
        showSend,
        showClaimAssets,
        showLogout,
        showTestGuide,
        showFeedback,
        checkActivated,
        showSetGuardianHintModal,
      }}
    >
      {children}
      {/** todo, move to another component **/}
      <SignTransactionModal ref={signTransactionModal} />
      <ConfirmPaymentModal ref={confirmPaymentModal} />
      <SignMessageModal ref={signMessageModal} />
      <ClaimAssetsModal ref={claimAssetsModal} />
      <ReceiveModal ref={receiveModal} />
      <SendModal ref={sendModal} />
      <TestGuideModal ref={testGuideModal} />
      <FeedbackModal ref={feedbackModal} />
      <SetGuardianHintModal ref={setGuardianHintModal} />
      <LogoutModal ref={logoutModal} />
    </WalletContext.Provider>
  );
};

export const WalletContextConsumer = WalletContext.Consumer;
