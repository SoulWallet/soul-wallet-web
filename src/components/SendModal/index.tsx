import { useState, useImperativeHandle, forwardRef, Ref } from 'react';
import {
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import SendAssets from '../SendAssets';
import { ethers } from 'ethers';

function SendModal(_: any, ref: Ref<any>) {
  const [visible, setVisible] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [promiseInfo, setPromiseInfo] = useState<any>({});

  const onClose = async () => {
    setVisible(false);
    promiseInfo.reject('User close');
  };

  useImperativeHandle(ref, () => ({
    async show(_tokenAddress: string = ethers.ZeroAddress, transferType: string = 'send') {
      setVisible(true);
      setTokenAddress(_tokenAddress);
      return new Promise((resolve, reject) => {
        setPromiseInfo({
          resolve,
          reject,
        });
      });
    },
  }));
  return (
    <Modal isOpen={visible} blockScrollOnMount={false} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={{ base: '90%', lg: '640px' }}>
        <ModalHeader px="8">
          <Text fontWeight={'700'} fontSize={'20px'}>
            Send
          </Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody pb={{ base: 4, lg: 12 }} px={{ base: 4, lg: 8 }}>
          <SendAssets tokenAddress={tokenAddress} onSent={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default forwardRef(SendModal);
