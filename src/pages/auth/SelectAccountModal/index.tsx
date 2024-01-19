import React, {
  useState,
  useRef,
  useImperativeHandle,
  useCallback,
  useEffect,
  Fragment
} from 'react'
import {
  Box,
  Text,
  Image,
  useToast,
  Select,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/react'
import TextBody from '@/components/new/TextBody'
import Title from '@/components/new/Title'
import ArrowRightIcon from '@/components/Icons/ArrowRight'
import ImportIcon from '@/components/Icons/Auth/Import'
import Button from '@/components/new/Button'
import { getChainInfo } from '@/lib/tools';
import IconOp from '@/assets/chains/op.svg';
import IconArb from '@/assets/chains/arb.svg';
import IconEth from '@/assets/chains/eth.svg';

export default function SelectAccountModal({ isOpen, onClose, startImportAccount }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent background="white" maxW="840px" borderRadius="20px">
        <ModalHeader
          display="flex"
          justifyContent="flex-start"
          gap="5"
          fontWeight="800"
          textAlign="center"
          // borderBottom="1px solid #d7d7d7"
          padding="20px 32px"
        >
          Select a Soulwallet account
        </ModalHeader>
        <ModalCloseButton top="14px" />
        <ModalBody overflow="auto" padding="20px 32px">
          <Box
            background="white"
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="100%">
              <Title type="t2" marginBottom="20px" fontWeight="500">
                Multiple wallets found under this signer, please select to login
              </Title>
              <Box width="100%" display="flex" flexWrap="wrap">
                <Box border="1px solid rgba(0, 0, 0, 0.1)" borderRadius="12px" padding="24px" width="100%" marginBottom="24px">
                  <Title fontSize="18px">Account _1</Title>
                  <Box display="flex" marginTop="18px">
                    <Box marginRight="11px" borderBottom="2px solid black" paddingBottom="10px" cursor="pointer">
                      <Image width="22px" height="22px" src={IconEth} borderRadius="100%" />
                    </Box>
                    <Box marginRight="11px" opacity="0.5" cursor="pointer">
                      <Image width="22px" height="22px" src={IconArb} borderRadius="100%" />
                    </Box>
                    <Box marginRight="11px" opacity="0.5" cursor="pointer">
                      <Image width="22px" height="22px" src={IconOp} borderRadius="100%" />
                    </Box>
                  </Box>
                  <Box background="rgba(236, 236, 236, 0.3)" borderRadius="12px" padding="14px" marginTop="14px">
                    <TextBody fontWeight="normal">ETH Address: 0xAAAA12345678E25FDa5f8a56B8e267fDaB6dS123</TextBody>
                    <TextBody fontWeight="normal">Balance ≈ 0.88 ETH</TextBody>
                  </Box>
                </Box>
                <Box border="1px solid rgba(0, 0, 0, 0.1)" borderRadius="12px" padding="24px" width="100%" marginBottom="24px">
                  <Title fontSize="18px">Account _2</Title>
                  <Box display="flex" marginTop="18px">
                    <Box marginRight="11px" borderBottom="2px solid black" paddingBottom="10px" cursor="pointer">
                      <Image width="22px" height="22px" src={IconEth} borderRadius="100%" />
                    </Box>
                    <Box marginRight="11px" opacity="0.5" cursor="pointer">
                      <Image width="22px" height="22px" src={IconArb} borderRadius="100%" />
                    </Box>
                    <Box marginRight="11px" opacity="0.5" cursor="pointer">
                      <Image width="22px" height="22px" src={IconOp} borderRadius="100%" />
                    </Box>
                  </Box>
                  <Box background="rgba(236, 236, 236, 0.3)" borderRadius="12px" padding="14px" marginTop="14px">
                    <TextBody fontWeight="normal">ETH Address: 0xAAAA12345678E25FDa5f8a56B8e267fDaB6dS123</TextBody>
                    <TextBody fontWeight="normal">Balance ≈ 0.88 ETH</TextBody>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="10px">
                <TextBody
                  fontSize="18px"
                  display="flex"
                  alignItems="center"
                  onClick={startImportAccount}
                  cursor="pointer"
                >
                  <Box marginRight="5px">
                    <ImportIcon />
                  </Box>
                  Import account
                </TextBody>
                <Button
                  theme="dark"
                  color="white"
                  padding="0 20px"
                >
                  Go to my wallet
                </Button>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
