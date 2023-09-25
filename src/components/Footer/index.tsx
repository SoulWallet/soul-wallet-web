import { Flex } from '@chakra-ui/react';
import packageJson from '../../../package.json';

export default function Footer() {
  return (
    <Flex justify={'flex-end'} py="6" fontSize={'12px'} fontWeight={'300'} fontFamily={'Martian'}>
      Beta {packageJson.version}
    </Flex>
  );
}
