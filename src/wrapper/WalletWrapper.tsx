import { WalletContextProvider } from '@/context/WalletContext';
import { Outlet } from 'react-router-dom';
import FindRoute from '@/components/FindRoute';
import Pooling from '../components/Pooling';
import CommonWrapper from './CommonWrapper';

export default function Wrapper() {
  return (
    <CommonWrapper>
      <FindRoute>
        <WalletContextProvider>
          <Outlet />
          <Pooling />
        </WalletContextProvider>
      </FindRoute>
    </CommonWrapper>
  );
}
