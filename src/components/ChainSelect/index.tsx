import React from 'react';
import { Flex, Menu, MenuButton, Image, MenuItem, Text, MenuList, MenuDivider, useToast } from '@chakra-ui/react';
import IconCheveronRight from '@/assets/icons/chevron-right.svg';
import IconChecked from '@/assets/icons/checked.svg';
import { useChainStore } from '@/store/chain';
import useConfig from '@/hooks/useConfig';

export default function ChainSelect() {
  const { chainList, setSelectedChainId, selectedChainId } = useChainStore();
  const toast = useToast();
  const { selectedChainItem } = useConfig();

  const doSwitchChain = (item: any) => {
    if (item.recovering) {
      toast({
        title: 'This chain is recovering',
        status: 'info',
      });
    } else {
      setSelectedChainId(item.chainIdHex);
    }
  };

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton data-testid="btn-chain-select">
            <Flex px="3" py="10px" bg="#f2f2f2" rounded={'full'} cursor={'pointer'}>
              <Image src={selectedChainItem.icon} w="22px" h="22px" />
              <Image src={IconCheveronRight} transform={isOpen ? 'rotate(90deg)' : 'none'} w="20px" h="20px" />
            </Flex>
          </MenuButton>

          <MenuList w="260px">
            {chainList.map((item: any, idx: number) => {
              return (
                <React.Fragment key={idx}>
                  {idx ? <MenuDivider /> : ''}
                  <MenuItem
                    key={item.chainIdHex}
                    filter={item.recovering ? 'grayscale(1)' : ''}
                    onClick={() => doSwitchChain(item)}
                  >
                    <Flex w="100%" align={'center'} justify={'space-between'}>
                      <Flex align={'center'} gap="2">
                        <Image src={item.icon} w="5" h="5" />
                        <Text data-testid={`text-chainname-${idx}`} fontWeight={'700'}>
                          {item.chainName}
                        </Text>
                      </Flex>
                      {item.recovering && <Text fontSize="12px">Recovering</Text>}
                      {item.chainIdHex === selectedChainId && !item.recovering && (
                        <Image src={IconChecked} w="5" h="5" />
                      )}
                    </Flex>
                  </MenuItem>
                </React.Fragment>
              );
            })}
          </MenuList>
        </>
      )}
    </Menu>
  );
}
