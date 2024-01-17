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

export default function EditGuardianModal({
  isOpen,
  onClose,
  startIntroGuardian,
  startEditGuardian
}: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="840px" borderRadius="20px">
        <ModalCloseButton top="14px" />
        <ModalBody overflow="auto" padding="20px 32px" marginTop="60px">
          <Box
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="100%" padding="0 20px">
              <Title fontSize="20px" fontWeight="800">Ethereum wallet</Title>
              <TextBody fontWeight="500" marginBottom="31px">
                Use wallet address from yourself or friends & family. Fully decentralized
              </TextBody>
              <Box marginTop="14px">
                <Box display="flex">
                  <Box marginRight="16px" width="240px">
                    <Input
                      type="text"
                      placeholder={'Guardian name (optional)'}
                      borderRadius="16px"
                      paddingRight="24px"
                      height="48px"
                      width="100%"
                      borderColor="#E4E4E4"
                    />
                  </Box>
                  <Box width="calc(100% - 240px)">
                    <Input
                      type="text"
                      placeholder={'ENS or Ethereum wallet address'}
                      borderRadius="16px"
                      paddingRight="24px"
                      height="48px"
                      width="100%"
                      borderColor="#E4E4E4"
                    />
                  </Box>
                </Box>
              </Box>
              <Box marginTop="8px">
                <Box fontWeight="800" fontFamily="14px" color="#FF2E79" cursor="pointer">
                  + Add another guardian
                </Box>
              </Box>
              <Box marginTop="30px" display="flex" justifyContent="flex-end">
                <Box>
                  <Button theme="light" padding="0 14px" marginRight="16px">Back</Button>
                  <Button>Confirm</Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
