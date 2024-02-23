import { Flex, Box } from '@chakra-ui/react';
import { headerHeight } from '@/config';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <Box>
      <Header />
      <Flex
        minH={`calc(100vh - ${headerHeight}px)`}
        flexDir={{ base: 'column', lg: 'row' }}
        gap={{ base: 6, md: 8, lg: '50px' }}
      >
        <Sidebar />
        <Box w="100%">
          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
}
