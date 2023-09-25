import { Box } from '@chakra-ui/react';

export default function AppContainer({ children, ...restProps }: any) {
  return (
    <Box py="40px" px="90px" mx="auto" maxW="1520px" position={'relative'} {...restProps}>
      {children}
    </Box>
  );
}
