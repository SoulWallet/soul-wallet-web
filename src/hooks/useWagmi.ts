import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAccount, useSignTypedData, useSwitchChain, useConnect, useDisconnect } from 'wagmi'

export default function useWagmi() {
  const toast = useToast();
  const { isConnected, isConnecting, address, chainId } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const [isConnectOpen, setIsConnectOpen] = useState<any>(false)

  const connectEOA = useCallback(async (connector: any) => {
    try {
      if (isConnected) {
        await disconnectAsync()
      }
      const { accounts } = await connectAsync({ connector });
      console.log('connected accounts', accounts)
      setIsConnectOpen(false)
    } catch (error: any) {
      toast({
        title: error.message,
        status: 'error',
      });
    }
  }, [])

  const openConnect = useCallback(async () => {
    setIsConnectOpen(true)
  }, [])

  const closeConnect = useCallback(async () => {
    setIsConnectOpen(false)
  }, [])

  return {
    connectEOA,
    isConnected,
    isConnectOpen,
    isConnecting,
    chainId,
    address,
    openConnect,
    closeConnect
  }
}
