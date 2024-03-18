import { useEffect, useState, useCallback } from 'react';
import { Flex, Box, Text, Image, useToast } from '@chakra-ui/react';
import Button from '../../Button';
import { useAccount, useSignTypedData, useSwitchChain, useConnect, useDisconnect } from 'wagmi';
import useWallet from '@/hooks/useWallet';
import { motion } from 'framer-motion';
import IconZoom from '@/assets/icons/zoom.svg';
import { InfoWrap, InfoItem } from '@/components/SignTransactionModal';
import { TypedDataEncoder, ethers } from 'ethers';
import SignerSelect from '@/components/SignerSelect';
import { LabelItem } from '@/components/SignTransactionModal/comp/SignTransaction';
import useTools from '@/hooks/useTools';
import IconChevron from '@/assets/icons/chevron-down-gray.svg';
import { useSignerStore } from '@/store/signer';
import { SignkeyType } from '@soulwallet/sdk';
import useWagmi from '@/hooks/useWagmi';

const getHash = (message: string) => {
  return ethers.hashMessage(message);
};

const getTypedHash = (typedData: any) => {
  // IMPORTANT TODO, value of message?
  delete typedData.types.EIP712Domain;
  return TypedDataEncoder.hash(typedData.domain, typedData.types, typedData.value || typedData.message);
};

const GuardianInfo = ({ guardiansInfo }: any) => {
  if (!guardiansInfo) {
    return null;
  }
  const guardianList = guardiansInfo.guardianDetails.guardians;
  return (
    <Box>
      <Text mb="2" fontSize="20px" fontWeight="800" textAlign={'center'}>
        Confirm Guardian Change
      </Text>
      <Text fontSize={'14px'} textAlign={'center'} fontWeight={'500'} mb="18px">
        Per your settings,
        <Text mx="1" as="span" fontWeight={'700'}>
          {guardiansInfo.guardianDetails.threshold}
        </Text>
        of the
        <Text mx="1" as="span" fontWeight={'700'}>
          {guardianList.length}
        </Text>
        {guardianList.length > 1 ? `guardians'` : `guardian's`} approve is required for recovery.
      </Text>
      <Flex
        mb="18px"
        py="6"
        px="10"
        flexDir={'column'}
        fontSize={'14px'}
        gap="24px"
        rounded={'20px'}
        p="8"
        bg="#f9f9f9"
      >
        {guardianList.map((address: string, index: number) => {
          return (
            <Box key={index}>
              <Text fontWeight={'800'} mb="6px">
                Guardian {index + 1}
                {guardiansInfo.guardianNames[index] ? `: ${guardiansInfo.guardianNames[index]}` : ''}
              </Text>
              <Text fontWeight={'500'}>{address}</Text>
            </Box>
          );
        })}
      </Flex>
      <Box bg="#DCDCDC" h="1px" mb="20px" />
    </Box>
  );
};

export default function SignMessage({ messageToSign, onSign, signType, guardiansInfo }: any) {
  const { signTypedDataAsync, signTypedData } = useSignTypedData();
  const { signRawHash, signWithPasskey } = useWallet();
  const { getSelectedKeyType } = useSignerStore();
  const { checkValidSigner } = useTools();
  const [showMore, setShowMore] = useState(guardiansInfo ? false : true);
  const [isActivated, setIsActivated] = useState(false);
  const [targetChainId, setTargetChainId] = useState<undefined | number>();
  const { switchChain } = useSwitchChain();
  const { connectEOA, isConnected, isConnectOpen, openConnect, closeConnect, chainId } = useWagmi();

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
      <GuardianInfo guardiansInfo={guardiansInfo} />
      <Flex flexDir={'column'} gap="6">
        <Box>
          <Flex align={'center'} justify={'space-between'} mb="4">
            <Flex align={'center'} gap="1">
              <Image src={IconZoom} w="20px" h="20px" />
              <Text fontWeight={'800'} color="#000">
                Message details
              </Text>
            </Flex>
            {guardiansInfo && (
              <Flex cursor={'pointer'} onClick={() => setShowMore((prev) => !prev)}>
                <Text fontSize={'14px'} color="#818181">
                  Show {showMore ? 'less' : 'more'}
                </Text>
                <Image
                  src={IconChevron}
                  as={motion.img}
                  animate={{ transform: showMore ? 'rotate(-180deg)' : 'rotate(0deg)' }}
                />
              </Flex>
            )}
          </Flex>
          {showMore && (
            <Box bg="#f9f9f9" color="#818181" fontSize={'14px'} p="4" rounded="20px" overflowY={'auto'}>
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
          )}
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
          onClick={openConnect}
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
    </Box>
  );
}
