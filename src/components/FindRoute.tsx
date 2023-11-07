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
  const { guardiansInfo } = useGuardianStore();

  const findRoute = async () => {
    const storageVersion = storage.getItem('storeVersion');

    console.log('storage', storeVersion, storageVersion);

    if (storeVersion !== storageVersion) {
      if (storageVersion) {
      console.log('ready to clear storage');
        storage.clear();
      }
      console.log('ready to set store version')
      storage.setItem('storeVersion', storeVersion);
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
