import React, { useState } from 'react';
import { Box, Image, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import Header from '@/components/mobile/Header'
import ArrowRightIcon from '@/components/Icons/mobile/ArrowRight'
import CompletedIcon from '@/components/Icons/mobile/Completed'
import { toShortAddress } from '@/lib/tools';
import AAVEIcon from '@/assets/mobile/aave.png'
import LoadingIcon from '@/assets/mobile/loading.gif'

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
  const [isTransfering, setIsTransfering] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
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
      <Box padding="30px" minHeight="100vh">
        {isTransfering && (
          <Box
            fontSize="32px"
            fontWeight="700"
            lineHeight="42px"
            textAlign="center"
            height="229px"
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            flexDirection="column"
          >
            <Box marginBottom="6px">
              <Image width="80px" height="60px" src={LoadingIcon} />
            </Box>
            <Box>Transfer in progress</Box>
          </Box>
        )}
        {isCompleted && (
          <Box
            fontSize="32px"
            fontWeight="700"
            lineHeight="42px"
            textAlign="center"
            height="229px"
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            flexDirection="column"
          >
            <Box marginBottom="20px">
              <CompletedIcon />
            </Box>
            <Box>Transfer completed</Box>
          </Box>
        )}
        {(!isCompleted && !isTransfering) && (
          <Box
            fontSize="32px"
            fontWeight="700"
            lineHeight="42px"
            textAlign="center"
            height="229px"
            display="flex"
            alignItems="flex-end"
            justifyContent="center"
          >
            Please confirm the detail below
          </Box>
        )}
        <Box
          width="100%"
          borderRadius="24px"
          background="white"
          padding="24px"
          marginTop="40px"
          display="flex"
          flexDirection="column"
          boxShadow="0px 4px 60px 0px rgba(44, 53, 131, 0.08)"
        >
          <Box
            paddingTop="13px"
            paddingBottom="27px"
            borderBottom="1px solid rgba(73, 126, 230, 0.2)"
          >
            <Box
              fontSize="16px"
              color="#818181"
              marginBottom="16px"
            >
              Transfer
            </Box>
            <Box
              fontSize="32px"
              fontWeight="700"
            >
              100 USDC
            </Box>
          </Box>
          <Box
            paddingTop="26px"
            paddingBottom="12px"
          >
            <Box
              fontSize="16px"
              color="#818181"
              marginBottom="16px"
            >
              To
            </Box>
            <Box
              fontSize="18px"
              fontWeight="700"
            >
              0x3c97a7714f0121f5fe9255ca810dfdc6b8837bad
            </Box>
          </Box>
        </Box>
        <Box
          marginTop="40px"
          width="100%"
        >
          <Button size="xl" type="blue" width="100%" onClick={onNext}>Confirm</Button>
        </Box>
      </Box>
    </Box>
  );
}
