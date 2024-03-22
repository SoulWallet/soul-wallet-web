import { WalletContextProvider } from '@/context/WalletContext';
import { Outlet, useLocation } from 'react-router-dom';
import FindRoute from '@/components/FindRoute';
import Pooling from '../components/Pooling';
import CommonWrapper from './CommonWrapper';
import { Box } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Wrapper() {
  const location = useLocation();
  return (
    <CommonWrapper>
      <FindRoute>
        <WalletContextProvider>
          <AnimatePresence>
            <Box maxW={'430px'} pos={'relative'} color="#000" mx="auto">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Outlet />
              </motion.div>
            </Box>
          </AnimatePresence>
          <Pooling />
        </WalletContextProvider>
      </FindRoute>
    </CommonWrapper>
  );
}
