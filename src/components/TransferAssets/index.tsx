import { useState } from 'react';
import {
  Box,
  Flex,
  Image,
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

export default function TransferAssets({ onClose, tokenAddress = ethers.ZeroAddress }: any) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={'640px'}>
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
        <ModalBody pb="12" px="12">
          <Box
            roundedBottom="20px"
            roundedTopLeft={activeTab === 0 ? '0' : '20px'}
            roundedTopRight={activeTab === 1 ? '0' : '20px'}
            p="6"
          >
            {activeTab === 0 && <SendAssets tokenAddress={tokenAddress} />}
            {activeTab === 1 && <Receive />}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
