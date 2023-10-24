import { Flex, Box, Text } from '@chakra-ui/react';
import Button from '../../Button';
import { AddressInputReadonly } from '../../SendAssets/comp/AddressInput';
import useWallet from '@/hooks/useWallet';
import useConfig from '@/hooks/useConfig';
import { toShortAddress } from '@/lib/tools';
import { ethers } from 'ethers';
import { TypedDataEncoder } from 'ethers';

const getHash = (message: string) => {
  return ethers.hashMessage(message);
};

const getTypedHash = (typedData: any) => {
  console.log('Sign typed data:', typedData.domain, typedData.types, typedData.value);
  return TypedDataEncoder.hash(typedData.domain, typedData.types, typedData.value);
};

export default function SignMessage({ messageToSign, onSign, signType, origin }: any) {
  const { selectedAddressItem } = useConfig();
  const { signRawHash, signWithPasskey, } = useWallet();
  const onConfirm = async () => {
    let signHash;
    let signature;
    if (signType === 'message') {
      signHash = getHash(messageToSign);
      signature = await signRawHash(signHash);
    } else if (signType === 'typedData') {
      signHash = getTypedHash(messageToSign);
      signature = await signRawHash(signHash);
    }else if(signType === 'passkey'){
      signHash = getTypedHash(messageToSign);
      // IMPORTANT TODO, remove 0x00 from passkey signature
      signature = (await signWithPasskey(signHash)).replace('0x00', '0x')
    } else {
      throw new Error('signType not supported');
    }
    onSign(signature);
  };

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
        <Box bg="#fff" py="3" px="4" rounded="20px" fontWeight={'800'} maxH="160px" overflowY={'auto'}>
          {signType === 'typedData' || signType === 'passkey' ? JSON.stringify(messageToSign) : messageToSign}
        </Box>
        <AddressInputReadonly
          label="From"
          value={selectedAddressItem.title}
          memo={toShortAddress(selectedAddressItem.address)}
        />
      </Flex>
      <Button w="100%" fontSize={'20px'} py="4" fontWeight={'800'} mt="6" onClick={onConfirm}>
        Confirm
      </Button>
    </>
  );
}
