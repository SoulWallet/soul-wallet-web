import React from 'react';
import { Box, Input } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import FadeId from '@/components/Icons/mobile/FaceId'

export default function CreateSuccess({ onNext }: any) {
  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="138px" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
      <Box width="120px" height="120px" background="#D9D9D9" borderRadius="120px" marginBottom="30px">
      </Box>
      <Box
        fontWeight="700"
        fontSize="24px"
        lineHeight="14px"
        marginBottom="14px"
      >
        Your account is ready
      </Box>
      <Box width="100%" marginBottom="50px">
        <Box fontSize="16px" lineHeight="24px" fontWeight="400" textAlign="center">
          Thanks for setting up your Soul Wallet account. Start saving from now on!
        </Box>
      </Box>
      <Button onClick={onNext} size="xl" type="blue" minWidth="195px">💰 Start saving</Button>
    </Box>
  );
}
