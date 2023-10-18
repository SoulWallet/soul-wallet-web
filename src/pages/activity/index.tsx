import { useState } from 'react';
import Header from '@/components/Header';
import { Box, Flex, Text } from '@chakra-ui/react';
import AppContainer from '@/components/AppContainer';
import Footer from '@/components/Footer';
import ChainSelectMultiple from '@/components/ChainSelectMultiple';
import { useChainStore } from '@/store/chain';
import ActivityTable from './comp/ActivityTable';
import { Tabs } from '../asset';

const tabList = [
  {
    title: 'All',
    key: 'all',
  },
  {
    title: 'Pending',
    key: 'pending',
  },
];

export default function Activity() {
  const [activeTab, setActiveTab] = useState(0);
  const { chainList } = useChainStore();
  const [activeChains, setActiveChains] = useState(chainList.map((item: any) => item.chainIdHex));

  return (
    <Box color="#000">
      <Header />
      <AppContainer minH="calc(100vh - 100px)">
        <Text fontWeight="800" fontSize="32px" mb="9">
          Activity
        </Text>
        <Tabs tabList={tabList} activeTab={activeTab} onChange={setActiveTab} />
        <Flex gap="5" mt="3" alignItems={'flex-start'}>
          <Box w="100%" rounded="20px" bg="#fff" p="8">
            {activeTab === 0 && <ActivityTable />}
            {activeTab === 1 && <ActivityTable />}
          </Box>
          <ChainSelectMultiple activeChains={activeChains} onChange={setActiveChains} />
        </Flex>
        <Footer />
      </AppContainer>
    </Box>
  );
}
