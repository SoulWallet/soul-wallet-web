import { Text, TextProps } from '@chakra-ui/react';

export default function Heading3({ children, ...restProps }: TextProps) {
  return (
    <Text fontSize="16px" fontWeight="800" color="#1E1E1E" {...restProps}>
      {children}
    </Text>
  );
}
