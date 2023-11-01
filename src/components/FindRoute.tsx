/**
 * Find the correct route to go
 */

import { useEffect } from 'react';
import useBrowser from '../hooks/useBrowser';
import { Box, useToast } from '@chakra-ui/react';
import { useAddressStore } from '@/store/address';
import { useGuardianStore } from '@/store/guardian';
import storage from '@/lib/storage';
import { useLocation } from 'react-router-dom';
import { storeVersion } from '@/config';

export default function FindRoute({ children }: any) {
  const { navigate } = useBrowser();
  const location = useLocation();
  const { addressList, selectedAddress } = useAddressStore();
  const { guardiansInfo } = useGuardianStore();
  // const isRecover = location.pathname.includes('recover');
  // const isCreate = location.pathname.includes('create');

  const findRoute = async () => {
    if (storeVersion !== storage.getItem('storeVersion')) {
      storage.clear();
      storage.setItem('storeVersion', storeVersion);
      // toast({
      //   status: 'info',
      //   title: `There are break changes during development, please create new wallet`,
      //   duration: 3000,
      // })
    }

    if (guardiansInfo && guardiansInfo.requireBackup) {
      navigate('/security');
    } else if (!addressList.length || !selectedAddress) {
      navigate({
        pathname: '/launch',
        search: location.search,
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
