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

export default function FindRoute({ children }: any) {
  const { navigate } = useBrowser();
  const location = useLocation();
  const { addressList, selectedAddress, } = useAddressStore();
  const { guardiansInfo } = useGuardianStore();
  const isRecover = location.pathname.includes('recover');
  const isCreate = location.pathname.includes('create');

  const findRoute = async () => {
    const recovering = storage.getItem('recovering');

    if (isRecover || recovering) {
      navigate('/recover');
    } else if (guardiansInfo && guardiansInfo.requireBackup) {
      navigate('/security');
    } else if (isCreate) {
      navigate('/create');
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
