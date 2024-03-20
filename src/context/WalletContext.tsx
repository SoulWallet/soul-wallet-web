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
}

export const WalletContext = createContext<IWalletContext>({
  ethersProvider: new ethers.JsonRpcProvider(),
  showSignTransaction: async () => {},
  showConfirmPayment: async () => {},
  showSignMessage: async () => {},
  showReceive: async () => {},
  showSend: async () => {},
});

export const WalletContextProvider = ({ children }: any) => {
  console.log('Render WalletContext');
  const { selectedChainItem } = useConfig();
  const signTransactionModal = useRef<any>();
  const confirmPaymentModal = useRef<any>();
  const signMessageModal = useRef<any>();
  const receiveModal = useRef<any>();
  const sendModal = useRef<any>();

  const ethersProvider = useMemo(() => {
    console.log('trigger ethers provider');
    if (!selectedChainItem) {
      return new ethers.JsonRpcProvider();
    }
    return new ethers.JsonRpcProvider(selectedChainItem.provider);
  }, [selectedChainItem]);


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

  return (
    <WalletContext.Provider
      value={{
        ethersProvider,
        showSignTransaction,
        showSignMessage,
        showConfirmPayment,
        showReceive,
        showSend,
      }}
    >
      {children}
      {/** todo, move to another component **/}
      <SignTransactionModal ref={signTransactionModal} />
      <ConfirmPaymentModal ref={confirmPaymentModal} />
      <SignMessageModal ref={signMessageModal} />
      <ReceiveModal ref={receiveModal} />
      <SendModal ref={sendModal} />
    </WalletContext.Provider>
  );
};

export const WalletContextConsumer = WalletContext.Consumer;
