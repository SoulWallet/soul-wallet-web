import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input
} from '@chakra-ui/react'
import EditGuardianForm from '../EditGuardianForm'

export default function EditGuardianModal({
  isOpen,
  onClose,
  onConfirm,
  setIsEditGuardianOpen,
  setIsSelectGuardianOpen,
  canGoBack
}: any) {
  const onBack = () => {
    setIsEditGuardianOpen(false)
    if (setIsSelectGuardianOpen) setIsSelectGuardianOpen(true)
  }

  const onConfirmLocal = (addresses: any, names: any, threshold: any) => {
    if (onConfirm) onConfirm(addresses, names, threshold)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="700px" borderRadius="20px">
        <ModalCloseButton top="14px" />
        <ModalHeader
          display="flex"
          justifyContent="flex-start"
          gap="5"
          fontWeight="800"
          textAlign="center"
          padding="20px 32px"
        >
          Enter guardians info manually
        </ModalHeader>
        <ModalBody overflow="auto" padding="20px 32px">
          <Box
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="100%" padding="0">
              <Box>
                <EditGuardianForm onConfirm={onConfirmLocal} onBack={onBack} canGoBack={canGoBack} />
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
