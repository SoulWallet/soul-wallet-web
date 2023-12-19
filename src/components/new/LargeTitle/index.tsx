import React from 'react';
import { Text, Button } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

export default function LargeTitle({
  children,
  ...restProps
}: any) {
  return (
    <Text fontSize="40px" fontWeight="700" marginBottom="10px" color="black" {...restProps}>
      {children}
    </Text>
  );
}
