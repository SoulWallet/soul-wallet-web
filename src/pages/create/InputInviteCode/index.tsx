import React from 'react';
import { Box, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'

export default function InputInviteCode({value, onChange, onNext}: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const disabled = !value

  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="138px">
      <Box
        fontWeight="700"
        fontSize="24px"
        lineHeight="14px"
        marginBottom="20px"
      >
        Invite code
      </Box>
      <Box width="100%" marginBottom="50px">
        <Input value={value} onChange={e => onChange(e.target.value)} fontSize="32px" lineHeight="24px" padding="0" fontWeight="700" placeholder="Enter or paste here" borderRadius="0" border="none" outline="none" _focusVisible={{ border: 'none', boxShadow: 'none' }} />
        <Box marginTop="10px" width="100%" height="1px" background="rgba(73, 126, 130, 0.2)" />
        <Box fontSize="14px" lineHeight="24px" fontWeight="600" marginTop="8px" onClick={onOpen}>What if I don’t have one?</Box>
      </Box>
      <Button disabled={disabled} size="xl" type="blue" width="100%" onClick={onNext}>Continue</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        blockScrollOnMount={true}
      >
        <ModalOverlay />
        <ModalContent
          borderRadius="20px 20px 0 0"
          maxW="100vw"
          height="50vh"
          overflow="auto"
          mb="0"
          marginTop="50vh"

        >
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <Box
              background="#D9D9D9"
              height="120px"
              width="120px"
              borderRadius="120px"
              marginBottom="30px"
            />
            <Box fontSize="24px" fontWeight="700" marginBottom="14px">
              Thanks for your interest
            </Box>
            <Box
              fontSize="16px"
              textAlign="center"
              marginBottom="40px"
            >
              We are currently under internal testing. Please be patient and join our Telegram group. We’ll send out more invitations very soon. Thanks again for your patience.
            </Box>
            <Box width="100%">
              <Button size="xl" type="blue" width="100%">Follow Soul Wallet on X</Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
