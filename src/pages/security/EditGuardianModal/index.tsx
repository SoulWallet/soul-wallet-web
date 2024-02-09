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
import Button from '@/components/Button'
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
  canGoBack,
  editType
}: any) {
  const onBack = () => {
    setIsEditGuardianOpen(false)
    if (setIsSelectGuardianOpen) setIsSelectGuardianOpen(true)
  }

  const onConfirmLocal = (addresses: any, names: any, i: any) => {
    if (onConfirm) onConfirm(addresses, names, i)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={{base: "95%", lg :"840px"}} my={{base: "120px"}} borderRadius="20px">
        <ModalCloseButton top="14px" />
        <ModalBody
          overflow="auto"
          padding={{ base: "20px 10px", md: "20px 32px" }}
          marginTop={{ base: "30px", md: "60px" }}
        >
          <Box
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="100%" padding="0 20px">
              <Title fontSize="20px" fontWeight="800">Ethereum wallet</Title>
              <TextBody fontWeight="500" marginBottom="31px">
                Use your own or your friends & family's wallet addresses.
              </TextBody>
              <Box>
                <EditGuardianForm onConfirm={onConfirmLocal} onBack={onBack} canGoBack={canGoBack} editType={editType} />
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
