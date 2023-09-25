import React from 'react';
import { Flex, Menu, MenuButton, Image, MenuItem, Text, MenuList, MenuDivider } from '@chakra-ui/react';
import IconCheveronRight from '@/assets/icons/chevron-right.svg';
import IconChecked from '@/assets/icons/checked.svg';
import { useChainStore } from '@/store/chain';
import useConfig from '@/hooks/useConfig';
import useBrowser from '@/hooks/useBrowser';

export default function ChainSelect() {
  const { chainList, setSelectedChainId, selectedChainId } = useChainStore();
  const { navigate } = useBrowser();
  const { selectedChainItem } = useConfig();
  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton data-testid="btn-chain-select">
            <Flex p="5px" bg="rgba(98, 126, 234, 0.15)" rounded={'full'} cursor={'pointer'}>
              <Image src={selectedChainItem.icon} w="22px" h="22px" />
              <Image src={IconCheveronRight} transform={isOpen ? 'rotate(90deg)' : 'none'} w="20px" h="20px" />
            </Flex>
          </MenuButton>

          <MenuList w="200px">
            {chainList.map((item: any, idx: number) => {
              return (
                <React.Fragment key={idx}>
                  {idx ? <MenuDivider /> : ''}
                  <MenuItem
                    key={item.chainIdHex}
                    filter={item.recovering ? 'grayscale(1)' : ''}
                    onClick={() => (item.recovering ? navigate('recover') : setSelectedChainId(item.chainIdHex))}
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
