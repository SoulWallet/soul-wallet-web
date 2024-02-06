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
      <Flex gap="50px" h="100%">
        <Flex w="40%" h="100%" flexDir={'column'} justify={'center'} align={'center'}>
          <WalletCard />
          <Guidance />
          <Activity />
        </Flex>
        <Flex flexDir={'column'} w="60%" h="100%" bg="brand.white" py="30px" px="64px" borderLeft={'1px solid #EAECF0'}>
          <Tokens />
          <DappList />
        </Flex>
      </Flex>
    </DashboardLayout>
  );
}
