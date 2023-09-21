import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Flex, Text, Image } from '@chakra-ui/react';
import IconCheveronDown from '@/assets/icons/chevron-down.svg';
import IconCheveronDownBlack from '@/assets/icons/chevron-down-black.svg';
import useBrowser from '@/hooks/useBrowser';
import useConfig from '@/hooks/useConfig';

export default function AccountSelect() {
  const { navigate } = useBrowser();
  const [hovered, setHovered] = useState(false);
  const location = useLocation();
  const isAccountsPage = location.pathname.includes('/accounts');
  const { selectedAddressItem } = useConfig();

  return isAccountsPage ? (
    <Flex onClick={() => navigate('wallet')} align="center" gap="1" fontWeight={'800'} cursor={'pointer'}>
      <Text>All Accounts</Text>
    </Flex>
  ) : (
    <Flex
      align="center"
      gap="1"
      fontWeight={'800'}
      cursor={'pointer'}
      _hover={{ color: 'brand.red' }}
      onClick={() => navigate('accounts')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {selectedAddressItem && <Text>{selectedAddressItem.title}</Text>}
      <Image src={hovered ? IconCheveronDown : IconCheveronDownBlack} w="20px" h="20px" />
    </Flex>
  );
}
