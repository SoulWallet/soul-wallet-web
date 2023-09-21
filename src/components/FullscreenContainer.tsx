import { ReactNode } from 'react';
import Logo from '@/components/web/Logo';
import { Box } from '@chakra-ui/react';

export default function FullscreenContainer({ children }: { children: ReactNode }) {
  return (
    <Box
      background="#F7F7F7"
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      flexDirection="column"
      padding="32px 0"
      position="relative"
      height="100vh"
      width="100%"
    >
      <Logo />
      <Box background="rgba(255, 255, 255, 0.02)" padding="1em" marginTop="1em">
        {children}
      </Box>
    </Box>
  );
}
