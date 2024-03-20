import React from 'react';
import { Box, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import Header from '@/components/mobile/Header'
import ArrowRightIcon from '@/components/Icons/mobile/ArrowRight'
import { toShortAddress } from '@/lib/tools';

export default function Review({ onPrev, value, sendTo, onSetSendTo, onNext }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box width="100%" height="100%">
      <Header
        title="Review"
        showBackButton
        onBack={onPrev}
        marginTop="18px"
      />
      <Box padding="30px" minHeight="100vh">
        <Box borderBottom="1px solid rgba(0, 0, 0, 0.10)">
          <Box fontSize="16px" fontWeight="400" marginBottom="12px" color="#818181">Amount</Box>
          <Box display="flex" alignItems="flex-end">
            <Box
              fontSize="80px"
              padding="0"
              fontWeight="700"
              placeholder="0.00"
              borderRadius="0"
              border="none"
              outline="none"
            >
              {value}
            </Box>
            <Box
              fontSize="30px"
              padding="0"
              fontWeight="700"
              placeholder="0.00"
              borderRadius="0"
              border="none"
              outline="none"
              marginLeft="6px"
              color="rgba(0, 0, 0, 0.3)"
              marginBottom="26px"
            >
              USDC
            </Box>
          </Box>
        </Box>
        <Box marginTop="30px">
          <Box fontSize="16px" fontWeight="400" marginBottom="12px" color="#818181">Withdraw from</Box>
          <Box
            fontSize="18px"
            padding="0"
            fontWeight="700"
            placeholder="0.00"
            borderRadius="0"
            border="none"
            outline="none"
            display="flex"
          >
            <Box width="24px" height="24px" borderRadius="24px" background="#d9d9d9" marginRight="8px" />
            <Box marginRight="8px">AAVE protocol</Box>
            <Box as="span" fontWeight="400">({toShortAddress(import.meta.env.VITE_AAVE_USDC_POOL)})</Box>
          </Box>
        </Box>
        <Box marginTop="30px">
          <Box fontSize="16px" fontWeight="400" marginBottom="12px" color="#818181">Transaction fee</Box>
          <Box
            fontSize="18px"
            padding="0"
            fontWeight="700"
            placeholder="0.00"
            borderRadius="0"
            border="none"
            outline="none"
          >
            Free <Box as="span" textDecoration="line-through" color="rgba(0, 0, 0, 0.60)">$2.063</Box>
          </Box>
          <Box color="#0CB700" fontSize="14px">This fee is sponsored by Soul Wallet Labs</Box>
        </Box>
        <Box marginTop="30px">
          <Box fontSize="16px" fontWeight="400" marginBottom="12px" color="#818181">Send to</Box>
          <Box
            fontSize="16px"
            padding="0"
            fontWeight="700"
            placeholder="0.00"
            borderRadius="0"
            border="none"
            outline="none"
            color="#497EE6"
            cursor="pointer"
            onClick={onOpen}
            display="flex"
            alignItems="center"
          >
            <Box>Set up wallet address</Box>
            <Box marginLeft="4px">
              <ArrowRightIcon />
            </Box>
          </Box>
        </Box>

        <Box
          marginTop="100px"
          width="100%"
        >
          <Button size="xl" type="blue" width="100%" onClick={onNext}>Confirm</Button>
        </Box>
      </Box>
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
          <ModalHeader fontSize="18px" fontWeight="800">
            Send to
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box borderBottom="1px solid rgba(73, 126, 180, 0.2)">
              <Input
                value={sendTo}
                onChange={e=> onSetSendTo(e.target.value)}
                fontSize="15px"
                lineHeight="100%"
                padding="0"
                fontWeight="700"
                borderRadius="0"
                border="none"
                outline="none"
                placeholder="Enter wallet address or ENS"
                _focusVisible={{ border: 'none', boxShadow: 'none' }}
              />
            </Box>
            <Box
              background="rgba(73, 126, 230, 0.10)"
              borderRadius="12px"
              padding="10px"
              marginTop="51px"
              fontSize="14px"
            >
              Confirm deposit address is on <Box as="span" fontWeight="700">Arbitrum</Box>; deposit to other networks could result in lost assets.
            </Box>
            <Box marginTop="14px">
              <Button size="xl" type="blue" width="100%" onClick={onNext}>Confirm</Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
