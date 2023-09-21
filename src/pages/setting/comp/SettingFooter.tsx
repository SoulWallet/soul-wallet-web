import packageJson from '../../../../package.json';
import IconLogo from '@/assets/logo-v3.svg';
import { Flex, Text } from '@chakra-ui/react';
import useBrowser from '@/hooks/useBrowser';
import { Image } from '@chakra-ui/react';

export default function SettingFooter() {
  const { navigate } = useBrowser();
  return (
    <Flex
      justify={'space-between'}
      align={'center'}
      w="100%"
      position={'absolute'}
      bottom={'3'}
      px="6"
      left="0"
      right="0"
    >
      <Image onClick={() => navigate('wallet')} src={IconLogo} w="8" cursor={'pointer'} />
      <Text fontFamily={'Martian'} fontWeight={'300'} fontSize={'10px'}>
        Version Beta {packageJson.version}
      </Text>
    </Flex>
  );
}
