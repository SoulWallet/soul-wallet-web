import {
  Box,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/react'
import { Connector, useConnect } from 'wagmi'
import TextBody from '@/components/new/TextBody'
import Title from '@/components/new/Title'
// import ArrowRightIcon from '@/components/Icons/ArrowRight'
import PasskeyIcon from '@/components/Icons/Auth/Passkey'
import QuestionIcon from '@/components/Icons/Auth/Question'
import Button from '@/components/new/Button'
import MetamaskIcon from '@/assets/wallets/metamask.png'
// import OKXWalletIcon from '@/assets/wallets/okx-wallet.png'
// import CoinbaseIcon from '@/assets/wallets/coinbase.png'
// import BinanceIcon from '@/assets/wallets/binance.png'
import WalletConnectIcon from '@/assets/wallets/wallet-connect.png'
import InjectedIcon from '@/assets/wallets/injected.svg'
import UnknownIcon from '@/assets/wallets/unknown.svg'
// import XDEFIIcon from '@/assets/wallets/xdefi-wallet.png'

const getWalletIcon = (walletId: string) => {
  switch (walletId) {
    case 'injected':
      return InjectedIcon;
    case 'walletConnect':
      return WalletConnectIcon;
    case 'io.metamask':
      return MetamaskIcon;
    default:
      return UnknownIcon;
  }
}

export default function RegisterModal({ isOpen, onClose, startLogin }: any) {
  const { connectors, connect } = useConnect();
  console.log('connectors', connectors)
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
          borderBottom="1px solid #d7d7d7"
          padding="20px 32px"
        >
          Create a Soul wallet
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
                Already have a wallet? Connect here!
              </Title>
              <Box width="100%" display="flex" flexWrap="wrap">
                {connectors.map((connector: Connector) =>   <Box
                  display="flex"
                  alignItems="center"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  borderRadius="12px"
                  padding="16px"
                  marginRight="16px"
                  marginBottom="24px"
                  width="45%"
                  cursor={"pointer"}
                  onClick={() => connect({connector})}
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
                    <Image src={getWalletIcon(connector.id)} width="32px" height="32px" />
                  </Box>
                  <TextBody>{connector.name}</TextBody>
                </Box>)}
                {/* <Box
                  display="flex"
                  alignItems="center"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  borderRadius="12px"
                  padding="16px"
                  marginRight="16px"
                  marginBottom="24px"
                  width="45%"
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
                  marginRight="16px"
                  marginBottom="24px"
                  width="45%"
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
                  marginRight="16px"
                  marginBottom="24px"
                  width="45%"
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
                  marginRight="16px"
                  marginBottom="24px"
                  width="45%"
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
                  marginRight="16px"
                  marginBottom="24px"
                  width="45%"
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
                </Box> */}
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
              <Title type="t2" fontWeight="500">Fresh to Ethereum? Try this!</Title>
              <Title type="t2" fontWeight="500" color="rgba(0, 0, 0, 0.4)" marginBottom="25px">(Or wanna try something better)</Title>
              <Button
                width="100%"
                theme="dark"
                color="white"
                marginBottom="49px"
                onClick={startLogin}
              >
                <Box marginRight="10px"><PasskeyIcon /></Box>
                Create wallet with passkey
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
