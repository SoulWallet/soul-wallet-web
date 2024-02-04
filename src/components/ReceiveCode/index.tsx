import { useState, useEffect } from 'react';
import IconCopy from '@/assets/copy.svg';
import useTools from '@/hooks/useTools';
import { Flex, Text, Box, useToast, Image, BoxProps } from '@chakra-ui/react';
import { useChainStore } from '@/store/chain';
import useConfig from '@/hooks/useConfig';
import Button from '../Button';

interface IReceiveCode extends BoxProps {
  address: string;
  showFullAddress?: boolean;
  imgWidth?: string;
}

export default function ReceiveCode({ address, showFullAddress, imgWidth = '90px', ...restProps }: IReceiveCode) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const { chainConfig } = useConfig();
  const { generateQrCode, doCopy } = useTools();

  const generateQR = async (text: string) => {
    try {
      setImgSrc(await generateQrCode(text));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!address) {
      return;
    }
    generateQR(address);
  }, [address]);

  return (
    <Box textAlign={'center'} fontSize={'12px'} {...restProps}>
      <Image src={imgSrc} mx="auto" display={'block'} w={imgWidth} mb="2" />
      {/* {showFullAddress ? (
        <Text  mt="2" px="10" fontWeight={'600'} fontSize={'14px'}>
          <Text display="inline-block">{address.slice(0, 21)}</Text>
          <Text display="inline-block">{address.slice(-21)}</Text>
        </Text>
      ) : ( */}
      <Flex fontSize={'14px'} mb="2" justify={'center'}>
        <Text fontWeight={'700'}>{chainConfig.addressPrefix}</Text>
        <Text fontWeight={'500'}>
          {address}
          {/* {address.slice(0, 22)}
          <br />
          {address.slice(-20)} */}
        </Text>
      </Flex>
      <Button type="white" py="10px" px="15px" border="1px solid #e0e0e0" display={'block'} mx="auto" onClick={() => doCopy(`${chainConfig.addressPrefix}${address}`)} mb="14px">
        Copy address
      </Button>
      <Flex display="inline-flex" align={'center'} py="1" px="3" rounded={'12px'} bg="rgba(98, 126, 234, 0.10)">
        <Image src={chainConfig.icon} w="5" mr="1" />
        <Text fontWeight={'800'}>{chainConfig.chainName} network - &nbsp;</Text>
        <Text fontWeight={'600'}>Only send {chainConfig.chainName} assets to this address</Text>
      </Flex>
    </Box>
  );
}
