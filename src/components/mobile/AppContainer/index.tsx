import { Flex, Box } from '@chakra-ui/react';
import { headerHeight } from '@/config';
import { Outlet } from 'react-router-dom';
import ProfileIcon from '@/components/Icons/mobile/Profile'
import MenuIcon from '@/components/Icons/mobile/Menu'
import { useAddressStore } from '@/store/address';
import { toShortAddress } from '@/lib/tools';

export function Header({ username, address, ...props }: any) {
  const { selectedAddress } = useAddressStore();
  return (
    <Box
      height="44px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding="0 20px"
      background="white"
      position="relative"
      {...props}
    >
      <Box background="white" display="flex" alignItems="center" justifyContent="center" height="36px" borderRadius="36px" paddingRight="10px" paddingLeft="6px">
        <Box marginRight="4px"><ProfileIcon /></Box>
        <Box fontSize="16px" fontWeight="800" marginRight="4px">Username1</Box>
        <Box fontSize="16px" fontWeight="400">{`(${toShortAddress(selectedAddress)})`}</Box>
      </Box>
      <Box fontSize="18px" fontWeight="700" color="black" lineHeight="24px">
        <Box background="white" height="36px" width="36px" borderRadius="36px" display="flex" alignItems="center" justifyContent="center">
          <MenuIcon />
        </Box>
      </Box>
    </Box>
  );
}

export default function AppContainer() {
  return (
    <Box background="linear-gradient(180deg, #F5F6FA 0%, #EEF2FB 100%)">
      <Header
        showLogo
        paddingTop="10px"
        paddingBottom="10px"
        height="64px"
        background="transparent"
      />
      <Flex
        minH={`calc(100vh)`}
        flexDir={{ base: 'column', lg: 'row' }}
        gap={{ base: 6, md: 8, lg: '50px' }}
      >
        <Box w="100%">
          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
}
