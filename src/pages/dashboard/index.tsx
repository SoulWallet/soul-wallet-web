import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import Tokens from './comp/Tokens';
import Activity from './comp/Activity';
import WalletCard from './comp/WalletCard';
import DappList from '@/components/DappList';
import Guidance from './comp/Guidance';
import DashboardLayout from '@/components/Layouts/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Flex
        gap={{ base: 8, lg: '50px' }}
        h={{ lg: '100%' }}
        flexDir={{ base: 'column', lg: 'row' }}
        justify={{ base: 'center', lg: 'unset' }}
      >
        <Flex
          w={{ base: '100%', lg: '40%' }}
          pt={{ base: 8, lg: '0' }}
          h={{ lg: '100%' }}
          flexDir={'column'}
          justify={'center'}
          align={'center'}
        >
          <WalletCard />
          <Guidance />
          <Activity />
        </Flex>
        <Flex
          flexDir={'column'}
          w={{ base: '100%', lg: '60%' }}
          h={{ lg: '100%' }}
          bg="brand.white"
          py="30px"
          px="64px"
          borderLeft={'1px solid #EAECF0'}
        >
          <Tokens />
          <DappList />
        </Flex>
      </Flex>
    </DashboardLayout>
  );
}
