import { useEffect, useState } from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';
import Button from '../../Button';
import { AddressInputReadonly } from '../../SendAssets/comp/AddressInput';
import useWallet from '@/hooks/useWallet';
import useConfig from '@/hooks/useConfig';
import { toShortAddress } from '@/lib/tools';
import { ethers } from 'ethers';
import { TypedDataEncoder } from 'ethers';
import useWalletContext from '@/context/hooks/useWalletContext';

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
  const { signRawHash, signWithPasskey } = useWallet();
  const [isActivated, setIsActivated] = useState(false);
  const { checkActivated } = useWalletContext();
  const origin = document.referrer;

  const onConfirm = async () => {
    try{
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
        // IMPORTANT TODO, remove 0x00 from passkey signature
        signature = (await signWithPasskey(signHash)).replace('0x00', '0x');
      } else {
        throw new Error('signType not supported');
      }
      onSign(signature);
    }catch(err){
      console.log('sign failed');
      throw new Error('Sign failed');
    }
  };

  const checkIsActivated = async () => {
    setIsActivated(await checkActivated());
  };

  useEffect(() => {
    checkIsActivated();
  }, []);

  const shouldDisable = signType !== 'passkey' && !isActivated;

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
      {shouldDisable && (
        <Text color="red" mt="4">
          Please activate your wallet before signing message
        </Text>
      )}
      <Button checkCanSign disabled={shouldDisable} w="100%" fontSize={'20px'} py="4" fontWeight={'800'} mt="6" onClick={onConfirm}>
        Confirm
      </Button>
    </>
  );
}
