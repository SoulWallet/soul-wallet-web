import {
  useState,
  useCallback
} from 'react'
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/react'
import TextBody from '@/components/new/TextBody'
import ArrowRightIcon from '@/components/Icons/ArrowRight'

export default function IntroGuardianModal({
  isOpen,
  setIsIntroGuardianOpen,
  setIsSelectGuardianOpen
}: any) {
  const [showQuestion1, setShowQuestion1] = useState(false)
  const [showQuestion2, setShowQuestion2] = useState(false)
  const [showQuestion3, setShowQuestion3] = useState(false)

  const handleClose = useCallback(() => {
    setIsIntroGuardianOpen(false)
    setIsSelectGuardianOpen(true)
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent maxW="840px" borderRadius="20px">
        <ModalHeader
          display="flex"
          justifyContent="flex-start"
          gap="5"
          fontWeight="800"
          textAlign="center"
          padding="20px 32px"
        >
          What’s guardian?
        </ModalHeader>
        <ModalCloseButton top="14px" />
        <ModalBody overflow="auto" padding="0px 32px">
          <Box
            h="100%"
            roundedBottom="20px"
          >
            <Box width="100%">
              <Box as="video" width="100%" aspectRatio="auto" borderRadius="24px" marginBottom="16px" controls>
                <source src="https://static-assets.soulwallet.io/videos/guardians-and-recovery-intro.webm" type="video/webm" />
              </Box>
            </Box>
            <Box padding="10px 0 30px">
              <Box marginBottom="16px">
                <Box display="flex" alignItems="center" justifyContent="flex-start" mb="5px" cursor="pointer" onClick={() => setShowQuestion1(!showQuestion1)}>
                  <Box transform={showQuestion1 ? 'rotate(90deg)' : ''} mr="5px"><ArrowRightIcon /></Box>
                  <TextBody fontSize="16px" fontWeight="800" mr="10px">
                    What is Soul Wallet guardian?
                  </TextBody>
                </Box>
                {showQuestion1 && (
                  <Box maxWidth="560px">
                    <TextBody fontSize="14px" fontWeight="700">
                      Guardians are Ethereum wallet addresses that assist you in recovering your wallet if needed. Soul Wallet replaces recovery phrases with guardian-signature social recovery, improving security and usability.
                    </TextBody>
                  </Box>
                )}
              </Box>
              <Box marginBottom="16px">
                <Box display="flex" alignItems="center" justifyContent="flex-start" mb="5px" cursor="pointer" onClick={() => setShowQuestion2(!showQuestion2)}>
                  <Box transform={showQuestion2 ? 'rotate(90deg)' : ''} mr="5px"><ArrowRightIcon /></Box>
                  <TextBody fontSize="16px" fontWeight="800" mr="1opx">
                    What wallet can be set as guardian?
                  </TextBody>
                </Box>
                {showQuestion2 && (
                  <Box maxWidth="560px">
                    <TextBody fontSize="14px" fontWeight="700">
                      Choose trusted friends or use your existing Ethereum wallets as guardians. You can setup using regular Ethereum wallets (e.g MetaMask, Ledger, Coinbase Wallet, etc) and other Soul Wallets as your guardians. If choosing a Soul Wallet as your guardian, ensure it's activated on Ethereum for social recovery.
                    </TextBody>
                  </Box>
                )}
              </Box>
              <Box>
                <Box display="flex" alignItems="center" justifyContent="flex-start" mb="5px" cursor="pointer" onClick={() => setShowQuestion3(!showQuestion3)}>
                  <Box transform={showQuestion3 ? 'rotate(90deg)' : ''} mr="5px"><ArrowRightIcon /></Box>
                  <TextBody fontSize="16px" fontWeight="800">
                    What is wallet recovery?
                  </TextBody>
                </Box>
                {showQuestion3 && (
                  <Box maxWidth="560px">
                    <TextBody fontSize="14px" fontWeight="700">
                      If your Soul Wallet is lost or stolen, social recovery helps you easily retrieve wallets with guardian signatures. The guardian list will be stored in an Ethereum-based keystore contract.
                    </TextBody>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
