/**
 * Find the correct route to go
 */

import { ReactNode, useEffect } from 'react';
import useBrowser from '../hooks/useBrowser';
import { Box } from '@chakra-ui/react';
import { useAddressStore } from '@/store/address';
import storage from '@/lib/storage';
import { useLocation } from 'react-router-dom';
import { storeVersion } from '@/config';
import useTools from '@/hooks/useTools';
import { useTempStore } from '@/store/temp';

export default function FindRoute({ children }: { children: ReactNode }) {
  const { navigate } = useBrowser();
  const location = useLocation();
  const { addressList, selectedAddress } = useAddressStore();
  const { clearLogData } = useTools();
  const { createInfo } = useTempStore();

  const findRoute = async () => {
    const storageVersion = storage.getItem('storeVersion');
    const isRecoverPage = location.pathname.includes('recover');
    const isCreatePage = location.pathname.includes('create');
    const isLaunchPage = location.pathname.includes('launch');
    const isAuthPage = location.pathname.includes('auth');

    if (storeVersion !== storageVersion) {
      storage.setItem('storeVersion', storeVersion);
      clearLogData();
      navigate('/auth', { replace: true });
    }

    if (
      !createInfo.eoaAddress &&
      !(createInfo.credentials?.length >0) &&
      !selectedAddress &&
      !isRecoverPage &&
      !isCreatePage &&
      !isAuthPage
    ) {
      navigate({
        pathname: '/auth',
        search: location.search,
      });
    } else if (isLaunchPage && addressList.length && selectedAddress) {
      navigate({
        pathname: '/dashboard',
      });
    }
  };

  useEffect(() => {
    findRoute();
  }, []);

  return (
    <Box bg="appBg" fontSize={'16px'} overflow={'auto'}>
      {children}
    </Box>
  );
}
