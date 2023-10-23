import { Box, Flex, Text, Image, useToast, Button } from '@chakra-ui/react';
import { copyText } from '@/lib/tools';
import { useState } from 'react';
import IconCopy from '@/assets/copy.svg';
import ChainSelect from '../ChainSelect';
import PageSelect from '../PageSelect';
import IconLogo from '@/assets/logo-all-v3.svg';
import AccountSelect from '../AccountSelect';
import { toShortAddress } from '@/lib/tools';
import { useAddressStore } from '@/store/address';
import TransferAssets from '../TransferAssets';
import { Link } from 'react-router-dom';

export default function Header() {
  const { selectedAddress, getIsActivated } = useAddressStore();
  const [transferVisible, setTransferVisible] = useState(false);
  const toast = useToast();

  const doCopy = () => {
    copyText(selectedAddress);
    toast({
      title: 'Copied',
      status: 'success',
    });
  };

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
          <Flex align={'center'} gap="2px">
            <AccountSelect />
            <Flex gap="1" align={'center'} px="3" py="10px" roundedRight={"full"} bg="#f2f2f2">
              <Text fontSize={'12px'} fontFamily={'Martian'} fontWeight={'600'}>
                {toShortAddress(selectedAddress, 5, 4)}
              </Text>
              <Image src={IconCopy} w="20px" cursor={'pointer'} onClick={() => doCopy()} />
            </Flex>
          </Flex>
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
