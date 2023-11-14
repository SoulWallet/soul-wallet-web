import React, { useEffect, useRef } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import Header from '@/components/Header';
import useDapp from '@/hooks/useDapp';
import { useQuery } from '@/hooks/useBrowser';
import { useAddressStore } from '@/store/address';
import useConfig from '@/hooks/useConfig';
import { useChainStore } from '@/store/chain';

export default function Apps() {
  const iframeRef = useRef<any>()
  const toast = useToast();
  const { handleRequest, makeResponse, makeError } = useDapp();
  const { selectedAddress } = useAddressStore();
  const { selectedChainId } = useChainStore();
  const query = useQuery()
  const appUrl = query.get('appUrl')

  const onLoad = () => {

  }

  useEffect(() => {
    const listner =  async (msg: any) => {
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
        toast({
          title: error.message,
          status: 'error',
        });

        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(errorResponse, msg.origin);
        }
      }
    }

    window.addEventListener('message', listner);

    return () => {
      window.removeEventListener('message', listner)
    }
  }, [])

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = (iframeRef.current.src || '') + '';
    }
  }, [selectedChainId, selectedAddress])

  const IFRAME_SANDBOX_ALLOWED_FEATURES = 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads allow-orientation-lock'

  return (
    <Box width="100%" height="100vh">
      <Box height="72px">
        <Header />
      </Box>
      <Box width="100%" height="calc(100% - 72px)">
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
    </Box>
  )
}
