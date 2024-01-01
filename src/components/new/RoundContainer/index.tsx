import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

export default function RoundContainer({
  children,
  ...props
}: any) {
  return (
    <Box
      boxShadow="0px 4px 30px 0px rgba(0, 0, 0, 0.05)"
      borderRadius="20px"
      padding="45px"
      {...props}
    >
      {children}
    </Box>
  );
}
