import { Box } from '@chakra-ui/react';

export default function AppContainer({ children, ...restProps }: any) {
  return (
    <Box
      py={{ base: '6', lg: '40px' }}
      px={{ base: 6, lg: '90px' }}
      mx="auto"
      maxW="1520px"
      position={'relative'}
      {...restProps}
    >
      {children}
    </Box>
  );
}
