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

export default function FindRoute({ children }: { children: ReactNode }) {
  const { navigate } = useBrowser();
  const location = useLocation();
  const { addressList, selectedAddress } = useAddressStore();
  const { clearLogData } = useTools();

  const findRoute = async () => {
    const storageVersion = storage.getItem('storeVersion');

    const allowBypass =
      location.pathname.includes('create') ||
      location.pathname.includes('landing') ||
      location.pathname.includes('auth') ||
      location.pathname.includes('deposit')

    if (storeVersion !== storageVersion) {
      storage.setItem('storeVersion', storeVersion);
      clearLogData();
    }

    if (
      !selectedAddress &&
      !allowBypass
    ) {
      navigate({
        pathname: '/landing',
        search: location.search,
      });
    } else {

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
