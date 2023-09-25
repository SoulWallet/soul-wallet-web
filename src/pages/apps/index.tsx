import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import Header from '@/components/Header';
import { useLocation } from 'react-router-dom';

export default function Apps() {
  const iframeRef = useRef<any>()

  const onLoad = () => {

  }

  useEffect(() => {
    console.log('location', location)
    window.addEventListener('message', async (msg) => {
      const safeInfo = {
        safeAddress: '0x2D0FF241EE15c1f454CC21A0Dfa8e3444DAef563',
        chainId: parseInt('0x01', 10),
        owners: ['0x2D0FF241EE15c1f454CC21A0Dfa8e3444DAef563'],
        threshold: 1,
        isReadOnly: false,
        network: 'ETHEREUM',
      }

      const data = msg.data

      if (data && data.method && data.method === 'getSafeInfo') {
        iframeRef.current.contentWindow.postMessage(safeInfo, msg.origin)
      }

      console.log('message1111', msg.origin, data, safeInfo, iframeRef.current.contentWindow.postMessage)
    })
  }, [])

  const IFRAME_SANDBOX_ALLOWED_FEATURES = 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads allow-orientation-lock'
  let appUrl = `https://app.aave.com`
  appUrl = `https://app.aelin.xyz`

  return (
    <Box width="100%" height="100vh">
      <Box height="102px">
        <Header />
      </Box>
      <Box width="100%" height="calc(100% - 102px)">
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
      </Box>
    </Box>
  )
}
