import React from 'react';
import { Text, Button } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

const getStyles = (type: string = 'd1') => {
  if (type === 'd1') {
    return {
      fontSize: '16px',
      fontWeight: 'normal'
    }
  } else if (type === 'd2') {
    return {
      fontSize: '14px',
      fontWeight: '800'
    }
  } else if (type === 'd3') {
    return {
      fontSize: '12px',
      fontWeight: 'normal'
    }
  }
}

export default function Description({ children, type, ...restProps }: any) {
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
