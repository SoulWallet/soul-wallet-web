import ConnectDapp from '@/components/SignModal/comp/ConnectDapp';
import useWalletContext from '@/context/hooks/useWalletContext';
import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import SignTransaction from '@/components/SignTransactionModal/comp/SignTransaction';
export default function Popup() {
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');
  const origin = searchParams.get('origin');
  const id = searchParams.get('id');
  const txns = searchParams.get('txns');
  const data = searchParams.get('data');

  console.log('data', data, action)

  const onTxSuccess = (receipt: any, msgId: any) => {
    window.opener.postMessage(
      {
        id: msgId,
        payload: {
          receipt,
        },
      },
      '*',
    );
    window.close();
  };

  return (
    <Box p="6" h="100vh">
      {action === 'getAccounts' && <ConnectDapp origin={origin} msgId={id} />}
      {action === 'signTransaction' && (
        <SignTransaction txns={txns} origin={origin} msgId={id} onSuccess={onTxSuccess} />
      )}
    </Box>
  );
}
