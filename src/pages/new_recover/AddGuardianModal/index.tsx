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
  ModalBody,
  Input
} from '@chakra-ui/react'
import TextBody from '@/components/new/TextBody'
import Title from '@/components/new/Title'
import ArrowRightIcon from '@/components/Icons/ArrowRight'
import PasskeyIcon from '@/components/Icons/Auth/Passkey'
import QuestionIcon from '@/components/Icons/Auth/Question'
import Button from '@/components/new/Button'
import MetamaskIcon from '@/assets/wallets/metamask.png'
import OKXWalletIcon from '@/assets/wallets/okx-wallet.png'
import CoinbaseIcon from '@/assets/wallets/coinbase.png'
import BinanceIcon from '@/assets/wallets/binance.png'
import WalletConnectIcon from '@/assets/wallets/wallet-connect.png'
import XDEFIIcon from '@/assets/wallets/xdefi-wallet.png'
import EditGuardianForm from '../EditGuardianForm'

export default function EditGuardianModal({
  isOpen,
  onClose,
  startIntroGuardian,
  startEditGuardian,
  onConfirm,
  setIsEditGuardianOpen,
  setIsSelectGuardianOpen,
  canGoBack
}: any) {
  const onBack = () => {
    setIsEditGuardianOpen(false)
    if (setIsSelectGuardianOpen) setIsSelectGuardianOpen(true)
  }

  const onConfirmLocal = (addresses: any, names: any, threshold: any) => {
    if (onConfirm) onConfirm(addresses, names, threshold)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="840px" borderRadius="20px">
        <ModalCloseButton top="14px" />
        <ModalHeader
          display="flex"
          justifyContent="flex-start"
          gap="5"
          fontWeight="800"
          textAlign="center"
          padding="20px 32px"
        >
          Enter guardians info manually
        </ModalHeader>
        <ModalBody overflow="auto" padding="20px 32px">
          <Box
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="100%" padding="0">
              <Box>
                <EditGuardianForm onConfirm={onConfirmLocal} onBack={onBack} canGoBack={canGoBack} />
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
