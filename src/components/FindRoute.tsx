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

export default function FindRoute({ children }: {children: ReactNode}) {
  const { navigate } = useBrowser();
  const location = useLocation();
  const { addressList, selectedAddress } = useAddressStore();
  const { clearLogData } = useTools();

  const findRoute = async () => {
    const storageVersion = storage.getItem('storeVersion');
    const isRecoverPage = location.pathname.includes('recover');
    const isCreatePage = location.pathname.includes('create');
    const isLaunchPage = location.pathname.includes('launch');
    const isAuthPage = location.pathname.includes('auth');

    if (storeVersion !== storageVersion) {
      storage.setItem('storeVersion', storeVersion);
      clearLogData();
      navigate('/launch');
    }

    // skip address check for now, need to be checked in temp
    if (false && (!addressList.length || !selectedAddress) && !isRecoverPage && !isCreatePage && !isAuthPage) {
      navigate({
        pathname: '/launch',
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
