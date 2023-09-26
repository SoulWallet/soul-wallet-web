import { Flex, Text, Image, useToast } from '@chakra-ui/react';
import { copyText } from '@/lib/tools';
import IconCopy from '@/assets/copy.svg';
import ChainSelect from '../ChainSelect';
import IconLogo from '@/assets/logo-all-v3.svg';
import AccountSelect from '../AccountSelect';
import { toShortAddress } from '@/lib/tools';
import { useAddressStore } from '@/store/address';
import { Link } from 'react-router-dom';

export default function Header() {
  const { selectedAddress, getIsActivated } = useAddressStore();
  const toast = useToast();

  const doCopy = () => {
    copyText(selectedAddress);
    toast({
      title: 'Copied',
      status: 'success',
    });
  };

  return (
    <Flex as="header" h="100px" px="8" borderBottom={'1px solid #D7D7D7'} align="center" justify={'space-between'}>
      <Link to="/wallet">
        <Image src={IconLogo} w="180px" />
      </Link>
      <Flex align={'center'} px="3" py="10px" gap="8" rounded="full" bg="#fff">
        <Flex align={'center'} gap="4">
          <Flex gap="1" align={'center'}>
            <Text fontSize={'12px'} fontFamily={'Martian'} fontWeight={'600'}>
              {toShortAddress(selectedAddress, 5, 4)}
            </Text>
            <Image src={IconCopy} w="20px" cursor={'pointer'} onClick={() => doCopy()} />
          </Flex>
          <AccountSelect />
        </Flex>
        <ChainSelect />
      </Flex>
    </Flex>
  );
}
