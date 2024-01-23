import React from 'react';
import { Flex, Box, Image, Text, Divider, Menu, MenuButton, MenuList, FlexProps } from '@chakra-ui/react';
import IconChecked from '@/assets/icons/checked.svg';
import IconUnchecked from '@/assets/icons/unchecked.svg';
import IconAllNetwork from '@/assets/icons/all-network.svg';
import { useChainStore } from '@/store/chain';
import IconChevronDown from '@/assets/icons/chevron-down-black.svg';

const MenuLine = ({ icon, title, checked, isMenu, ...restProps }: any) => {
  const rightImgSrc = isMenu ? IconChevronDown : checked ? IconChecked : IconUnchecked;
  return (
    <Flex w="100%" gap="2" align={'center'} justify={'space-between'} py="2" cursor={'pointer'} {...restProps}>
      <Flex align={'center'} gap="2">
        <Image src={icon} w="5" h="5" />
        <Text data-testid={`text-chainname-${title}`} fontWeight={'700'}>
          {title}
        </Text>
      </Flex>
      <Image src={rightImgSrc} w="5" h="5" />
    </Flex>
  );
};

export default function ChainSelectMultiple({ activeChains, onChange, ...restProps }: any) {
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
    <Flex flexDir={'column'} rounded="16px" userSelect={'none'} py="1" px="10px">
      <Menu>
        <MenuButton>
          <MenuLine
            onClick={toggleCheckAll}
            icon={IconAllNetwork}
            title={'All networks'}
            checked={activeChains.length === chainList.length}
            isMenu={true}
            py="10px"
            px="16px"
            rounded="100px"
            {...restProps}
          />
        </MenuButton>
        <MenuList w="250px" flex="0 0 250px" p="4">
          {chainList.map((item: any, idx: number) => {
            return (
              <React.Fragment key={idx}>
                {idx ? <Divider /> : ''}
                <Box key={item.chainIdHex} onClick={() => toggleActiveChains(item.chainIdHex)}>
                  <MenuLine
                    icon={item.iconSquare}
                    title={item.chainName}
                    checked={activeChains.includes(item.chainIdHex)}
                  />
                </Box>
              </React.Fragment>
            );
          })}
        </MenuList>
      </Menu>
    </Flex>
  );
}
