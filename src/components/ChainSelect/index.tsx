import React from 'react';
import { Box, Flex, Menu, MenuButton, Image, MenuItem, Text, MenuList, MenuDivider, useToast } from '@chakra-ui/react';
import IconCheveronRight from '@/assets/icons/chevron-right.svg';
import IconChecked from '@/assets/icons/checked.svg';
import { useChainStore } from '@/store/chain';
import useConfig from '@/hooks/useConfig';

export default function ChainSelect({ isInModal }: any) {
  const { chainList, setSelectedChainId, selectedChainId } = useChainStore();
  // const toast = useToast();
  const { selectedChainItem } = useConfig();

  // const doSwitchChain = (item: any) => {
  //   if (item.recovering) {
  //     toast({
  //       title: 'This chain is recovering',
  //       status: 'info',
  //     });
  //   } else {
  //     ;
  //   }
  // };

  // console.log('selectedChainItem', selectedChainItem)
  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton data-testid="btn-chain-select" width={isInModal ? '100%' : 'auto'} height={isInModal ? '48px' : '44px'}>
            <Flex px="3" py="10px" bg={isInModal ? 'transparent': '#f2f2f2'} rounded={'full'} cursor={'pointer'}>
              {!isInModal && <Image src={selectedChainItem.icon} w="22px" h="22px" />}
              {isInModal && <Text fontWeight="800" fontSize="12px" marginLeft="4px">{selectedChainItem.chainName}</Text>}
              <Box marginLeft={isInModal ? 'auto' : '0px'}>
                <Image src={IconCheveronRight} transform={isOpen ? 'rotate(90deg)' : 'none'} w="20px" h="20px" />
              </Box>
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
                    onClick={() => setSelectedChainId(item.chainIdHex)}
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
