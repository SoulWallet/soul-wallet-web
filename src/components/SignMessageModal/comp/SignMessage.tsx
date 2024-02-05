import { useEffect, useState } from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';
import Button from '../../Button';
import { useAccount, useSignTypedData, useSwitchChain } from 'wagmi';
import useWallet from '@/hooks/useWallet';
import useConfig from '@/hooks/useConfig';
import { toShortAddress } from '@/lib/tools';
import { InfoWrap, InfoItem } from '@/components/SignTransactionModal';
import { TypedDataEncoder, ethers } from 'ethers';
import { useSettingStore } from '@/store/setting';

const getHash = (message: string) => {
  return ethers.hashMessage(message);
};

const getTypedHash = (typedData: any) => {
  // IMPORTANT TODO, value of message?
  delete typedData.types.EIP712Domain;
  return TypedDataEncoder.hash(typedData.domain, typedData.types, typedData.value || typedData.message);
};

export default function SignMessage({ messageToSign, onSign, signType }: any) {
  const { selectedAddressItem } = useConfig();
  const { signTypedDataAsync, signTypedData } = useSignTypedData();
  const { getAddressName } = useSettingStore();
  const { signRawHash, signWithPasskey } = useWallet();
  const [isActivated, setIsActivated] = useState(false);
  const [targetChainId, setTargetChainId] = useState<undefined | number>();
  const { chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const origin = document.referrer;

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

  const checkIsActivated = async () => {
    // setIsActivated(await checkActivated());
  };

  useEffect(() => {
    checkIsActivated();
  }, []);

  const shouldDisable = signType !== 'passkey' && signType !== 'eoa' && !isActivated;

  return (
    <>
      <Text fontSize="20px" fontWeight="800" color="#1e1e1e">
        Sign Message
      </Text>

      {origin && (
        <Text fontWeight={'600'} mt="1">
          {origin}
        </Text>
      )}

      <Flex flexDir={'column'} gap="5" mt="6">
        <Box bg="#f2f2f2" py="3" px="4" rounded="20px" fontWeight={'800'} maxH="160px" overflowY={'auto'}>
          {signType === 'typedData' || signType === 'passkey' || signType === 'eoa'
            ? JSON.stringify(messageToSign)
            : messageToSign}
        </Box>
        <InfoWrap color="#646464" fontSize="12px">
          <InfoItem>
            <Text>From</Text>
            <Text>
              {getAddressName(selectedAddressItem.address)}({toShortAddress(selectedAddressItem.address)})
            </Text>
          </InfoItem>
        </InfoWrap>
      </Flex>
      {shouldDisable && (
        <Text color="red" mt="4">
          Please activate your wallet before signing message
        </Text>
      )}
      {targetChainId ? (
        <Button
          w="100%"
          fontSize={'20px'}
          py="4"
          fontWeight={'800'}
          mt="6"
          onClick={() => switchChain({ chainId: targetChainId })}
        >
          Switch Chain
        </Button>
      ) : (
        <Button
          disabled={shouldDisable}
          w="100%"
          fontSize={'20px'}
          py="4"
          fontWeight={'800'}
          mt="6"
          onClick={onConfirm}
        >
          Confirm
        </Button>
      )}
    </>
  );
}
