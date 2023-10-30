import { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import SignTransaction from './comp/SignTransaction';
import TxModal from '../TxModal';

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
  const [visible, setVisible] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>('');
  const [promiseInfo, setPromiseInfo] = useState<any>({});
  const [signing, setSigning] = useState<boolean>(false);
  const [activeTxns, setActiveTxns] = useState<any>(null);
  const [sendToAddress, setSendToAddress] = useState('');
  const [showSelectChain, setShowSelectChain] = useState(false);
  const [showAmount, setShowAmount] = useState('');

  useImperativeHandle(ref, () => ({
    async show(txns: any, origin: string, sendTo: string, showSelectChain: boolean, showAmount: string) {
      setVisible(true);
      setOrigin(origin);

      setSendToAddress(sendTo);
      setActiveTxns(txns);

      setShowSelectChain(showSelectChain);
      setShowAmount(showAmount);

      return new Promise((resolve, reject) => {
        setPromiseInfo({
          resolve,
          reject,
        });
      });
    },
  }));

  const onClose = async () => {
    setVisible(false);
    setSigning(false);
    // clearState();
    promiseInfo.reject('User reject');
  };

  const onSuccess = async (receipt: any) => {
    setVisible(false);
    promiseInfo.resolve(receipt);
  };

  return (
    <div ref={ref}>
      <TxModal title="Confirm Transaction" visible={visible} onClose={onClose}>
        <SignTransaction txns={activeTxns} origin={origin} sendToAddress={sendToAddress} onSuccess={onSuccess} showSelectChain={showSelectChain} showAmount={showAmount} />

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
    </div>
  );
};

export default forwardRef(SignTransactionModal);
