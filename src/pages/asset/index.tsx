import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Box, Flex, Text, Table, Tr, Thead, Tbody, Th, Td, Image, GridItem, Grid } from '@chakra-ui/react';
import AppContainer from '@/components/AppContainer';
import Footer from '@/components/Footer';
import ChainSelectMultiple from '@/components/ChainSelectMultiple';
import { useChainStore } from '@/store/chain';
import TokensTable from './comp/TokensTable';
import NftsTable from './comp/NftsTable';

const tabList = [
  {
    title: 'Tokens',
    key: 'tokens',
  },
  {
    title: 'NFTs',
    key: 'nfts',
  },
];

export const Tabs = ({ activeTab, onChange }: any) => {
  return (
    <Flex>
      {tabList.map((item, idx) => {
        return (
          <Text
            key={idx}
            color={activeTab === idx ? 'brand.red' : 'brand.gray'}
            mr="4"
            cursor={'pointer'}
            fontWeight={'800'}
            lineHeight={'1'}
            fontSize={'18px'}
            onClick={() => onChange(idx)}
          >
            {item.title}
          </Text>
        );
      })}
    </Flex>
  );
};

export default function Asset() {
  const [activeTab, setActiveTab] = useState(0);
  const { chainList } = useChainStore();
  const [activeChains, setActiveChains] = useState(chainList.map((item: any) => item.chainIdHex));

  return (
    <Box color="#000">
      <Header />
      <AppContainer minH="calc(100vh - 100px)">
        <Text fontWeight="800" fontSize="32px" mb="9">
          Asset
        </Text>
        <Tabs activeTab={activeTab} onChange={setActiveTab} />
        <Flex gap="5" mt="3" alignItems={'flex-start'}>
          <Box w="100%" rounded="20px" bg="#fff" p="8">
            {activeTab === 0 && <TokensTable />}
            {activeTab === 1 && <NftsTable />}
          </Box>
          <ChainSelectMultiple activeChains={activeChains} onChange={setActiveChains} />
        </Flex>
        <Footer />
      </AppContainer>
    </Box>
  );
}
