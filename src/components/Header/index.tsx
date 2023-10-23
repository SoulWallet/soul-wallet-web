import { Box, Flex, Image, Button } from '@chakra-ui/react';
import { useState } from 'react';
import ChainSelect from '../ChainSelect';
import PageSelect from '../PageSelect';
import IconLogo from '@/assets/logo-all-v3.svg';
import TransferAssets from '../TransferAssets';
import { Link } from 'react-router-dom';
import { AccountSelectFull } from '../AccountSelect';

export default function Header() {
  const [transferVisible, setTransferVisible] = useState(false);

  return (
    <Flex
      as="header"
      h="64px"
      px="8"
      bg="#fff"
      borderBottom={'1px solid #e6e6e6'}
      align="center"
      justify={'space-between'}
    >
      <Link to="/wallet">
        <Image src={IconLogo} h="40px" />
      </Link>
      <Flex align={'center'} gap="2" marginLeft="auto">
        <Button
          px="5"
          onClick={() => setTransferVisible(true)}
          bg="#F2F2F2"
          fontWeight={'800'}
          lineHeight={'1'}
          rounded="50px"
        >
          Send & Receive
        </Button>
        <AccountSelectFull />
        <ChainSelect />
      </Flex>
      {transferVisible && <TransferAssets onClose={() => setTransferVisible(false)} />}
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
