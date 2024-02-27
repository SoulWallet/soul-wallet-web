import { useState, forwardRef, useImperativeHandle, useEffect, Ref, useRef, useCallback } from 'react';
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Text,
  useToast
} from '@chakra-ui/react'
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi'
import { supportedEoas } from '@/config'
import WalletOption from '@/components/new/WalletOption'
import { getWalletIcon } from '@/lib/tools'
import TxModal from '../TxModal';

const ConnectWalletModal = (_: unknown, ref: Ref<any>) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [promiseInfo, setPromiseInfo] = useState<any>({});
  const { connectors, connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount()
  const toast = useToast();

  useImperativeHandle(ref, () => ({
    async show() {
      setVisible(true);

      return new Promise((resolve, reject) => {
        setPromiseInfo({
          resolve,
          reject,
        });
      });
    },
  }));

  const onClose = async () => {
    setVisible(false);
    // clearState();
    promiseInfo.reject('User reject');
  };

  const onSuccess = async (receipt: any) => {
    setVisible(false);
    promiseInfo.resolve(receipt);
  };

  const connectEOA = async (connector: any) => {
    try {
      if(isConnected){
        await disconnectAsync()
      }
      const account = await connectAsync({ connector });
      promiseInfo.resolve(account);
      onClose()
    } catch (error: any) {
      toast({
        title: error.message,
        status: 'error',
      });
    }
  }

  console.log('isConnected111', isConnected)

  return (
    <div ref={ref}>
      <TxModal title="Connect Wallet" visible={visible} onClose={onClose}>
        <Box
          height="100%"
          roundedBottom="20px"
          display="flex"
        >
          <Box
            width={{ base: '100%', 'md': '100%' }}
          >
            {!!(isConnecting) && (
              <Box width="100%" display="flex" height="calc(100% - 34px)">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  width="100%"
                  paddingBottom="50px"
                >
                  <Box
                    fontWeight="700"
                    fontFamily="Nunito"
                    fontSize="20px"
                  >
                    Connecting wallet...
                  </Box>
                  <Box
                    fontWeight="600"
                    fontFamily="Nunito"
                    fontSize="14px"
                    color="rgba(0, 0, 0, 0.6)"
                    marginTop="6px"
                  >
                    Please confirm on your wallet extension
                  </Box>
                </Box>
              </Box>
            )}
            {!(isConnecting) && (
              <Box
                width="100%"
                display="flex"
                flexWrap="wrap"
                justifyContent={{ base: 'space-between', md: 'flex-start' }}
              >
                {connectors.filter(item => supportedEoas.includes(item.id)).map((connector: Connector) =>
                  <WalletOption
                    key={connector.uid}
                    icon={getWalletIcon(connector.id)}
                    name={connector.id === 'injected' ? 'Browser Wallet' : connector.name}
                    onClick={() => connectEOA(connector)}
                  />
                )}
              </Box>
            )}
          </Box>
        </Box>
      </TxModal>
    </div>
  );
};

export default forwardRef(ConnectWalletModal);
