import { WalletContextProvider } from '@/context/WalletContext';
import { Outlet, useLocation } from 'react-router-dom';
import FindRoute from '@/components/FindRoute';
import Pooling from '../components/Pooling';
import CommonWrapper from './CommonWrapper';
import { Box } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import FadeSwitch from '@/components/FadeSwitch';

export default function Wrapper() {
  const location = useLocation();
  return (
    <CommonWrapper>
      <FindRoute>
        <WalletContextProvider>
          <AnimatePresence>
            <Box maxW={'430px'} pos={'relative'} color="#000" mx="auto">
              <FadeSwitch key={location.pathname}>
                <Outlet />
              </FadeSwitch>
            </Box>
          </AnimatePresence>
          <Pooling />
        </WalletContextProvider>
      </FindRoute>
    </CommonWrapper>
  );
}
