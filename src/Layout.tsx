import { WalletContextProvider } from '@/context/WalletContext';
import { ChakraProvider } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Fonts from '@/styles/Fonts';
import FindRoute from '@/components/FindRoute';
import Theme from '@/styles/Theme';
import Pooling from './components/Pooling';
import EnvCheck from './components/EnvCheck';

export default function Layout() {
  return (
    <ChakraProvider theme={Theme} toastOptions={{ defaultOptions: { duration: 1000, position: 'top-right' }, }}>
      <Fonts />
      <EnvCheck>
        <FindRoute>
          <WalletContextProvider>
            <Outlet />
            <Pooling />
          </WalletContextProvider>
        </FindRoute>
      </EnvCheck>
    </ChakraProvider>
  );
}
