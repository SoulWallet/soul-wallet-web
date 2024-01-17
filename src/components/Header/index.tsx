import { Box, Flex, Image, Button, Text } from '@chakra-ui/react';
import ChainSelect from '../ChainSelect';
import PageSelect from '../PageSelect';
import IconLogo from '@/assets/logo-all-v3.svg';
import IconGuide from '@/assets/icons/guide.svg';
import IconExit from '@/assets/icons/exit.svg';
import { Link } from 'react-router-dom';
import { AccountSelectFull } from '../AccountSelect';
import useWalletContext from '@/context/hooks/useWalletContext';
import useBrowser from '@/hooks/useBrowser';
import useTools from '@/hooks/useTools';

export default function Header() {
  const { navigate } = useBrowser();
  const { clearLogData } = useTools();

  const doLogout = () => {
    clearLogData();
    navigate('/auth');
  };

  return (
    <Flex
      as="header"
      h="72px"
      px={{ base: '4', lg: '8' }}
      bg="#fff"
      borderBottom={'1px solid #e6e6e6'}
      align="center"
      justify={'space-between'}
    >
      <Link to="/dashboard">
        <Image src={IconLogo} h="44px" />
      </Link>
      <Flex gap="2" align={'center'}>
        <AccountSelectFull />
        {/* <ChainSelect /> */}
        <Flex
          onClick={doLogout}
          cursor={'pointer'}
          align={'center'}
          justify={'center'}
          w="42px"
          h="42px"
          rounded="full"
          bg="#F2F2F2"
        >
          <Image src={IconExit} />
        </Flex>
      </Flex>
    </Flex>
  );
}
