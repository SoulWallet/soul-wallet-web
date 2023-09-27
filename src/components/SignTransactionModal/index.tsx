import { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import useQuery from '@/hooks/useQuery';
import useTools from '@/hooks/useTools';
import { useChainStore } from '@/store/chain';
import api from '@/lib/api';
import { useAddressStore } from '@/store/address';
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
import SignMessage from './comp/SignMessage';
import SwitchChain from './comp/SwitchChain';
import useTransaction from '@/hooks/useTransaction';
import useWalletContext from '@/context/hooks/useWalletContext';
import useWallet from '@/hooks/useWallet';

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
  const { getTokenBalance } = useBalanceStore();
  const [prefundCalculated, setPrefundCalculated] = useState(false);
  // TODO, remember user's last select
  const [payToken, setPayToken] = useState(ethers.ZeroAddress);
  const [payTokenSymbol, setPayTokenSymbol] = useState('');
  const [feeCost, setFeeCost] = useState('');
  const [activeOperation, setActiveOperation] = useState<UserOperation>();
  const [signType, setSignType] = useState<SignTypeEn>();
  const [messageToSign, setMessageToSign] = useState('');
  const [sponsor, setSponsor] = useState<any>(null);
  const [activeTxns, setActiveTxns] = useState<any>(null); // [
  const { selectedChainId } = useChainStore();
  const { decodeCalldata } = useTools();
  const [targetChainId, setTargetChainId] = useState('');
  const { getFeeCost, getGasPrice, getPrefund } = useQuery();
  const [sendToAddress, setSendToAddress] = useState('');
  const { chainConfig, selectedAddressItem } = useConfig();
  const { soulWallet } = useSdk();
  const { signAndSend } = useWallet();
  const { getUserOp } = useTransaction();

  useImperativeHandle(ref, () => ({
    async show(txns: any, origin: string, sendTo: string) {
      setVisible(true);
      setOrigin(origin);

      setSendToAddress(sendTo);

      if (txns) {
        const userOp = await getUserOp(txns, payToken);
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

  const onReject = async () => {
    setVisible(false);
    setSigning(false);
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

    await signAndSend(userOp, payToken);

    toast({
      title: 'Transaction success.',
      status: 'success',
    });

    setVisible(false);
    setSigning(false);
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

    // TODO, extract this for other functions
    const { requiredAmount } = await getPrefund(activeOperation, payToken);

    if (ethers.ZeroAddress === payToken) {
      setFeeCost(`${requiredAmount} ${chainConfig.chainToken}`);
    } else {
      setFeeCost(`${requiredAmount} USDC`);
    }
    setLoadingFee(false);
  };

  const onPayTokenChange = async () => {
    setPayTokenSymbol(getTokenBalance(payToken).symbol || 'Unknown');
    const newUserOp = await getUserOp(activeTxns, payToken);
    setActiveOperation(newUserOp);
    setPrefundCalculated(false);
    setLoadingFee(true);
  };

  useEffect(() => {
    if (!payToken || !activeTxns || !activeTxns.length) {
      return;
    }
    console.log('on pay token change', payToken, activeTxns);
    onPayTokenChange();
  }, [payToken, activeTxns]);

  useEffect(() => {
    if (!activeOperation || !payToken) {
      return;
    }
    if (prefundCalculated) {
      return;
    }
    setPrefundCalculated(true);
    getFinalPrefund();
  }, [payToken, activeOperation, prefundCalculated]);

  return (
    <div ref={ref}>
      <Modal isOpen={visible} onClose={onReject}>
        <ModalOverlay />
        <ModalContent bg="#ededed" maxW={'520px'}>
          <ModalHeader fontWeight={'800'} textAlign={'center'} borderBottom={'1px solid #d7d7d7'}>
            Confirm Transaction
          </ModalHeader>
          <ModalCloseButton top="14px" />
          <ModalBody pb="12" px="12">
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
              onClick={onReject}
              mt="5"
              lineHeight={'1'}
            >
              Cancel
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default forwardRef(SignTransactionModal);
