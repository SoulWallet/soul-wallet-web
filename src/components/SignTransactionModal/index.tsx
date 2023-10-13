import { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import useQuery from '@/hooks/useQuery';
import useTools from '@/hooks/useTools';
import { useChainStore } from '@/store/chain';
import api from '@/lib/api';
import { ethers } from 'ethers';
import {
  Flex,
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react';
import { useBalanceStore } from '@/store/balance';
import { UserOpUtils, UserOperation } from '@soulwallet_test/sdk';
import useSdk from '@/hooks/useSdk';
import useConfig from '@/hooks/useConfig';
import ConnectDapp from './comp/ConnectDapp';
import SignTransaction from './comp/SignTransaction';
import SwitchChain from './comp/SwitchChain';
import useTransaction from '@/hooks/useTransaction';
import useWalletContext from '@/context/hooks/useWalletContext';
import useWallet from '@/hooks/useWallet';
import TxModal from '../TxModal';
import { useAddressStore, getIndexByAddress } from '@/store/address';

enum SignTypeEn {
  Transaction,
  Message,
  Account,
  SwitchChain,
}

export const InfoWrap = ({ children, ...restProps }: any) => (
  <Flex fontSize="12px" fontWeight={'500'} px="4" gap="6" fontFamily={'Martian'} flexDir={'column'} {...restProps}>
    {children}
  </Flex>
);

export const InfoItem = ({ children, ...restProps }: any) => (
  <Flex align="center" justify={'space-between'} {...restProps}>
    {children}
  </Flex>
);

const SignTransactionModal = (_: unknown, ref: Ref<any>) => {
  const toast = useToast();
  const [visible, setVisible] = useState<boolean>(false);
  const [loadingFee, setLoadingFee] = useState(true);
  const [origin, setOrigin] = useState<string>('');
  const [promiseInfo, setPromiseInfo] = useState<any>({});
  const [decodedData, setDecodedData] = useState<any>({});
  const [signing, setSigning] = useState<boolean>(false);
  const { showSignTransaction, checkActivated } = useWalletContext();
  const { getTokenBalance } = useBalanceStore();
  const [prefundCalculated, setPrefundCalculated] = useState(false);
  // TODO, remember user's last select
  const [payToken, setPayToken] = useState(ethers.ZeroAddress);
  const [payTokenSymbol, setPayTokenSymbol] = useState('');
  const [feeCost, setFeeCost] = useState('');
  const [activeOperation, setActiveOperation] = useState<UserOperation>();
  const [sponsor, setSponsor] = useState<any>(null);
  const [activeTxns, setActiveTxns] = useState<any>(null); // [
  const { selectedChainId } = useChainStore();
  const { toggleActivatedChain, addressList, selectedAddress } = useAddressStore();
  const { decodeCalldata } = useTools();
  // const [targetChainId, setTargetChainId] = useState('');
  const { getPrefund } = useQuery();
  const [sendToAddress, setSendToAddress] = useState('');
  const { chainConfig } = useConfig();
  const { signAndSend, getActivateOp } = useWallet();
  const { getUserOp } = useTransaction();

  const clearState = () => {
    setOrigin('');
    setPromiseInfo({});
    setDecodedData({});
    setLoadingFee(true);
    setSigning(false);
    setPrefundCalculated(false);
    setPayToken(ethers.ZeroAddress);
    setPayTokenSymbol('');
    setFeeCost('');
    setActiveOperation(undefined);
    setSponsor(null);
    setActiveTxns(null);
    setSendToAddress('');
  };

  useImperativeHandle(ref, () => ({
    async show(txns: any, origin: string, sendTo: string) {
      setVisible(true);
      setOrigin(origin);

      setSendToAddress(sendTo);

      if (txns) {
        let userOp = await getFinalUserOp(txns);

        setActiveTxns(txns);
        setActiveOperation(userOp);
        const callDataDecodes = await decodeCalldata(selectedChainId, chainConfig.contracts.entryPoint, userOp);
        console.log('decoded data', callDataDecodes);
        setDecodedData(callDataDecodes);
        checkSponser(userOp);
      }

      return new Promise((resolve, reject) => {
        setPromiseInfo({
          resolve,
          reject,
        });
      });
    },
  }));

  const getFinalUserOp = async (txns: any) => {
    const isActivated = await checkActivated();
    if (isActivated) {
      // if activated, get userOp directly
      return await getUserOp(txns, payToken);
    } else {
      const activateIndex = getIndexByAddress(addressList, selectedAddress);
      console.log('activate index', activateIndex, addressList, selectedAddress)
      // if not activated, prepend activate txns
      return await getActivateOp(activateIndex, payToken, txns);
    }
  };

  const onClose = async () => {
    setVisible(false);
    setSigning(false);
    clearState();
    promiseInfo.reject('User reject');
  };

  const onConfirm = async () => {
    setSigning(true);

    let userOp: any;
    if (sponsor && sponsor.paymasterAndData) {
      userOp = { ...activeOperation, paymasterAndData: sponsor.paymasterAndData };
    } else {
      userOp = activeOperation;
    }

    const receipt = await signAndSend(userOp, payToken);

    // IMPORTANT TODO, get these params from receipt
    // if first tx is completed, then it's activated
    toggleActivatedChain(userOp.sender, selectedChainId);

    toast({
      title: 'Transaction success.',
      status: 'success',
    });

    setVisible(false);
    setSigning(false);
    clearState();

    promiseInfo.resolve(receipt);
  };

  const checkSponser = async (userOp: UserOperation) => {
    const res = await api.sponsor.check(
      selectedChainId,
      chainConfig.contracts.entryPoint,
      UserOpUtils.userOperationFromJSON(UserOpUtils.userOperationToJSON(userOp)),
    );
    if (res.data.sponsorInfos && res.data.sponsorInfos.length > 0) {
      // TODO, check >1 sponsor
      setSponsor(res.data.sponsorInfos[0]);
    }
  };

  const getFinalPrefund = async () => {
    // IMPORTANT TODO, uncomment this to show double loading fee issue
    // setLoadingFee(true);
    // setFeeCost("");
    if (prefundCalculated) {
      return;
    }
    console.log('get final prefund');
    // TODO, extract this for other functions
    const { requiredAmount } = await getPrefund(activeOperation, payToken);

    if (ethers.ZeroAddress === payToken) {
      setFeeCost(`${requiredAmount} ${chainConfig.chainToken}`);
    } else {
      setFeeCost(`${requiredAmount} USDC`);
    }
    setPrefundCalculated(true);
    setLoadingFee(false);
  };

  const onPayTokenChange = async () => {
    setPayTokenSymbol(getTokenBalance(payToken).symbol || 'Unknown');
    const newUserOp = await getFinalUserOp(activeTxns);
    setActiveOperation(newUserOp);
    setPrefundCalculated(false);
    setLoadingFee(true);
  };

  useEffect(() => {
    if (!payToken || !activeTxns || !activeTxns.length) {
      return;
    }
    console.log('on pay token change', payToken, activeTxns, activeTxns.length);
    onPayTokenChange();
  }, [payToken, activeTxns]);

  useEffect(() => {
    if (!activeOperation || !payToken) {
      return;
    }
    console.log('trigger final prefund', activeOperation, payToken)
    getFinalPrefund();
  }, [payToken, activeOperation]);

  return (
    <div ref={ref}>
      <TxModal title="Confirm Transaction" visible={visible} onClose={onClose}>
        <SignTransaction
          decodedData={decodedData}
          sendToAddress={sendToAddress}
          sponsor={sponsor}
          origin={origin}
          feeCost={feeCost}
          payToken={payToken}
          setPayToken={setPayToken}
          payTokenSymbol={payTokenSymbol}
          loadingFee={loadingFee}
          signing={signing}
          onConfirm={onConfirm}
        />

        <Text
          color="danger"
          fontSize="20px"
          fontWeight={'800'}
          textAlign={'center'}
          cursor={'pointer'}
          onClick={onClose}
          mt="5"
          lineHeight={'1'}
        >
          Cancel
        </Text>
      </TxModal>
      {/* <Modal isOpen={visible} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#ededed" maxW={'520px'}>
          <ModalHeader fontWeight={'800'} textAlign={'center'} borderBottom={'1px solid #d7d7d7'}>
            Confirm Transaction
          </ModalHeader>
          <ModalCloseButton top="14px" />
          <ModalBody pb="12" px="12">
         
          </ModalBody>
        </ModalContent>
      </Modal> */}
    </div>
  );
};

export default forwardRef(SignTransactionModal);
