import React from 'react';
import { Text, Button } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

export default function SmallText({
  children,
  ...restProps
}: any) {
  return (
    <Text fontSize="12px" fontWeight="400" color="black" {...restProps}>
      {children}
    </Text>
  );
}
