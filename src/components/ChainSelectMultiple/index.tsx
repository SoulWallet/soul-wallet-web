import React from 'react';
import { Flex, Box, Image, Text, Divider } from '@chakra-ui/react';
import IconChecked from '@/assets/icons/checked.svg';
import IconUnchecked from '@/assets/icons/unchecked.svg';
import IconAllNetwork from '@/assets/icons/all-network.svg';
import { useChainStore } from '@/store/chain';

const MenuItem = ({ icon, title, checked, ...restProps }: any) => {
  return (
    <Flex w="100%" align={'center'} justify={'space-between'} py="2" cursor={'pointer'} {...restProps}>
      <Flex align={'center'} gap="2">
        <Image src={icon} w="5" h="5" />
        <Text data-testid={`text-chainname-${title}`} fontWeight={'700'}>
          {title}
        </Text>
      </Flex>
      {checked ? <Image src={IconChecked} w="5" h="5" /> : <Image src={IconUnchecked} w="5" h="5" />}
    </Flex>
  );
};

export default function ChainSelectMultiple({ activeChains, onChange }: any) {
  const { chainList } = useChainStore();

  const toggleCheckAll = () => {
    if (activeChains.length === chainList.length) {
      onChange([]);
    } else {
      onChange(chainList.map((item: any) => item.chainIdHex));
    }
  };

  const toggleActiveChains = (chainIdHex: string) => {
    const chains = JSON.parse(JSON.stringify(activeChains));
    const index = chains.indexOf(chainIdHex);
    if (index === -1) {
      chains.push(chainIdHex);
    } else {
      chains.splice(index, 1);
    }
    onChange(chains);
  };

  return (
    <Flex
      w="262px"
      flex="0 0 262px"
      flexDir={'column'}
      rounded="16px"
      userSelect={'none'}
      bg="#fff"
      boxShadow={'0px 4px 4px 0px rgba(0, 0, 0, 0.25)'}
      py="1"
      px="10px"
    >
      <MenuItem
        onClick={toggleCheckAll}
        icon={IconAllNetwork}
        title={'All networks'}
        checked={activeChains.length === chainList.length}
      />
      {chainList.map((item: any, idx: number) => {
        return (
          <React.Fragment key={idx}>
            <Divider />
            <Box key={item.chainIdHex} onClick={() => toggleActiveChains(item.chainIdHex)}>
              <MenuItem icon={item.icon} title={item.chainName} checked={activeChains.includes(item.chainIdHex)} />
            </Box>
          </React.Fragment>
        );
      })}
    </Flex>
  );
}
