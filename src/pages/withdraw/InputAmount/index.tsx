import React from 'react';
import { Box, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import Header from '@/components/mobile/Header'

export default function InputAmount({ onPrev, onChange, onNext }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box width="100%" height="100%">
      <Header
        title="Withdraw USDC"
        showBackButton
        onBack={onPrev}
        marginTop="18px"
      />
      <Box padding="30px" minHeight="100vh">
        <Box marginTop="128px">
          <Input
          // onChange={e => onChange(e.target.value)}
            fontSize="100px"
            lineHeight="100%"
            height="110px"
            padding="0"
            fontWeight="700"
            placeholder="0.00"
            borderRadius="0"
            border="none"
            outline="none"
            textAlign="center"
            _focusVisible={{ border: 'none', boxShadow: 'none' }}
          />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginTop="5px"
        >
          <Box
            fontWeight="600"
            fontSize="14px"
          >
            Available: 180 USDC
          </Box>
          <Box
            background="rgba(225, 220, 252, 0.80)"
            color="#6A52EF"
            fontSize="14px"
            borderRadius="48px"
            padding="2px 12px"
            fontWeight="800"
            marginLeft="10px"
          >
            MAX
          </Box>
        </Box>
        <Box
          marginTop="200px"
          width="100%"
        >
          <Button size="xl" type="blue" width="100%" onClick={onNext}>Continue</Button>
        </Box>
      </Box>
    </Box>
  );
}
