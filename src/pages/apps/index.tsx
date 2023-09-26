import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import Header from '@/components/Header';
import handleRequests from '@/provider/handleRequests';
import { useLocation } from 'react-router-dom';
import useDapp from '@/hooks/useDapp';
import useConfig from '@/hooks/useConfig';

export default function Apps() {
  const iframeRef = useRef<any>()

  const { chainConfig } = useConfig();
  const { getAccounts,  } = useDapp();

  const onLoad = () => {

  }

  useEffect(() => {
    console.log('location', location)
    window.addEventListener('message', async (msg) => {
      const account = getAccounts();
      console.log('account ', account)
      const safeInfo = {
        safeAddress: account,
        chainId: parseInt(chainConfig.chainIdHex, 10),
        owners: [account],
        threshold: 1,
        isReadOnly: false,
        network: 'ETHEREUM',
      }

      const data = msg.data

      if (data && data.method && data.method === 'getSafeInfo') {
        const response = {
          id: data.id,
          success: true,
          version: '1.18.0',
          data: safeInfo
        }
        iframeRef.current.contentWindow.postMessage(response, msg.origin)
        console.log('message1111', msg.origin, data, response)
      }
    })
  }, [])

  const IFRAME_SANDBOX_ALLOWED_FEATURES = 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads allow-orientation-lock'
  let appUrl = `https://app.aave.com`
  appUrl = `http://localhost:3000`

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
