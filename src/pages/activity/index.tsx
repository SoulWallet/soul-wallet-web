import { useState } from 'react';
import { Box, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import ChainSelectMultiple from '@/components/ChainSelectMultiple';
import { useChainStore } from '@/store/chain';
import ActivityTable from './comp/ActivityTable';
import IconChevronDown from '@/assets/icons/chevron-down-black.svg';

const statusList = [
  {
    title: 'All activities',
    key: 'all',
  },
  {
    title: 'Pending',
    key: 'pending',
  },
  {
    title: 'Failed',
    key: 'failed',
  },
];

const typesList = [
  {
    title: 'All types',
    key: 'all',
  },
  {
    title: 'Send',
    key: 'send',
  },
  {
    title: 'Receive',
    key: 'receive',
  },
  {
    title: 'Trade',
    key: 'trade',
  },
  {
    title: 'Approve',
    key: 'approve',
  },
  {
    title: 'Execute',
    key: 'execute',
  },
  {
    title: 'Mint',
    key: 'mint',
  },
];

const FilterMenu = ({ active, list }: any) => {
  return (
    <Menu>
      <MenuButton>
        <Flex alignItems={'center'} gap="2">
          <Text fontWeight={'700'}>{list.filter((item: any) => item.key === active)[0].title}</Text>
          <Image src={IconChevronDown} />
        </Flex>
      </MenuButton>
      <MenuList>
        {list.map((item: any, idx: number) => {
          return <MenuItem key={idx}>{item.title}</MenuItem>;
        })}
      </MenuList>
    </Menu>
  );
};

export default function Activity() {
  const { chainList } = useChainStore();
  // const [activeChains, setActiveChains] = useState(chainList.map((item: any) => item.chainIdHex));
  const [activeStatus, setActiveStatus] = useState(statusList[0].key);

  return (
    <Box pl={{ base: '24px', lg: '0' }} pr={{ base: '24px', lg: '48px' }} pt="6">
      {/* <Text fontWeight="800" fontSize="32px" mb="9">
          Activity
          </Text> */}

      <Flex px="6" justify={'space-between'} mb="3">
        <Flex gap="8">
          <FilterMenu active={activeStatus} list={statusList} />
          {/* <FilterMenu active={activeTypes} list={typesList} /> */}
        </Flex>
        {/* <ChainSelectMultiple activeChains={activeChains} onChange={setActiveChains} /> */}
      </Flex>

      <Box rounded="20px" bg="#fff" py="6px" px={{base: "16px", lg: "26px"}}>
        <ActivityTable />
      </Box>
    </Box>
  );
}
