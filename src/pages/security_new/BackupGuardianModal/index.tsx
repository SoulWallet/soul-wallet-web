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
import DownloadIcon from '@/components/Icons/Download'
import Button from '@/components/new/Button'
import TextButton from '@/components/new/TextButton'
import MetamaskIcon from '@/assets/wallets/metamask.png'
import OKXWalletIcon from '@/assets/wallets/okx-wallet.png'
import CoinbaseIcon from '@/assets/wallets/coinbase.png'
import BinanceIcon from '@/assets/wallets/binance.png'
import WalletConnectIcon from '@/assets/wallets/wallet-connect.png'
import XDEFIIcon from '@/assets/wallets/xdefi-wallet.png'

export default function EditGuardianModal({
  isOpen,
  onClose,
  startIntroGuardian,
  startEditGuardian
}: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent width="434px" borderRadius="20px">
        <ModalCloseButton top="14px" />
        <ModalBody overflow="auto" padding="20px 32px" marginTop="40px">
          <Box
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="100%" padding="0 20px">
              <Title fontSize="24px" fontWeight="800" textAlign="center">Backup List</Title>
              <TextBody fontWeight="700" marginBottom="24px" textAlign="center">
                Save your guardians list for easy wallet recovery.
              </TextBody>
              <Box display="flex" marginTop="14px" flexDirection="column">
                <Box width="100%">
                  <Button
                    width="100%"
                    borderRadius="20px"
                    backgroundColor="#6A52EF"
                    borderColor="#6A52EF"
                    _hover={{ backgroundColor: "#6A52EF" }}
                  >
                    <Box marginRight="4px"><DownloadIcon /></Box>
                    Download
                  </Button>
                </Box>
                <Box
                  height="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  marginTop="24px"
                  position="relative"
                >
                  <Box background="#E4E4E4" width="100%" height="1px" />
                  <TextBody
                    textAlign="center"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="absolute"
                    backgroundColor="white"
                    padding="0 20px"
                    color="#CECECE"
                  >
                    Or
                  </TextBody>
                </Box>
                <Box width="100%" marginTop="24px">
                  <Input
                    type="text"
                    placeholder={'Send to Email'}
                    borderRadius="16px"
                    paddingRight="24px"
                    height="48px"
                    width="100%"
                    borderColor="#E4E4E4"
                  />
                </Box>
                <Box width="100%">
                  <Button
                    width="100%"
                    borderRadius="20px"
                    backgroundColor="black"
                    marginTop="12px"
                  >
                    Send
                  </Button>
                  <TextButton
                    width="100%"
                    borderRadius="20px"
                    backgroundColor="black"
                  >
                    <Box color="#898989">Cancel</Box>
                  </TextButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
