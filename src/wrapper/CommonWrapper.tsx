import { ChakraProvider } from '@chakra-ui/react';
import Fonts from '@/styles/Fonts';
import Theme from '@/styles/Theme';
import EnvCheck from '../components/EnvCheck';
import WagmiContext from '../components/WagmiContext';
import { ReactNode } from 'react';

export default function CommonWrapper({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider theme={Theme} toastOptions={{ defaultOptions: { duration: 1300, position: 'top-right' } }}>
      <Fonts />
      <EnvCheck>
        {/* <WagmiContext> */}
          {children}
          {/* </WagmiContext> */}
      </EnvCheck>
    </ChakraProvider>
  );
}
