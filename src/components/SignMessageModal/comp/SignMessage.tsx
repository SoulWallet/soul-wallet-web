import { useEffect, useState } from 'react';
import { Flex, Box, Text, Image, } from '@chakra-ui/react';
import Button from '../../Button';
import { useAccount, useSignTypedData, useSwitchChain } from 'wagmi';
import useWallet from '@/hooks/useWallet';
import IconZoom from '@/assets/icons/zoom.svg';
import { InfoWrap, InfoItem } from '@/components/SignTransactionModal';
import { TypedDataEncoder, ethers } from 'ethers';
import SignerSelect from '@/components/SignerSelect';
import { LabelItem } from '@/components/SignTransactionModal/comp/SignTransaction';

const getHash = (message: string) => {
  return ethers.hashMessage(message);
};

const getTypedHash = (typedData: any) => {
  // IMPORTANT TODO, value of message?
  delete typedData.types.EIP712Domain;
  return TypedDataEncoder.hash(typedData.domain, typedData.types, typedData.value || typedData.message);
};

export default function SignMessage({ messageToSign, onSign, signType, signTitle }: any) {
  // const { selectedAddressItem } = useConfig();
  const { signTypedDataAsync, signTypedData } = useSignTypedData();
  // const { getAddressName } = useSettingStore();
  const { signRawHash, signWithPasskey } = useWallet();
  const [isActivated, setIsActivated] = useState(false);
  const [targetChainId, setTargetChainId] = useState<undefined | number>();
  const { chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  // const origin = document.referrer;

  const onConfirm = async () => {
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
        // signHash = getTypedHash(messageToSign);
        // console.log('signHash of eoa: ', signHash)
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
    <Box pb={{base: 6, lg: 0}}>
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
      <Flex flexDir={'column'} gap="6" mt={{base:4, lg: 9}}>
        <Box bg="#f9f9f9" color="#818181" fontSize={'14px'} p="4" rounded="20px" overflowY={'auto'}>
          <Flex align={'center'} gap="1" mb="4">
            <Image src={IconZoom} w="20px" h="20px" />
            <Text fontWeight={'800'} color="#000">Message details</Text>
          </Flex>
          <Box maxH="160px" overflowY={"auto"}>
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
      {targetChainId ? (
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
    </Box>
  );
}
