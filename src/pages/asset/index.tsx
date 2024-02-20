import {  useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
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
            color={activeTab === idx ? 'brand.black' : '#898989'}
            fontWeight={800}
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

  return (
    <DashboardLayout>
      <Box pl={{ base: '24px', lg: '0' }} pr={{ base: '24px', lg: '48px' }} pt="6">
        <Tabs tabList={tabList} activeTab={activeTab} onChange={setActiveTab} />
        <Flex gap="5" mt="3" alignItems={'flex-start'}>
          <Box w="100%" rounded="20px" bg="#fff" p={{base: 3, md : 5, lg: 8}}>
            {activeTab === 0 && <TokensTable />}
            {activeTab === 1 && <NftsTable />}
          </Box>
        </Flex>
      </Box>
    </DashboardLayout>
  );
}
