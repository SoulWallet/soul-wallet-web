import { useEffect, useState, useCallback } from 'react';
import { Flex, Box, Text, Image, useToast } from '@chakra-ui/react';
import Button from '../../Button';
import { useAccount, useSignTypedData, useSwitchChain, useConnect, useDisconnect } from 'wagmi';
import useWallet from '@/hooks/useWallet';
import IconZoom from '@/assets/icons/zoom.svg';
import { InfoWrap, InfoItem } from '@/components/SignTransactionModal';
import { TypedDataEncoder, ethers } from 'ethers';
import SignerSelect from '@/components/SignerSelect';
import { LabelItem } from '@/components/SignTransactionModal/comp/SignTransaction';
import useTools from '@/hooks/useTools';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useSignerStore } from '@/store/signer';
import { SignkeyType } from '@soulwallet/sdk';
import ConnectWalletModal from '@/pages/recover/ConnectWalletModal'

const getHash = (message: string) => {
  return ethers.hashMessage(message);
};

const getTypedHash = (typedData: any) => {
  // IMPORTANT TODO, value of message?
  delete typedData.types.EIP712Domain;
  return TypedDataEncoder.hash(typedData.domain, typedData.types, typedData.value || typedData.message);
};

export default function SignMessage({ messageToSign, onSign, signType, signTitle }: any) {
  const toast = useToast();
  const { signTypedDataAsync, signTypedData } = useSignTypedData();
  const { signRawHash, signWithPasskey } = useWallet();
  const { isConnected } = useAccount();
  const { getSelectedKeyType } = useSignerStore();
  const { showConnectWallet } = useWalletContext();
  const { checkValidSigner } = useTools();
  const [isActivated, setIsActivated] = useState(false);
  const [targetChainId, setTargetChainId] = useState<undefined | number>();
  const { chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const [isConnectOpen, setIsConnectOpen] = useState<any>(false)

  const connectEOA = useCallback(async (connector: any) => {
    try {
      await disconnectAsync()
      const { accounts } = await connectAsync({ connector });
      setIsConnectOpen(false)
    } catch (error: any) {
      toast({
        title: error.message,
        status: 'error',
      });
    }
  }, [])

  const connectWallet = useCallback(async () => {
    setIsConnectOpen(true)
  }, [])

  const onConfirm = async () => {
    if (!checkValidSigner()) {
      return;
    }
    try {
      let signHash;
      let signature;
      if (signType === 'message') {
        signHash = getHash(messageToSign);
        signature = await signRawHash(signHash);
      } else if (signType === 'typedData') {
        signHash = getTypedHash(messageToSign);
        signature = await signRawHash(signHash);
      } else if (signType === 'passkey') {
        signHash = getTypedHash(messageToSign);
        signature = await signWithPasskey(signHash);
      } else if (signType === 'eoa') {
        signature = await signTypedDataAsync(messageToSign);
      } else {
        throw new Error('signType not supported');
      }
      console.log('signed sig: ', signature);
      onSign(signature);
    } catch (err) {
      console.log('sign failed');
      throw new Error('Sign failed');
    }
  };

  useEffect(() => {
    if (signType !== 'eoa') {
      return;
    }

    if (
      messageToSign &&
      messageToSign.domain &&
      messageToSign.domain.chainId &&
      messageToSign.domain.chainId != chainId
    ) {
      setTargetChainId(Number(messageToSign.domain.chainId));
    } else {
      setTargetChainId(undefined);
    }
  }, [chainId, messageToSign, signType]);

  const shouldDisable = signType !== 'passkey' && signType !== 'eoa' && !isActivated;

  return (
    <Box pb={{ base: 6, lg: 0 }}>
      {signTitle && (
        <Text fontSize="20px" fontWeight="800" textAlign={'center'}>
          {signTitle}
        </Text>
      )}
      {/* {origin && (
          <Text fontWeight={'600'} mt="1">
          {origin}
          </Text>
          )} */}
      <Flex flexDir={'column'} gap="6" mt={{ base: 4, lg: 9 }}>
        <Box bg="#f9f9f9" color="#818181" fontSize={'14px'} p="4" rounded="20px" overflowY={'auto'}>
          <Flex align={'center'} gap="1" mb="4">
            <Image src={IconZoom} w="20px" h="20px" />
            <Text fontWeight={'800'} color="#000">
              Message details
            </Text>
          </Flex>
          <Box maxH="160px" overflowY={'auto'}>
            <pre>
              <code>
                {signType === 'typedData' || signType === 'passkey' || signType === 'eoa'
                ? JSON.stringify(messageToSign, null, 2)
                : messageToSign}
              </code>
            </pre>
          </Box>
        </Box>
        <InfoWrap fontSize="14px">
          <InfoItem>
            <LabelItem
              label="Signer"
              tooltip={`A transaction signer is responsible for authorizing blockchain transactions, ensuring security and validity before they're processed on the network.`}
            />
            <Flex gap="2" fontWeight={'500'}>
              <SignerSelect />
            </Flex>
          </InfoItem>
          {/* <InfoItem>
              <Text>From</Text>
              <Text>
              {getAddressName(selectedAddressItem.address)}({toShortAddress(selectedAddressItem.address)})
              </Text>
              </InfoItem> */}
        </InfoWrap>
      </Flex>
      {shouldDisable && (
        <Text color="red" mt="4">
          Please activate your wallet before signing message
        </Text>
      )}
      {getSelectedKeyType() === SignkeyType.EOA && !isConnected ? (
        <Button
          w="320px"
          fontSize={'20px'}
          py="4"
          fontWeight={'800'}
          mt="6"
          mx="auto"
          display={'block'}
          onClick={connectWallet}
        >
          Connect Wallet
        </Button>
      ) : targetChainId ? (
        <Button
          w="320px"
          fontSize={'20px'}
          py="4"
          fontWeight={'800'}
          mt="6"
          mx="auto"
          display={'block'}
          onClick={() => switchChain({ chainId: targetChainId })}
        >
          Switch Chain
        </Button>
      ) : (
        <Button
          disabled={shouldDisable}
          w="320px"
          fontSize={'20px'}
          py="4"
          fontWeight={'800'}
          mt="6"
          mx="auto"
          display={'block'}
          onClick={onConfirm}
        >
          Confirm
        </Button>
      )}
      <ConnectWalletModal isOpen={isConnectOpen} connectEOA={connectEOA} onClose={() => setIsConnectOpen(false)} />
    </Box>
  );
}
