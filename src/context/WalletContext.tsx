import { createContext, useState, useEffect, useRef, useMemo } from 'react';
import { ethers } from 'ethers';
import SignTransactionModal from '@/components/SignTransactionModal';
import ConfirmPaymentModal from '@/components/ConfirmPaymentModal';
import SignMessageModal from '@/components/SignMessageModal';
import ClaimAssetsModal from '@/components/ClaimAssetsModal';
import TransferAssetsModal from '@/components/TransferAssetsModal';
import useConfig from '@/hooks/useConfig';
import { useGuardianStore } from '@/store/guardian';
import { useChainStore } from '@/store/chain';
import { useAddressStore } from '@/store/address';
import useWallet from '@/hooks/useWallet';

interface IWalletContext {
  ethersProvider: any;
  showSignTransaction: (
    txns: any,
    origin?: string,
    sendTo?: string,
  ) => Promise<void>;
  showConfirmPayment: (fee: any, origin?: string, sendTo?: string) => Promise<void>;
  showClaimAssets: (fee: any, origin?: string, sendTo?: string) => Promise<void>;
  showSignMessage: (messageToSign: any, origin?: string) => Promise<void>;
  showTransferAssets: (tokenAddress?: string, transferType?:string) => Promise<void>;
  checkActivated: () => Promise<boolean>;
}

export const WalletContext = createContext<IWalletContext>({
  ethersProvider: new ethers.JsonRpcProvider(),
  showSignTransaction: async () => {},
  showConfirmPayment: async () => {},
  showSignMessage: async () => {},
  showTransferAssets: async () => {},
  showClaimAssets: async () => {},
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
  const signTransactionModal = useRef<any>();
  const confirmPaymentModal = useRef<any>();
  const signMessageModal = useRef<any>();
  const transferAssetsModal = useRef<any>();
  const claimAssetsModal = useRef<any>();
  
  const ethersProvider = useMemo(() => {
    console.log('trigger ethers provider');
    if (!selectedChainItem) {
      return new ethers.JsonRpcProvider();
    }
    return new ethers.JsonRpcProvider(selectedChainItem.provider);
  }, [selectedChainItem]);

  useEffect(() => {
    console.log('recover id', recoveryRecordID);
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
    // showSelectChain?: boolean,
    // showAmount?: string,
  ) => {
    return await signTransactionModal.current.show(txns, origin, sendTo);
  };

  const showConfirmPayment = async (fee: any, origin?: string, sendTo?: string) => {
    return await confirmPaymentModal.current.show(fee, origin, sendTo);
  };

  const showSignMessage = async (messageToSign: string, origin?: string) => {
    return await signMessageModal.current.show(messageToSign, origin);
  };

  const showTransferAssets = async (tokenAddress?: string, transferType?: string) => {
    return await transferAssetsModal.current.show(tokenAddress, transferType);
  };

  const showClaimAssets = async () => {
    return await claimAssetsModal.current.show();
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
        showTransferAssets,
        showClaimAssets,
        checkActivated,
      }}
    >
      {children}
      {/** todo, move to another component **/ }
      <SignTransactionModal ref={signTransactionModal} />
      <ConfirmPaymentModal ref={confirmPaymentModal} />
      <SignMessageModal ref={signMessageModal} />
      <ClaimAssetsModal ref={claimAssetsModal} />
      <TransferAssetsModal ref={transferAssetsModal} />
    </WalletContext.Provider>
  );
};

export const WalletContextConsumer = WalletContext.Consumer;
