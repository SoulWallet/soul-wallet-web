import { WalletContextProvider } from '@/context/WalletContext';
import { Outlet } from 'react-router-dom';
import FindRoute from '@/components/FindRoute';
import DashboardLayout from '@/components/Layouts/DashboardLayout';
import Pooling from '../components/Pooling';
import CommonWrapper from './CommonWrapper';

export default function Wrapper() {
  return (
    <CommonWrapper>
      <FindRoute>
        <WalletContextProvider>
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
          <Pooling />
        </WalletContextProvider>
      </FindRoute>
    </CommonWrapper>
  );
}
