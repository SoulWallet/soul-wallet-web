import Header from '@/components/Header';
import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import Tokens from './comp/Tokens';
import Activity from './comp/Activity';
import Balance from './comp/Balance';
import Feedback from './comp/Feedback';
import AppContainer from '@/components/AppContainer';
import DappList from '@/components/DappList';
import Footer from '@/components/Footer';
import { AccountSelectFull } from '@/components/AccountSelect';
import SetGuardianHint from './comp/SetGuardianHint';
import DashboardLayout from '@/components/Layouts/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Flex gap="50px" h="100%">
        <Flex h="100%" flexDir={'column'} justify={'center'} align={'center'}>
          {/* <AccountSelectFull display={{ base: 'flex', lg: 'none' }} w="100%" /> */}
          <Balance />
          <SetGuardianHint />
        </Flex>
        <Box h="100%" bg="brand.white" py="30px" px="64px" borderLeft={'1px solid #EAECF0'}>
          <Tokens />
          <DappList />
        </Box>
      </Flex>

      {/* <Activity />
          <Feedback /> */}
    </DashboardLayout>
  );
}
