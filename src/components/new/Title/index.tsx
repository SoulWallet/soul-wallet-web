import React from 'react';
import { Text, Button } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

const getStyles = (type: string = 't1') => {
  if (type === 't1') {
    return {
      fontSize: '16px',
      fontWeight: 'bold'
    }
  } else if (type === 't2') {
    return {
      fontSize: '16px',
      fontWeight: 'bold'
    }
  } else if (type === 't3') {
    return {
      fontSize: '14px',
      fontWeight: 'bold'
    }
  }
}

export default function Title({ children, type, ...restProps }: any) {
  return (
    <Text
      fontFamily="Nunito"
      color="black"
      {...getStyles(type)}
      {...restProps}
    >
      {children}
    </Text>
  );
}
