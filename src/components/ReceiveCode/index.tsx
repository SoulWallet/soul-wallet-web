import { useState, useEffect } from 'react';
import useTools from '@/hooks/useTools';
import { Image, BoxProps } from '@chakra-ui/react';

interface IReceiveCode extends BoxProps {
  address: string;
}

export default function ReceiveCode({ address }: IReceiveCode) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const { generateQrCode } = useTools();
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

  return <Image src={imgSrc} mx="auto" display={'block'} w={'200px'} h="200px" />;
}
