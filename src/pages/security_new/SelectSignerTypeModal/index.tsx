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
import EOAGuardianIcon from '@/assets/icons/eoa-guardian.svg'
import PasskeySignerIcon from '@/assets/icons/passkey-signer.svg'

export default function SelectSignerTypeModal({ isOpen, onClose, startWalletConnect }: any) {
  const selectWalletExtension = useCallback(() => {
    onClose()
    startWalletConnect()
  }, [])

  const selectPasskey = useCallback(() => {
    onClose()
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="840px" borderRadius="20px">
        <ModalHeader
          display="flex"
          justifyContent="flex-start"
          gap="5"
          fontWeight="800"
          textAlign="center"
          // borderBottom="1px solid #d7d7d7"
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
            <Box width="100%">
              <Box width="100%" display="flex" flexWrap="wrap">
                <Box
                  display="flex"
                  alignItems="center"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  borderRadius="12px"
                  padding="16px"
                  marginRight="16px"
                  marginBottom="24px"
                  width="100%"
                  cursor="pointer"
                  onClick={selectWalletExtension}
                >
                  <Box
                    flexBasis={"0 0 60px"}
                    width="60px"
                    height="60px"
                    borderRadius="60px"
                    marginRight="12px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    background="rgba(0, 0, 0, 0.05)"
                  >
                    <Image src={EOAGuardianIcon} />
                  </Box>
                  <Box>
                    <TextBody fontSize="18px">Wallet extension</TextBody>
                    <TextBody type="t2">Sign transaction with your installed browser wallet. Cheaper, old school way! </TextBody>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  borderRadius="12px"
                  padding="16px"
                  marginRight="16px"
                  marginBottom="24px"
                  width="100%"
                  cursor="pointer"
                >
                  <Box
                    width="60px"
                    height="60px"
                    flex={"0 0 60px"}
                    borderRadius="60px"
                    marginRight="12px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    background="rgba(0, 0, 0, 0.05)"
                  >
                    <Image src={PasskeySignerIcon} />
                  </Box>
                  <Box>
                    <TextBody fontSize="18px">Passkey</TextBody>
                    <TextBody type="t2">Sign transaction with passkey saved on your device. Safer, but twice more expensive on L2!</TextBody>
                    <TextBody type="t2" color="#797979">If you're an Apple user, you can even sync your passkey across all devices end to end encrypted via icloud keychain. </TextBody>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
