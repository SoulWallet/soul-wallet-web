import React from 'react';
import { Box, Input } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import FadeId from '@/components/Icons/mobile/FaceId'

export default function WithdrawSuccess({ onNext }: any) {
  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="138px" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
      <Box width="120px" height="120px" background="#D9D9D9" borderRadius="120px" marginBottom="30px">
      </Box>
      <Box
        fontWeight="700"
        fontSize="24px"
        lineHeight="14px"
      >
        Withdraw completed
      </Box>
      <Box
        fontWeight="700"
        fontSize="48px"
        marginTop="18px"
        color="#497EE6"
      >
        180 USDC
      </Box>
      <Box
        fontSize="16px"
        marginTop="18px"
        color="#818181"
      >
        Send to
      </Box>
      <Box width="100%" marginBottom="50px">
        <Box fontSize="15px" fontWeight="400" textAlign="center">
          0x3c97a7714f0121f5fe9255ca810dfdc6b8837bad
        </Box>
      </Box>
      <Button onClick={onNext} size="xl" type="blue" width="100%">Done</Button>
      <Box color="rgba(0, 0, 0, 0.3)" fontSize="14px" marginTop="16px" textAlign="center">
        This transaction may takes a few minutes to complete.
      </Box>
    </Box>
  );
}
