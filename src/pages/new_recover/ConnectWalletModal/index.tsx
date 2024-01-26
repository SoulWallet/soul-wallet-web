import { Fragment } from 'react'
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
import { supportedEoas } from '@/config'
import SuccessIcon from "@/components/Icons/Success";
import WalletOption from '@/components/new/WalletOption'
import { getWalletIcon } from '@/lib/tools'

export default function ConnectWalletModal({
  isOpen,
  onClose,
  addEOA,
  isConnecting,
  isConnected,
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
          // borderBottom="1px solid #d7d7d7"
          padding="20px 32px"
        >
          Connect wallet
        </ModalHeader>
        <ModalCloseButton top="14px" />
        <ModalBody overflow="auto" padding="20px 32px">
          <Box
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="calc(60% - 20px)">
              {!!(isConnecting) && (
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
              {!(isConnecting) && (
                <Box width="100%" display="flex" flexWrap="wrap">
                  {connectors.filter(item => supportedEoas.includes(item.id)).map((connector: Connector) =>
                    <WalletOption
                      key={connector.uid}
                      icon={getWalletIcon(connector.id)}
                      name={connector.id === 'injected' ? 'Browser Wallet' : connector.name}
                      onClick={() => addEOA(connector)}
                    />
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
