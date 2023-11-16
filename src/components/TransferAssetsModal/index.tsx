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
import Receive from '../Receive';
import SendAssets from '../SendAssets';
import { ethers } from 'ethers';
const tabs = [
  {
    text: 'Send',
  },
  {
    text: 'Receive',
  },
];

function TransferAssetsModal(_: any, ref: Ref<any>) {
  const [activeTab, setActiveTab] = useState(0);
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
      setActiveTab(transferType === 'send' ? 0 : 1);
      return new Promise((resolve, reject) => {
        setPromiseInfo({
          resolve,
          reject,
        });
      });
    },
  }));
  return (
    <Modal isOpen={visible} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={{ base: '90%', lg: '640px' }}>
        <ModalHeader
          display={'flex'}
          justifyContent={'center'}
          gap="5"
          fontWeight={'800'}
          textAlign={'center'}
          borderBottom={'1px solid #d7d7d7'}
        >
          {tabs.map((item, index) => (
            <Text
              key={index}
              cursor={'pointer'}
              color={activeTab === index ? '#1c1c1e' : '#898989'}
              onClick={() => setActiveTab(index)}
              fontWeight={'800'}
              fontSize={'20px'}
              pos="relative"
              _after={{
                content: '""',
                display: activeTab === index ? 'block' : 'none',
                width: '100%',
                height: '2px',
                bg: '#1c1c1e',
                position: 'absolute',
                bottom: '-16px',
                left: '0',
              }}
            >
              {item.text}
            </Text>
          ))}
        </ModalHeader>
        <ModalCloseButton top="14px" />
        <ModalBody pb={{ base: 4, lg: 12 }} px={{ base: 3, lg: 12 }}>
          <Box
            roundedBottom="20px"
            roundedTopLeft={activeTab === 0 ? '0' : '20px'}
            roundedTopRight={activeTab === 1 ? '0' : '20px'}
            p={{ base: 3, lg: 6 }}
          >
            {activeTab === 0 && <SendAssets tokenAddress={tokenAddress} onSent={onClose} />}
            {activeTab === 1 && <Receive />}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default forwardRef(TransferAssetsModal);
