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
import Button from '@/components/new/Button'
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

export default function LoginModal({ isOpen, onClose, startLogin, isConnecting, connectEOA, checkLocalWallets }: any) {
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
          // borderBottom="1px solid #d7d7d7"
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
          >
            <Box width="calc(60% - 20px)">
              <Title type="t2" marginBottom="20px">
                Login with Web3 wallet
              </Title>
              <Box width="100%" display="flex" flexWrap="wrap">
                {connectors.filter(item => supportedEoas.includes(item.id)).map((connector: Connector) =>
                  <WalletOption
                    key={connector.uid}
                    icon={getWalletIcon(connector.id)}
                    name={connector.name}
                    onClick={() => connectEOA(connector)}
                  />
                )}
              </Box>
            </Box>
            <Box
              width="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
            >
              <Box width="1px" height="100%" background="rgba(0, 0, 0, 0.1)" position="absolute" />
              <TextBody fontWeight="normal" height="80px" width="20px" display="flex" alignItems="center" justifyContent="center" background="white" zIndex="1">
                or
              </TextBody>
            </Box>
            <Box width="calc(40%)" display="flex" alignItems="center" justifyContent="center" flexDirection="column" paddingLeft="25px" position="relative">
              <Title type="t2" fontWeight="500" marginBottom="25px">Login with device passkey</Title>
              <Button
                width="100%"
                theme="dark"
                color="white"
                marginBottom="49px"
                // onClick={checkLocalWallets}
                onClick={startLogin}
              >
                <Box marginRight="10px"><PasskeyIcon /></Box>
                Login with passkey
              </Button>
              <Box position="absolute" width="100%" bottom="16px" display="flex" alignItems="center" justifyContent="center">
                <TextBody fontSize="14px" fontWeight="600" color="rgba(0, 0, 0, 0.6)" display="flex" alignItems="center">
                  What is passkey?
                  <Box as="span" marginLeft="5px"><QuestionIcon /></Box>
                </TextBody>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
