import { createContext, useState, useEffect, useRef, useMemo } from 'react';
import { ethers } from 'ethers';
import SignTransactionModal from '@/components/SignTransactionModal';
import ConfirmPaymentModal from '@/components/ConfirmPaymentModal';
import SignMessageModal from '@/components/SignMessageModal';
import LogoutModal from '@/components/LogoutModal';
import SendModal from '@/components/SendModal';
import ReceiveModal from '@/components/ReceiveModal';
import useConfig from '@/hooks/useConfig';
import { useChainStore } from '@/store/chain';
import { useAddressStore } from '@/store/address';

interface IWalletContext {
  ethersProvider: any;
  showSignTransaction: (txns: any, origin?: string, sendTo?: string) => Promise<void>;
  showConfirmPayment: (fee: any, origin?: string, sendTo?: string) => Promise<void>;
  showSignMessage: (messageToSign: any, signType?: string, guardianInfo?: any) => Promise<any>;
  showReceive: () => Promise<void>;
  showSend: (tokenAddress?: string, transferType?: string) => Promise<void>;
  showLogout: (_redirectUrl?: string) => Promise<void>;
  checkActivated: () => Promise<boolean | undefined>;
}

export const WalletContext = createContext<IWalletContext>({
  ethersProvider: new ethers.JsonRpcProvider(),
  showSignTransaction: async () => {},
  showConfirmPayment: async () => {},
  showSignMessage: async () => {},
  showReceive: async () => {},
  showSend: async () => {},
  showLogout: async (_redirectUrl?: any) => {},
  checkActivated: async () => false,
});

export const WalletContextProvider = ({ children }: any) => {
  console.log('Render WalletContext');
  const { selectedChainItem } = useConfig();
  const { selectedChainId } = useChainStore();
  const { selectedAddress, getIsActivated, toggleActivatedChain } = useAddressStore();
  const signTransactionModal = useRef<any>();
  const confirmPaymentModal = useRef<any>();
  const signMessageModal = useRef<any>();
  const receiveModal = useRef<any>();
  const sendModal = useRef<any>();
  const logoutModal = useRef<any>();

  const ethersProvider = useMemo(() => {
    console.log('trigger ethers provider');
    if (!selectedChainItem) {
      return new ethers.JsonRpcProvider();
    }
    return new ethers.JsonRpcProvider(selectedChainItem.provider);
  }, [selectedChainItem]);


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

  const showSignTransaction = async (txns: any, origin?: string, sendTo?: string) => {
    return await signTransactionModal.current.show(txns, origin, sendTo);
  };

  const showConfirmPayment = async (fee: any, origin?: string, sendTo?: string) => {
    return await confirmPaymentModal.current.show(fee, origin, sendTo);
  };

  const showSignMessage = async (messageToSign: string, signType?: string, guardianInfo?: any) => {
    console.log('G', guardianInfo)

    return await signMessageModal.current.show(messageToSign, signType, guardianInfo);
  };

  const showReceive = async () => {
    return await receiveModal.current.show();
  };

  const showSend = async (tokenAddress?: string, transferType?: string) => {
    return await sendModal.current.show(tokenAddress, transferType);
  };

  const showLogout = async (_redirectUrl: any) => {
    return await logoutModal.current.show(_redirectUrl);
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
        showLogout,
        checkActivated,
      }}
    >
      {children}
      {/** todo, move to another component **/}
      <SignTransactionModal ref={signTransactionModal} />
      <ConfirmPaymentModal ref={confirmPaymentModal} />
      <SignMessageModal ref={signMessageModal} />
      <ReceiveModal ref={receiveModal} />
      <SendModal ref={sendModal} />
      <LogoutModal ref={logoutModal} />
    </WalletContext.Provider>
  );
};

export const WalletContextConsumer = WalletContext.Consumer;
