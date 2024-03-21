import React from 'react';
import { Box, Image, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import Header from '@/components/mobile/Header'
import ArrowRightIcon from '@/components/Icons/mobile/ArrowRight'
import { toShortAddress } from '@/lib/tools';
import AAVEIcon from '@/assets/mobile/aave.png'

const getFontSize = (value: any) => {
  const length = value ? String(value).length : 0

  if (length > 9) {
    return '30px'
  } else if (length > 5) {
    return '50px'
  }

  return '80px'
}

const getFontBottomMargin = (value: any) => {
  const length = value ? String(value).length : 0

  if (length > 9) {
    return '0px'
  } else if (length > 5) {
    return '10px'
  }

  return '26px'
}

export default function Review({ onPrev, value, sendTo, onSetSendTo, onNext }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const disabled = !sendTo
  const fontSize = getFontSize(value)
  const fontBottomMargin = getFontBottomMargin(value)

  return (
    <Box width="100%" height="100%">
      <Header
        title="Review"
        showBackButton
        onBack={onPrev}
        marginTop="18px"
      />
      <Box padding="30px" minHeight="100vh" marginTop="50px">
        <Box borderBottom="1px solid rgba(0, 0, 0, 0.10)">
          <Box fontSize="16px" fontWeight="400" marginBottom="12px" color="#818181">Amount</Box>
          <Box display="flex" alignItems="flex-end">
            <Box
              fontSize={fontSize}
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
              marginBottom={fontBottomMargin}
            >
              USDC
            </Box>
          </Box>
        </Box>
        <Box borderBottom="1px solid rgba(73, 126, 180, 0.2)" marginTop="55px">
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
          marginTop="12.5px"
          fontSize="14px"
        >
          Confirm deposit address is on <Box as="span" fontWeight="700">Arbitrum</Box>; deposit to other networks could result in lost assets.
        </Box>
        <Box
          marginTop="40px"
          width="100%"
        >
          <Button disabled={disabled} size="xl" type="blue" width="100%" onClick={onNext}>Confirm</Button>
        </Box>
      </Box>
    </Box>
  );
}
