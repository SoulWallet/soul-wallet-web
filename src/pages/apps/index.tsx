import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import Header from '@/components/Header';
import handleRequests from '@/provider/handleRequests';
import { useLocation } from 'react-router-dom';
import useDapp from '@/hooks/useDapp';
import useConfig from '@/hooks/useConfig';
import { useQuery } from '@/hooks/useBrowser';

export default function Apps() {
  const iframeRef = useRef<any>()
  const { handleRequest, makeResponse } = useDapp();
  const query = useQuery()
  const appUrl = query.get('appUrl')

  console.log('app url', appUrl)

  const onLoad = () => {

  }

  useEffect(() => {
    window.addEventListener('message', async (msg) => {
      const request = msg.data

      try {
        let result = await handleRequest(request)

        if (request.id) {
          const response = makeResponse(request.id, result)
          console.log('safe message', request, response)
          iframeRef.current.contentWindow.postMessage(response, msg.origin)
        }
      } catch (error: any) {
        console.log('error', error.message)
      }
    })
  }, [])

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
