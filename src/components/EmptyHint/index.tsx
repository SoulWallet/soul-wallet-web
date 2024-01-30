import { Box, Text } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import IconEmpty from '@/assets/empty.svg';

interface IEmptyHint {
  title?: string;
  icon?: string;
}

export default function EmptyHint({ title = `There's nothing here`, icon }: IEmptyHint) {
  return (
    <Box textAlign={'center'} pb="10">
      <Image src={icon ? icon : IconEmpty} mx="auto" mt="8" display={'block'} />
      <Text mt="2" fontWeight={'700'}>
        {title}
      </Text>
    </Box>
  );
}
