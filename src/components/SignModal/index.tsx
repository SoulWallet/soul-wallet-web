/**
 * This component is to be removed
 */

import { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import useQuery from '@/hooks/useQuery';
import { useChainStore } from '@/store/chain';
import api from '@/lib/api';
import { ethers } from 'ethers';
import { Flex, Box, Text, Modal } from '@chakra-ui/react';
import { useBalanceStore } from '@/store/balance';
import { UserOpUtils, UserOperation } from '@soulwallet/sdk';
import { decodeCalldata } from '@/lib/tools';
import useConfig from '@/hooks/useConfig';
import ConnectDapp from './comp/ConnectDapp';
import SignTransaction from './comp/SignTransaction';
import SignMessage from './comp/SignMessage';
import SwitchChain from './comp/SwitchChain';
import useTransaction from '@/hooks/useTransaction';

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

const SignModal = (_: unknown, ref: Ref<any>) => {
  const [keepModalVisible, setKeepModalVisible] = useState(false);
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
  const [targetChainId, setTargetChainId] = useState('');
  const { getPrefund } = useQuery();
  const [sendToAddress, setSendToAddress] = useState('');
  const { chainConfig, selectedAddressItem } = useConfig();
  const {getUserOp} = useTransaction();


  useImperativeHandle(ref, () => ({
    async show(obj: any) {
      const { txns, actionType, origin, keepVisible, msgToSign, sendTo, targetChainId: tChainId } = obj;
      setVisible(true);
      setOrigin(origin);

      console.log('show sign modal', txns, actionType, origin, keepVisible, msgToSign, sendTo);
      setKeepModalVisible(keepVisible || false);

      setSendToAddress(sendTo);

      if (actionType === 'getAccounts') {
        setSignType(SignTypeEn.Account);
      } else if (actionType === 'signMessage' || actionType === 'signMessageV4') {
        setSignType(SignTypeEn.Message);
      } else if (actionType === 'switchChain') {
        setSignType(SignTypeEn.SwitchChain);
        setTargetChainId(tChainId);
      } else {
        setSignType(SignTypeEn.Transaction);
      }

      if (txns) {
        const userOp = await getUserOp(txns, payToken);
        setActiveTxns(txns);
        setActiveOperation(userOp);
        const callDataDecodes = await decodeCalldata(selectedChainId, chainConfig.contracts.entryPoint, userOp);
        console.log('decoded data', callDataDecodes);
        setDecodedData(callDataDecodes);
        checkSponser(userOp);
      }

      if (msgToSign) {
        setMessageToSign(msgToSign);
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
    promiseInfo.reject('User reject');
    if (keepModalVisible) {
      setVisible(false);
      setSigning(false);
    } else {
      window.close();
    }
  };

  const onConfirm = async () => {
    setSigning(true);
    if (sponsor && sponsor.paymasterAndData) {
      promiseInfo.resolve({
        userOp: { ...activeOperation, paymasterAndData: sponsor.paymasterAndData },
        payToken,
      });
    } else if (payToken === ethers.ZeroAddress) {
      promiseInfo.resolve({ userOp: activeOperation, payToken });
    } else {
      promiseInfo.resolve({ userOp: activeOperation, payToken });
    }

    if (!keepModalVisible) {
      setVisible(false);
      setSigning(false);
    }
  };

  const onSwitchChain = async () => {
    promiseInfo.resolve();
  };

  const onConnect = () => {
    promiseInfo.resolve();
  };

  const onSign = async () => {
    promiseInfo.resolve();
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
        {signType === SignTypeEn.Account && <ConnectDapp origin={origin} onConfirm={onConnect} />}
        {signType === SignTypeEn.Transaction && (
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
        )}
        {signType === SignTypeEn.Message && (
          <SignMessage messageToSign={messageToSign} onSign={onSign} origin={origin} />
        )}
        {signType === SignTypeEn.SwitchChain && <SwitchChain targetChainId={targetChainId} onConfirm={onSwitchChain} />}
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
      </Modal>
    </div>
  );
};

export default forwardRef(SignModal);
