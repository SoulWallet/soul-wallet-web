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
  Tooltip,
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
import { supportedEoas } from '@/config'
import { Connector, useConnect } from 'wagmi'
import WalletOption from '@/components/new/WalletOption'
import { getWalletIcon } from '@/lib/tools'
import { passkeyTooltipText } from '@/config/constants'

export default function LoginModal({
  isOpen,
  onClose,
  startLoginWithEOA,
  startLoginWithPasskey,
  isLoging
}: any) {
  const { connectors } = useConnect();

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
          padding="20px 32px"
        >
          Login to Soul Wallet
        </ModalHeader>
        <ModalCloseButton top="14px" />
        <ModalBody overflow="auto" padding="20px 32px">
          <Box
            height="100%"
            roundedBottom="20px"
            display="flex"
            flexDirection={{ base: 'column', md: 'row' }}
          >
            <Box
              width={{ base: '100%', md: 'calc(60% - 20px)' }}
            >
              <Box width="100%" display="flex" flexWrap="wrap" marginTop="20px">
                {connectors.filter(item => supportedEoas.includes(item.id)).map((connector: Connector) =>
                  <WalletOption
                    key={connector.uid}
                    icon={getWalletIcon(connector.id)}
                    name={connector.id === 'injected' ? 'Browser Wallet' : connector.name}
                    onClick={() => {
                      startLoginWithEOA(connector)
                    }}
                  />
                )}
              </Box>
            </Box>
            <Box
              width={{ base: '100%', md: '20px' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
              margin="0 auto"
            >
              <Box
                width={{ base: '100%', md: '1px' }}
                height={{ base: '1px', md: '100%' }}
                background="rgba(0, 0, 0, 0.1)"
                position="absolute"
              />
              <TextBody
                fontWeight="normal"
                width={{ base: '80px', md: '20px' }}
                height={{ base: '20px', md: '80px' }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                background="white"
                zIndex="1"
              >
                or
              </TextBody>
            </Box>
            <Box
              width={{ base: '100%', md: 'calc(40%)' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              paddingLeft="25px"
              position="relative"
              paddingTop="40px"
            >
              <Button
                width="100%"
                type="black"
                color="white"
                marginBottom="49px"
                onClick={startLoginWithPasskey}
                disabled={isLoging}
                loading={isLoging}
                size="xl"
              >
                <Box marginRight="10px"><PasskeyIcon /></Box>
                Login with passkey
              </Button>
              <Tooltip hasArrow bg='brand.black' label={passkeyTooltipText}>
                <Box position="absolute" width="100%" bottom="16px" display="flex" alignItems="center" justifyContent="center">
                  <TextBody fontSize="14px" fontWeight="600" color="rgba(0, 0, 0, 0.6)" display="flex" alignItems="center">
                    What is passkey?
                    <Box as="span" marginLeft="5px"><QuestionIcon /></Box>
                  </TextBody>
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
