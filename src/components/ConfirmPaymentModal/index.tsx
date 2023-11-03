import { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import ConfirmPayment from './comp/ConfirmPayment';
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

const ConfirmPaymentModal = (_: unknown, ref: Ref<any>) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>('');
  const [promiseInfo, setPromiseInfo] = useState<any>({});
  const [signing, setSigning] = useState<boolean>(false);
  const [fee, setFee] = useState<any>(null);
  const [sendToAddress, setSendToAddress] = useState('');

  useImperativeHandle(ref, () => ({
    async show(fee: any, origin: string, sendTo: string) {
      setVisible(true);
      setOrigin(origin);

      setSendToAddress(sendTo);
      setFee(fee);

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
      <TxModal title="Edit Guardians" visible={visible} onClose={onClose}>
        <ConfirmPayment fee={fee} origin={origin} sendToAddress={sendToAddress} onSuccess={onSuccess} />
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

export default forwardRef(ConfirmPaymentModal);
