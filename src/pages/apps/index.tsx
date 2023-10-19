import React, { useEffect, useRef } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import Header from '@/components/Header';
import useDapp from '@/hooks/useDapp';
import { useQuery } from '@/hooks/useBrowser';
import { useAddressStore } from '@/store/address';
import useConfig from '@/hooks/useConfig';

export default function Apps() {
  const iframeRef = useRef<any>()
  const toast = useToast();
  const { handleRequest, makeResponse, makeError } = useDapp();
  const { selectedAddress } = useAddressStore();
  const { chainConfig } = useConfig();
  const query = useQuery()
  const appUrl = query.get('appUrl')

  const onLoad = () => {

  }

  const listner =  async (msg: any) => {
    const request = msg.data;
    if (!request.id) return;

    try {
      let result = await handleRequest(request);
      const response = makeResponse(request.id, result);
      console.log('safe message response', request, response);
      iframeRef.current.contentWindow.postMessage(response, msg.origin);
    } catch (error: any) {
      const errorResponse = makeError(request.id, error.message);
      console.log('safe message error', errorResponse);
      toast({
        title: error.message,
        status: 'error',
      });
      iframeRef.current.contentWindow.postMessage(errorResponse, msg.origin);
    }
  }

  useEffect(() => {
    window.addEventListener('message', listner);
    return () => {
      window.removeEventListener('message', listner)
    }
  }, [])

  useEffect(() => {
    if (iframeRef.current) iframeRef.current.src += '';
  }, [chainConfig, selectedAddress])

  const IFRAME_SANDBOX_ALLOWED_FEATURES = 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads allow-orientation-lock'

  return (
    <Box width="100%" height="100vh">
      <Box height="102px">
        <Header />
      </Box>
      <Box width="100%" height="calc(100% - 102px)">
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
