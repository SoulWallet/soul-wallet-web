import { Box, Flex, Image, Button } from '@chakra-ui/react';
import ChainSelect from '../ChainSelect';
import PageSelect from '../PageSelect';
import IconLogo from '@/assets/logo-all-v3.svg';
import { Link } from 'react-router-dom';
import { AccountSelectFull } from '../AccountSelect';
import useWalletContext from '@/context/hooks/useWalletContext';
import GuideButton from '../GuideButton';

export default function Header() {
  const { showTransferAssets, showClaimAssets, } = useWalletContext();

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
      <Link to="/wallet">
        <Image src={IconLogo} h="44px" />
      </Link>
      <Flex align={'center'} gap="2" marginLeft="auto">
        <GuideButton />
        <Flex align={'center'} gap="2" display={{ base: 'none', lg: 'flex' }}>
          <Button
            px="5"
            onClick={() => showTransferAssets()}
            bg="#F2F2F2"
            fontWeight={'800'}
            lineHeight={'1'}
            rounded="50px"
          >
            Send & Receive
          </Button>
          <AccountSelectFull />
        </Flex>

        <ChainSelect />
      </Flex>
      <Box
        height="40px"
        width="40px"
        borderRadius="20px"
        background="#F2F2F2"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        marginLeft="10px"
      >
        <PageSelect />
      </Box>
    </Flex>
  );
}
