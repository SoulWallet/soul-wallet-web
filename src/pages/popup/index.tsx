import ConnectDapp from '@/components/SignModal/comp/ConnectDapp';
import useWalletContext from '@/context/hooks/useWalletContext';
import { Box, Image } from '@chakra-ui/react';
import IconLogo from '@/assets/logo-all-v3.svg';
import { useLocation, useSearchParams } from 'react-router-dom';
import SignTransaction from '@/components/SignTransactionModal/comp/SignTransaction';
export default function Popup() {
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');
  const origin = searchParams.get('origin');
  const id = searchParams.get('id');
  const data = searchParams.get('data') === 'undefined' ? {} : JSON.parse(searchParams.get('data') || '{}');
  const txns = data.txns;

  const onTxSuccess = (receipt: any) => {
    window.opener.postMessage(
      {
        id,
        payload: {
          transactionHash: receipt.transactionHash,
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
        <>
          <Image src={IconLogo} mx="auto" w="200px" />
          <SignTransaction txns={txns} origin={origin} msgId={id} onSuccess={onTxSuccess} />
        </>
      )}
    </Box>
  );
}
