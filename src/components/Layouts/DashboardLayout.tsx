import { Flex, Box } from '@chakra-ui/react';
import { headerHeight } from '@/config';
import Header from '../Header';
import Sidebar from '../Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      <Header />
      <Flex
        minH={`calc(100vh - ${headerHeight}px)`}
        flexDir={{ base: 'column', lg: 'row' }}
        gap={{ base: 8, lg: '50px' }}
      >
        <Sidebar />
        <Box w="100%">{children}</Box>
      </Flex>
    </Box>
  );
}
