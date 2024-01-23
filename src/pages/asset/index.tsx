import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Box, Flex, Text, Table, Tr, Thead, Tbody, Th, Td, Image, GridItem, Grid } from '@chakra-ui/react';
import AppContainer from '@/components/AppContainer';
import Footer from '@/components/Footer';
import AvatarWithName from '@/components/AvatarWithName';
import ChainSelectMultiple from '@/components/ChainSelectMultiple';
import { useChainStore } from '@/store/chain';
import TokensTable from './comp/TokensTable';
import NftsTable from './comp/NftsTable';
import DashboardLayout from '@/components/Layouts/DashboardLayout';

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

export const Tabs = ({ tabList, activeTab, onChange }: any) => {
  return (
    <Flex userSelect={'none'} gap="10" px="6">
      {tabList.map((item: any, idx: number) => {
        return (
          <Text
            key={idx}
            cursor={'pointer'}
            fontWeight={activeTab === idx ? '800' : '400'}
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
    <DashboardLayout>
      <Box pr="48px">
        <Flex rounded="20px" p="6" bg="brand.white" mt="24px" mb="30px" justify={'space-between'}>
          <Box>
            <AvatarWithName editable={false} />
            <Flex mt="14px" gap="2px" fontWeight={'700'} align={'center'}>
              <Text fontSize={'24px'}>$</Text>
              <Text fontSize={'48px'} lineHeight={'1'}>
                0
              </Text>
            </Flex>
          </Box>
          <ChainSelectMultiple activeChains={activeChains} onChange={setActiveChains} border='1px solid #818181' />
        </Flex>

        <Tabs tabList={tabList} activeTab={activeTab} onChange={setActiveTab} />
        <Flex gap="5" mt="3" alignItems={'flex-start'}>
          <Box w="100%" rounded="20px" bg="#fff" p="8">
            {activeTab === 0 && <TokensTable activeChains={activeChains} />}
            {activeTab === 1 && <NftsTable />}
          </Box>
        </Flex>
      </Box>
    </DashboardLayout>
  );
}
