/**
 * Find the correct route to go
 */

import { useEffect } from 'react';
import useBrowser from '../hooks/useBrowser';
import { Box } from '@chakra-ui/react';
import { useAddressStore } from '@/store/address';
import { useGuardianStore } from '@/store/guardian';
import storage from '@/lib/storage';
import { useLocation } from 'react-router-dom';
import { storeVersion } from '@/config';

export default function FindRoute({ children }: any) {
  const { navigate } = useBrowser();
  const location = useLocation();
  const { addressList, selectedAddress } = useAddressStore();

  const findRoute = async () => {
    const storageVersion = storage.getItem('storeVersion');
    const isRecoverPage = location.pathname.includes('recover');
    const isCreatePage = location.pathname.includes('create');
    const isLaunchPage = location.pathname.includes('launch');

    if (storeVersion !== storageVersion) {
      if (storageVersion) {
        // when upgrade, clear all for now
        storage.clear();
      }
      storage.setItem('storeVersion', storeVersion);
    }

    // if (guardiansInfo && guardiansInfo.requireBackup) {
    //   navigate('/security');
    // } else
    if ((!addressList.length || !selectedAddress) && !isRecoverPage && !isCreatePage) {
      navigate({
        pathname: '/launch',
        search: location.search,
      });
    } else if (isLaunchPage && addressList.length && selectedAddress) {
      navigate({
        pathname: '/wallet',
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
