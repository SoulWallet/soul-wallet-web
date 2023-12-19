import React from 'react';
import { Text, Button } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

export default function Heading4({
  children,
  ...restProps
}: any) {
  return (
    <Text fontSize="14px" fontWeight="700" color="black" {...restProps}>
      {children}
    </Text>
  );
}
