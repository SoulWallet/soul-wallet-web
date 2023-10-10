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

  const isLaunch = location.pathname.includes('launch');
  const isApps = location.pathname.includes('apps');
  const isTest = location.pathname.includes('test');
  const query = useQuery();

  const findRoute = async () => {
    console.log('ready to find');
    const recovering = storage.getItem('recovering');
    if (isLaunch) {
      navigate('launch');
    }
    if (isApps) {
      const appUrl = query.get('appUrl');

      if (appUrl) {
        navigate(`apps?appUrl=${appUrl}`);
      } else {
        navigate('apps');
      }
    } else if (isTest) {
      navigate('test');
    } else if (recovering) {
      navigate('recover');
    } else if (!addressList.length) {
      navigate('launch');
    } else {
      navigate('wallet');
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
