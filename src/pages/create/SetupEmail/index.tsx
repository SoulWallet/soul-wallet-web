import React from 'react';
import { Box, Input } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'

export default function SepupEmail({ onNext, onSkip }: any) {
  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="138px">
      <Box
        fontWeight="700"
        fontSize="24px"
        lineHeight="14px"
        marginBottom="20px"
      >
        Set up email
      </Box>
      <Box width="100%" marginBottom="50px">
        <Input fontSize="32px" lineHeight="24px" padding="0" fontWeight="700" placeholder="Enter or paste here" borderRadius="0" border="none" outline="none" _focusVisible={{ border: 'none', boxShadow: 'none' }} />
        <Box marginTop="10px" width="100%" height="1px" background="rgba(73, 126, 130, 0.2)" />
        <Box fontSize="14px" lineHeight="24px" fontWeight="600" marginTop="8px">Why I need to set up email?</Box>
      </Box>
      <Button size="xl" type="blue" width="100%" onClick={onNext}>Continue</Button>
      <Button size="xl" type="text" width="100%" marginTop="15px" onClick={onSkip}>Skip</Button>
    </Box>
  );
}
