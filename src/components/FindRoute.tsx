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
  const { createInfo, doneAuth } = useTempStore();

  const findRoute = async () => {
    const storageVersion = storage.getItem('storeVersion');

    const allowBypass =
      location.pathname.includes('recover') ||
      location.pathname.includes('create') ||
      location.pathname.includes('landing') ||
      location.pathname.includes('auth');

    if (storeVersion !== storageVersion) {
      storage.setItem('storeVersion', storeVersion);
      clearLogData();
      navigate('/auth', { replace: true });
    }

    if (
      // !createInfo.eoaAddress &&
      // !(createInfo.credentials?.length > 0) &&
      !doneAuth &&
      !selectedAddress &&
      !allowBypass
    ) {
      navigate({
        pathname: '/auth',
        search: location.search,
      });
    } else {
      // navigate({
      //   pathname: '/dashboard',
      // });
    }
    // if (addressList.length && selectedAddress)
  };

  useEffect(() => {
    findRoute();
  }, [selectedAddress, addressList, location.pathname]);

  return (
    <Box bg="appBg" fontSize={'16px'} overflow={'auto'}>
      {children}
    </Box>
  );
}
