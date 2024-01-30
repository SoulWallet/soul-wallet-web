import { Fragment } from 'react'
import {
  Box,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Tooltip,
} from '@chakra-ui/react'
import { Connector, useConnect } from 'wagmi'
import TextBody from '@/components/new/TextBody'
import Title from '@/components/new/Title'
// import ArrowRightIcon from '@/components/Icons/ArrowRight'
import PasskeyIcon from '@/components/Icons/Auth/Passkey'
import QuestionIcon from '@/components/Icons/Auth/Question'
import Button from '@/components/new/Button'
import { supportedEoas } from '@/config'
import SuccessIcon from "@/components/Icons/Success";
import WalletOption from '@/components/new/WalletOption'
import { getWalletIcon } from '@/lib/tools'
import { passkeyTooltipText } from '@/config/constants'

export default function RegisterModal({
  isOpen,
  onClose,
  startLogin,
  connectEOA,
  isConnecting,
  isConnected,
  isConnectAtive,
  startRegisterWithPasskey,
  activeConnector,
  address,
  startRegisterWithEOA,
  disconnectEOA
}: any) {
  const { connectors } = useConnect();

  if (isConnected && isConnectAtive) {
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
            Wallet connected
          </ModalHeader>
          <ModalCloseButton top="14px" />
          <ModalBody overflow="auto" padding="20px 32px">
            <Box
              height="100%"
              roundedBottom="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <SuccessIcon />
              <Box fontWeight="700" fontSize="20px" marginBottom="16px">Connected To</Box>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Box
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  borderRadius="12px"
                  width="48px"
                  height="48px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  marginRight="10px"
                >
                  <Image
                    src={getWalletIcon(activeConnector.id)}
                    width="32px"
                    height="32px"
                  />
                </Box>
                <Box
                  minHeight="48px"
                  background="rgba(0, 0, 0, 0.05)"
                  borderRadius="12px"
                  padding="10px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="14px"
                >
                  {address}
                </Box>
              </Box>
              <Box marginTop="60px" display="flex">
                <Button
                  width="100%"
                  theme="dark"
                  color="white"
                  marginBottom="49px"
                  onClick={() => disconnectEOA()}
                  padding="0 20px"
                  marginRight="16px"
                  type="mid"
                >
                  Disconnect
                </Button>
                <Button
                  width="100%"
                  theme="dark"
                  color="white"
                  marginBottom="49px"
                  onClick={() => startRegisterWithEOA(address)}
                  padding="0 20px"
                  type="mid"
                >
                  Continue
                </Button>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }

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
              {!!(isConnecting && isConnectAtive) && (
                <Box width="100%" display="flex" height="calc(100% - 34px)">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    width="100%"
                    paddingBottom="50px"
                  >
                    <Box
                      fontWeight="700"
                      fontFamily="Nunito"
                      fontSize="20px"
                    >
                      Connecting wallet...
                    </Box>
                    <Box
                      fontWeight="600"
                      fontFamily="Nunito"
                      fontSize="14px"
                      color="rgba(0, 0, 0, 0.6)"
                      marginTop="6px"
                    >
                      Please confirm on your wallet extension
                    </Box>
                  </Box>
                </Box>
              )}
              {!(isConnecting && isConnectAtive) && (
                <Box width="100%" display="flex" flexWrap="wrap">
                  {connectors.filter(item => supportedEoas.includes(item.id)).map((connector: Connector) =>
                    <WalletOption
                      key={connector.uid}
                      icon={getWalletIcon(connector.id)}
                      name={connector.id === 'injected' ? 'Browser Wallet' : connector.name}
                      onClick={() => connectEOA(connector)}
                    />
                  )}
                </Box>
              )}
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
            <Box width="calc(40%)" display="flex" alignItems="center" justifyContent="center" flexDirection="column" paddingLeft="25px" position="relative" minHeight="240px">
              <Title type="t2" fontWeight="500">Fresh to Ethereum? Try this!</Title>
              <Title type="t2" fontWeight="500" color="rgba(0, 0, 0, 0.4)" marginBottom="0px">(Or wanna try something better)</Title>
              <Box marginTop="25px" paddingBottom="25px">
                <Button
                  width="100%"
                  theme="dark"
                  color="white"
                  marginBottom="49px"
                  onClick={startRegisterWithPasskey}
                  disabled={isConnecting}
                  padding="0 20px"
                >
                  <Box marginRight="5px"><PasskeyIcon /></Box>
                  Create wallet with passkey
                </Button>
              </Box>
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
