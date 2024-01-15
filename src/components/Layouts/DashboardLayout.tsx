import { Flex, Box } from '@chakra-ui/react';
import Header from '../Header';
import Sidebar from '../Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      <Header />
      <Flex minH="calc(100vh - 72px)" gap="50px">
        <Sidebar />
        <Box>{children}</Box>
      </Flex>
    </Box>
  );
}
