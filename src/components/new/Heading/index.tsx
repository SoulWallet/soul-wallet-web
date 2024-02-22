import { Text } from '@chakra-ui/react';

const getStyles = (type: string = 'h1') => {
  if (type === 'h1') {
    return {
      fontSize: '48px',
      fontWeight: 'bold'
    }
  } else if (type === 'h2') {
    return {
      fontSize: '40px',
      fontWeight: 'bold'
    }
  } else if (type === 'h3') {
    return {
      fontSize: '32px',
      fontWeight: 'bold'
    }
  } else if (type === 'h4') {
    return {
      fontSize: '20px',
      fontWeight: 'bold'
    }
  } else if (type === 'h5') {
    return {
      fontSize: '18px',
      fontWeight: 'bold'
    }
  }
}

export default function Heading({ children, type, ...restProps }: any) {
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
