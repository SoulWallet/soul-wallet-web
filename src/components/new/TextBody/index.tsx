import { Text, TextProps } from '@chakra-ui/react';

const getStyles = (type: string = 't1') => {
  if (type === 't1') {
    return {
      fontSize: '14px',
      fontWeight: '700'
    }
  } else if (type === 't2') {
    return {
      fontSize: '14px',
      fontWeight: 'normal'
    }
  } else if (type === 't3') {
    return {
      fontSize: '12px',
      fontWeight: 'normal'
    }
  }
}

export default function TextBody({ children, type, ...restProps }: {type?: string} & TextProps) {
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
