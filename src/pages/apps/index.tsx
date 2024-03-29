import React, { useEffect, useRef, useState } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import Header from '@/components/Header';
import useDapp from '@/hooks/useDapp';
import useBrowser, { useQuery } from '@/hooks/useBrowser';
import { useAddressStore } from '@/store/address';
import { dappList } from '@/data';
import { useChainStore } from '@/store/chain';
import AlertModal from '@/components/AlertModal';
import { headerHeight } from '@/config';
import DappList from '@/components/DappList';

export default function Apps() {
  const iframeRef = useRef<any>();
  const toast = useToast();
  const [alertVisible, setAlertVisible] = useState(false);
  const { handleRequest, makeResponse, makeError } = useDapp();
  const { navigate } = useBrowser();
  const { selectedAddress } = useAddressStore();
  const { selectedChainId } = useChainStore();
  const query = useQuery();
  const appUrl = query.get('appUrl');

  const onLoad = () => {};

  const checkAppUrl = () => {
    setAlertVisible(!dappList.some((item) => item.url === appUrl));
  };

  useEffect(() => {
    if (!appUrl) {
      return;
    }
    checkAppUrl();
  }, [appUrl]);

  useEffect(() => {
    const listner = async (msg: any) => {
      const request = msg.data;
      if (!request.id) return;

      try {
        let result = await handleRequest(request);
        const response = makeResponse(request.id, result);
        console.log('safe message response', request, response);

        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(response, msg.origin);
        }
      } catch (error: any) {
        const errorResponse = makeError(request.id, error.message);
        console.log('safe message error', errorResponse);
        if (error.message) {
          toast({
            title: error.message,
            status: 'error',
          });
        }


        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(errorResponse, msg.origin);
        }
      }
    };

    window.addEventListener('message', listner);

    return () => {
      window.removeEventListener('message', listner);
    };
  }, []);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = (iframeRef.current.src || '') + '';
    }
  }, [selectedChainId, selectedAddress]);

  const IFRAME_SANDBOX_ALLOWED_FEATURES =
    'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads allow-orientation-lock';

  if (!appUrl) {
    return (
      <Box width="100%" height="100vh">
        <Box height="72px">
          <Header />
        </Box>
        <Box width="100%" padding="20px">
          <DappList />
        </Box>
      </Box>
    )
  }

  return (
    <Box width="100%" height="100vh">
      <Header />
      <Box width="100%" height={`calc(100vh - ${headerHeight}px)`}>
        {appUrl && (
          <iframe
            id={`iframe-${appUrl}`}
            ref={iframeRef}
            src={appUrl}
            title={'test'}
            onLoad={onLoad}
            sandbox={IFRAME_SANDBOX_ALLOWED_FEATURES}
            allow={''}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </Box>
      {alertVisible && (
        <AlertModal
          text="Alert: You're about to visit a non-whitelisted link. Do you wish to continue accessing this link?"
          onConfirm={() => setAlertVisible(false)}
          onCancel={() => {
            setAlertVisible(false);
            navigate('/');
          }}
        />
      )}
    </Box>
  );
}
