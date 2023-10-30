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
import useSdk from '@/hooks/useSdk';

interface IWalletContext {
  ethersProvider: ethers.JsonRpcProvider;
  showSign: () => Promise<void>;
  showSignTransaction: (txns: any, origin?: string, sendTo?: string, showSelectChain?: boolean, showAmount?: string) => Promise<void>;
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
  const { retrieveSlotInfo } = useWallet();
  const {calcWalletAddress} =useSdk();
  const {
    recoveringGuardiansInfo,
    updateRecoveringGuardiansInfo,
    setRecoveringGuardiansInfo,
    updateGuardiansInfo,
  } = useGuardianStore();
  const { credentials, setCredentials, setSelectedCredentialId } = useCredentialStore();
  const recoveryRecordID = recoveringGuardiansInfo.recoveryRecordID;
  const { setSelectedChainId, selectedChainId, updateChainItem } = useChainStore();
  const { tokenBalance, fetchTokenBalance } = useBalanceStore();
  const [recoverCheckInterval, setRecoverCheckInterval] = useState<any>();
  const { addressList, setAddressList, addAddressItem, selectedAddress, getIsActivated, setSelectedAddress, toggleActivatedChain } =
    useAddressStore();
  const signModal = createRef<any>();
  const signTransactionModal = createRef<any>();
  const signPaymentModal = createRef<any>();
  const signMessageModal = createRef<any>();

  const boostAfterRecovered = async () => {
    const initInfo = (await api.guardian.getSlotInfo({ walletAddress: selectedAddress })).data;
    retrieveSlotInfo(initInfo);

    setCredentials(recoveringGuardiansInfo.credentials)

    setSelectedCredentialId(recoveringGuardiansInfo.credentials[0].id);

    const newAddress= await calcWalletAddress(0);
    setAddressList([{
      title: `Account 1`,
      address: newAddress,
      // TODO, check activate status
      activatedChains: [],
    }]);
    setSelectedAddress(newAddress)

    updateGuardiansInfo({
      guardianDetails: recoveringGuardiansInfo.guardianDetails,
      guardianHash: recoveringGuardiansInfo.guardianHash,
      guardianNames: recoveringGuardiansInfo.guardianNames,
      keystore: recoveringGuardiansInfo.keystore,
      slot: recoveringGuardiansInfo.slot
    });

    setRecoveringGuardiansInfo(null)

  };

  const ethersProvider = useMemo(() => {
    if (!selectedChainItem) {
      return new ethers.JsonRpcProvider();
    }
    return new ethers.JsonRpcProvider(selectedChainItem.provider);
  }, [selectedChainItem]);

  const checkRecoverStatus = async () => {
    const res = (await api.guardian.getRecoverRecord({ recoveryRecordID })).data;
    // console.log('res address: ', res.addresses)

    updateRecoveringGuardiansInfo({
      recoveryRecord: res,
    });
    const { addressList } = useAddressStore.getState();
    // console.log('addresslist is:', addressList);
    if (addressList.length === 0) {
      // IMPORTANT TODO, the order??
      for (let [index, item] of Object.entries(res.addresses)) {
        addAddressItem({
          title: `Account ${index + 1}`,
          address: item as any,
          activatedChains: [],
          // allowedOrigins: [],
        });
      }
      console.log('to set selected address: ', res.addresses)
    }

    // check if should replace key
    if (res.status >= 3) {

      // new credential

      // const stagingKeysRaw = await Promise.all(credentials.map((credential: any) => credential.publicKey))
      // const stagingKeys = L1KeyStore.initialKeysToAddress(stagingKeysRaw);
      // const stagingKeyHash = L1KeyStore.getKeyHash(stagingKeys);
      // const stagingCredentials = []
      // const currentCredentials = []
      // const onchainCredentials = res.newOwners;

      // if(onchainCredentials.include(stagingCredentials) && !onchainCredentials.include(currentCredentials) ){
      if(recoveringGuardiansInfo){
        await boostAfterRecovered();
      }
    }

    // recover process finished
    if (res.status === 4) {
      // setRecoveringGuardiansInfo({})
    }

    const chainRecoverStatus = res.statusData.chainRecoveryStatus;
    for (let item of chainRecoverStatus) {
      updateChainItem(item.chainId, {
        recovering: item.status === 0,
      });
    }

    // if (
    //   chainRecoverStatus.length &&
    //   chainRecoverStatus.filter((item: any) => item.status === 1).length === 0
    // ) {
    //   setSelectedChainId(chainRecoverStatus.filter((item: any) => item.status)[0].chainId);
    // }

    // set if no selected address
    if(!selectedAddress){
      setSelectedAddress(res.addresses[0]);
    }
    // set goerli if no selected chainId
    if(!selectedChainId){
      setSelectedChainId('0x5')
    }
  };

  useEffect(() => {
    if (!recoveryRecordID) {
      return;
    }

    console.log('check recover status')

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

  const showSignTransaction = async (txns: any, origin?: string, sendTo?: string, showSelectChain?: boolean, showAmount?: string) => {
    return await signTransactionModal.current.show(txns, origin, sendTo, showSelectChain, showAmount);
  };

  const showSignPayment = async (txns: any, origin?: string, sendTo?: string) => {
    return await signPaymentModal.current.show(txns, origin, sendTo);
  };

  const showSignMessage = async (messageToSign: string, origin?: string) => {
    return await signMessageModal.current.show(messageToSign, origin);
  };

  useEffect(() => {
    const { chainIdHex, paymasterTokens } = selectedChainItem;

    if (!selectedAddress || !selectedChainId) {
      return;
    }

    fetchTokenBalance(selectedAddress, chainIdHex, paymasterTokens);

    const interval = setInterval(() => {

      console.log('fetch token balance')
      fetchTokenBalance(selectedAddress, chainIdHex, paymasterTokens);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedAddress, selectedChainId]);

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
