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
import PasskeyIcon from '@/components/Icons/Auth/Passkey'
import QuestionIcon from '@/components/Icons/Auth/Question'
import Button from '@/components/Button'
import MetamaskIcon from '@/assets/wallets/metamask.png'
import OKXWalletIcon from '@/assets/wallets/okx-wallet.png'
import CoinbaseIcon from '@/assets/wallets/coinbase.png'
import BinanceIcon from '@/assets/wallets/binance.png'
import WalletConnectIcon from '@/assets/wallets/wallet-connect.png'
import XDEFIIcon from '@/assets/wallets/xdefi-wallet.png'

export default function WalletConnectModal({ isOpen, onClose }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="476px" borderRadius="20px">
        <ModalHeader
          display="flex"
          justifyContent="flex-start"
          gap="5"
          fontWeight="800"
          textAlign="center"
          borderBottom="1px solid #d7d7d7"
          padding="20px 32px"
        >
          Choose a signer type
        </ModalHeader>
        <ModalCloseButton top="14px" />
        <ModalBody overflow="auto" padding="20px 32px">
          <Box
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="100%" display="flex" flexWrap="wrap" justifyContent="space-between">
              <Box
                display="flex"
                alignItems="center"
                border="1px solid rgba(0, 0, 0, 0.1)"
                borderRadius="12px"
                padding="16px"
                marginBottom="24px"
                width="calc(50% - 16px)"
                cursor="pointer"
              >
                <Box
                  width="48px"
                  height="48px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  borderRadius="12px"
                  marginRight="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image src={MetamaskIcon} width="32px" height="32px" />
                </Box>
                <TextBody>MetaMask</TextBody>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                border="1px solid rgba(0, 0, 0, 0.1)"
                borderRadius="12px"
                padding="16px"
                marginBottom="24px"
                width="calc(50% - 16px)"
                cursor="pointer"
              >
                <Box
                  width="48px"
                  height="48px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  borderRadius="12px"
                  marginRight="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image src={OKXWalletIcon} width="32px" height="32px" />
                </Box>
                <TextBody>OKX Wallet</TextBody>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                border="1px solid rgba(0, 0, 0, 0.1)"
                borderRadius="12px"
                padding="16px"
                marginBottom="24px"
                width="calc(50% - 16px)"
                cursor="pointer"
              >
                <Box
                  width="48px"
                  height="48px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  borderRadius="12px"
                  marginRight="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image src={CoinbaseIcon} width="32px" height="32px" />
                </Box>
                <TextBody>Coinbase Wallet</TextBody>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                border="1px solid rgba(0, 0, 0, 0.1)"
                borderRadius="12px"
                padding="16px"
                marginBottom="24px"
                width="calc(50% - 16px)"
                cursor="pointer"
              >
                <Box
                  width="48px"
                  height="48px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  borderRadius="12px"
                  marginRight="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image src={BinanceIcon} width="32px" height="32px" />
                </Box>
                <TextBody>Binance Wallet</TextBody>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                border="1px solid rgba(0, 0, 0, 0.1)"
                borderRadius="12px"
                padding="16px"
                marginBottom="24px"
                width="calc(50% - 16px)"
                cursor="pointer"
              >
                <Box
                  width="48px"
                  height="48px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  borderRadius="12px"
                  marginRight="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image src={WalletConnectIcon} width="32px" height="32px" />
                </Box>
                <TextBody>Wallet Connect</TextBody>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                border="1px solid rgba(0, 0, 0, 0.1)"
                borderRadius="12px"
                padding="16px"
                marginBottom="24px"
                width="calc(50% - 16px)"
                cursor="pointer"
              >
                <Box
                  width="48px"
                  height="48px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  borderRadius="12px"
                  marginRight="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image src={XDEFIIcon} width="32px" height="32px" />
                </Box>
                <TextBody>XDEFI Wallet</TextBody>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
