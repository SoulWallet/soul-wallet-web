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

export default function SelectAccountModal({ isOpen, onClose }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent background="#ededed" maxW="840px" borderRadius="20px">
        <ModalHeader
          display="flex"
          justifyContent="flex-start"
          gap="5"
          fontWeight="800"
          textAlign="center"
          borderBottom="1px solid #d7d7d7"
          padding="20px 32px"
        >
          Select a Soulwallet account
        </ModalHeader>
        <ModalCloseButton top="14px" />
        <ModalBody overflow="auto" padding="20px 32px">
          <Box
            background="#ededed"
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
                  <Title fontSize="18px">Wallet _1</Title>
                  <TextBody fontWeight="normal">0x6B5Ccc28B2BC216D0d95eE5448DAbE2d29bb5Aa2</TextBody>
                </Box>
                <Box border="1px solid rgba(0, 0, 0, 0.1)" borderRadius="12px" padding="24px" width="100%" marginBottom="24px">
                  <Title fontSize="18px">Wallet _2</Title>
                  <TextBody fontWeight="normal">0x6B5Ccc28B2BC216D0d95eE5448DAbE2d29bb5Aa2</TextBody>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="10px">
                <TextBody fontSize="18px" display="flex" alignItems="center">
                  <Box marginRight="5px"><ImportIcon /></Box>
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
