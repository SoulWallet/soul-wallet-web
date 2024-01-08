import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

export default function RoundSection({
  children,
  ...props
}: any) {
  return (
    <Box
      border="1px solid #EAECF0"
      borderRadius="20px"
      padding="24px"
      {...props}
    >
      {children}
    </Box>
  );
}
