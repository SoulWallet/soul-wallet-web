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
import PasskeyIcon from '@/components/Icons/Auth/Passkey'
import QuestionIcon from '@/components/Icons/Auth/Question'
import Button from '@/components/Button'
import { supportedEoas } from '@/config'
import SuccessIcon from "@/components/Icons/Success";
import WalletOption from '@/components/new/WalletOption'
import { getWalletIcon } from '@/lib/tools'
import { passkeyTooltipText } from '@/config/constants'

export default function RegisterModal({
  isOpen,
  onClose,
  connectEOA,
  isConnecting,
  isConnected,
  isConnectAtive,
  startRegisterWithPasskey,
  activeConnector,
  address,
  startRegisterWithEOA,
}: any) {
  const { connectors } = useConnect();

  if (isConnected && isConnectAtive && activeConnector) {
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
              <Box display="flex" alignItems="center" justifyContent="center" maxWidth="100%" flexWrap="wrap" gap="10px">
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
                  type="black"
                  color="white"
                  marginBottom="49px"
                  onClick={() => startRegisterWithEOA(address)}
                  padding="0 20px"
                  size="mid"
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
            flexDirection={{ base: 'column', md: 'row' }}
          >
            <Box
              width={{ base: '100%', md: 'calc(60% - 20px)' }}
            >
              <Title type="t2" marginBottom="20px">
                Already have a wallet? Connect here!
              </Title>
              {!!(isConnecting && isConnectAtive) && (
                <Box
                  width="100%"
                  display="flex"
                  height={{ base: '100%', md: 'calc(100% - 34px)' }}
                >
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
                <Box
                  width="100%"
                  display="flex"
                  flexWrap="wrap"
                  justifyContent={{ base: 'space-between', md: 'flex-start' }}
                >
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
              paddingLeft={{ base: '0px', md: '25px' }}
              position="relative"
              minHeight="240px"
            >
              <Title type="t2" fontWeight="500">Fresh to Ethereum?</Title>
              <Title type="t2" fontWeight="500" color="rgba(0, 0, 0, 0.4)" marginBottom="0px">(Or wanna try something better)</Title>
              <Box marginTop="25px" paddingBottom="25px">
                <Button
                  width="100%"
                  type="black"
                  color="white"
                  marginBottom="49px"
                  onClick={startRegisterWithPasskey}
                  disabled={isConnecting}
                  padding="0 20px"
                  size="xl"
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
