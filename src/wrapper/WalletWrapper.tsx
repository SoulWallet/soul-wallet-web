import { WalletContextProvider } from '@/context/WalletContext';
import { Outlet } from 'react-router-dom';
import FindRoute from '@/components/FindRoute';
import Pooling from '../components/Pooling';
import CommonWrapper from './CommonWrapper';
import { Box } from '@chakra-ui/react';

export default function Wrapper() {
  return (
    <CommonWrapper>
      <FindRoute>
        <WalletContextProvider>
          <Box maxW={"430px"} mx="auto">
            <Outlet />
          </Box>
          <Pooling />
        </WalletContextProvider>
      </FindRoute>
    </CommonWrapper>
  );
}
