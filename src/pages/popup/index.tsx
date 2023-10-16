import ConnectDapp from '@/components/SignModal/comp/ConnectDapp';
import { Box } from '@chakra-ui/react';
import { useLocation, useSearchParams } from 'react-router-dom';
export default function Popup() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  //   const serachParams = new URLSearchParams(location.search);
  const action = searchParams.get('action');
  const origin = searchParams.get('origin');
  const id = searchParams.get('id');




  return (
    <Box p="6" h="100vh">
      <ConnectDapp origin={origin} msgId={id} />
    </Box>
  );
}
