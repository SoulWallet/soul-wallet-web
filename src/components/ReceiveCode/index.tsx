import { useState, useEffect } from 'react';
import IconCopy from '@/assets/copy.svg';
import useTools from '@/hooks/useTools';
import { copyText } from '@/lib/tools';
import { Flex, Text, Box, useToast, Image } from '@chakra-ui/react';

interface IReceiveCode {
  address: string;
  showFullAddress?: boolean;
  imgWidth?: string;
}

export default function ReceiveCode({ address, showFullAddress, imgWidth = '90px' }: IReceiveCode) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const { generateQrCode } = useTools();
  const toast = useToast();

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

  const doCopy = () => {
    copyText(address);
    toast({
      title: 'Copied',
      status: 'success',
    });
  };

  return (
    <Box textAlign={'center'}>
      <Image src={imgSrc} mx="auto" display={'block'} w={imgWidth} />
      {showFullAddress ? (
        <Text fontFamily={'Martian'} mt="2" px="10" fontWeight={'600'} fontSize={'14px'}>
          <Text display="inline-block">{address.slice(0, 21)}</Text>
          <Text display="inline-block">{address.slice(-21)}</Text>
        </Text>
      ) : (
        <Flex align="center" gap="1" justify={'center'}>
          <Text fontFamily={'Martian'} fontWeight={'600'} fontSize={'14px'}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </Text>
          <Image src={IconCopy} onClick={doCopy} w="20px" h="20px" cursor={'pointer'} />
        </Flex>
      )}
    </Box>
  );
}
