import { useEffect } from 'react';
import useBrowser from '../hooks/useBrowser';
import { Box } from '@chakra-ui/react';
import { useAddressStore } from '@/store/address';
import storage from '@/lib/storage';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@/hooks/useBrowser';

// Find the correct route to go

export default function FindRoute({ children }: any) {
  const { navigate } = useBrowser();
  const location = useLocation();
  const { addressList } = useAddressStore();

  // const isLaunch = location.pathname.includes('launch');
  // const isApps = location.pathname.includes('apps');
  // const isSecurity = location.pathname.includes('security');
  // const isTest = location.pathname.includes('test');
  const isPopup = location.pathname.includes('popup');
  const isRecover = location.pathname.includes('recover');

  const findRoute = async () => {
    console.log('ready to find');
    const recovering = storage.getItem('recovering');

    if (isRecover || recovering) {
      navigate('/recover');
    } else if (!addressList.length) {
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
