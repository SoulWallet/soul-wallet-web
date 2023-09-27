import { useState, forwardRef, useImperativeHandle, useEffect, Ref } from 'react';
import { ethers } from 'ethers';
import { Flex, Box, Text, Modal } from '@chakra-ui/react';
import { UserOpUtils, UserOperation } from '@soulwallet_test/sdk';
import SignMessage from './comp/SignMessage';

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

const SignMessageModal = (_: unknown, ref: Ref<any>) => {
  const [keepModalVisible, setKeepModalVisible] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>('');
  const [promiseInfo, setPromiseInfo] = useState<any>({});
  const [messageToSign, setMessageToSign] = useState('');

  useImperativeHandle(ref, () => ({
    async show(message: string, origin?: string) {
      setVisible(true);
      // setOrigin(origin);
      setMessageToSign(message);

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
    } else {
      window.close();
    }
  };

  const onSign = async () => {
    promiseInfo.resolve();
  };

  return (
    <div ref={ref}>
      <Modal isOpen={visible} onClose={onReject}>
        <SignMessage messageToSign={messageToSign} onSign={onSign} origin={origin} />
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

export default forwardRef(SignMessageModal);
