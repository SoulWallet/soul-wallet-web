import ConnectDapp from '@/components/ConnectDapp';
import { Box, Image } from '@chakra-ui/react';
import IconLogo from '@/assets/logo-all-v3.svg';
import { useSearchParams } from 'react-router-dom';
import SignTransaction from '@/components/SignTransactionModal/comp/SignTransaction';
import SignMessage from '@/components/SignMessageModal/comp/SignMessage';
import SwitchChain from '@/components/SwitchChain';
import { useAddressStore } from '@/store/address';
import useConfig from '@/hooks/useConfig';

// when user has the created wallet
export default function Popup() {
  const { addressList } = useAddressStore();
  const [searchParams] = useSearchParams();
  const { selectedChainItem } = useConfig();

  const action = searchParams.get('action');
  const id = searchParams.get('id');
  const data = searchParams.get('data') === 'undefined' ? {} : JSON.parse(searchParams.get('data') || '{}');
  const txns = data.txns;
  const message = data.message;
  const targetChainId = data.targetChainId;

  if (!addressList || !addressList.length) {
    return;
  }

  const onTxSuccess = (receipt: any) => {
    window.opener.postMessage(
      {
        id,
        payload: {
          receipt,
        },
      },
      '*',
    );
    window.close();
  };

  const onSign = (signature: string) => {
    window.opener.postMessage(
      {
        id,
        payload: {
          signature,
        },
      },
      '*',
    );
    window.close();
  };

  const onSwitch = () => {
    window.opener.postMessage(
      {
        id,
        payload: {
          chainId: targetChainId,
          chainConfig: selectedChainItem,
        },
      },
      '*',
    );
    window.close();
  };

  return (
    <Box p="6" h="100vh">
      {action === 'getAccounts' && <ConnectDapp msgId={id} />}
      {action === 'signTransaction' && (
        <>
          <Image src={IconLogo} mx="auto" w="200px" />
          <SignTransaction txns={txns} msgId={id} onSuccess={onTxSuccess} />
        </>
      )}
      {action === 'signMessage' && (
        <SignMessage msgId={id} messageToSign={message} signType="message" onSign={onSign} />
      )}
      {action === 'signTypedDataV4' && (
        <SignMessage msgId={id} messageToSign={JSON.parse(message)} signType="typedData" onSign={onSign} />
      )}
      {action === 'switchChain' && <SwitchChain targetChainId={targetChainId.chainId} onSwitch={onSwitch} />}
    </Box>
  );
}
