import React from 'react';
import { Box, Flex, Menu, MenuButton, Image, MenuItem, Text, MenuList, MenuDivider, useToast } from '@chakra-ui/react';
import IconCheveronRight from '@/assets/icons/chevron-right.svg';
import IconChecked from '@/assets/icons/checked.svg';
import { useChainStore } from '@/store/chain';
import useConfig from '@/hooks/useConfig';
import DropdownSelect from '../DropdownSelect';
import { toShortAddress } from '@/lib/tools';
import { useAddressStore } from '@/store/address';

export default function ChainSelect({ isInModal }: any) {
  const { chainList, setSelectedChainId, selectedChainId } = useChainStore();
  const { selectedChainItem, selectedAddressItem } = useConfig();
  const { addressList } = useAddressStore();


  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
          // width={isInModal ? '100%' : 'auto'}
          // height={isInModal ? '48px' : '44px'}
          >
            <DropdownSelect>
              <Flex gap="1" align={'center'}>
                {!isInModal && <Image src={selectedChainItem.icon} w="22px" h="22px" />}
                {isInModal && (
                  <Text>
                    {selectedChainItem.chainName}({toShortAddress(selectedAddressItem.address)})
                  </Text>
                )}
                {/* <Box marginLeft={isInModal ? 'auto' : '0px'}>
                  <Image src={IconCheveronRight} transform={isOpen ? 'rotate(90deg)' : 'none'} w="20px" h="20px" />
                </Box> */}
              </Flex>
            </DropdownSelect>
          </MenuButton>

          <MenuList w="260px">
            {chainList.map((item: any, idx: number) => {
              const isRecovering = addressList.filter(addressItem => addressItem.chainIdHex === item.chainIdHex)[0].recovering;
              return (
                <React.Fragment key={idx}>
                  {idx ? <MenuDivider /> : ''}
                  <MenuItem
                    key={item.chainIdHex}
                    filter={isRecovering ? 'grayscale(1)' : ''}
                    onClick={() => setSelectedChainId(item.chainIdHex)}
                  >
                    <Flex w="100%" align={'center'} justify={'space-between'}>
                      <Flex align={'center'} gap="2">
                        <Image src={item.icon} w="5" h="5" />
                        <Text data-testid={`text-chainname-${idx}`}>{item.chainName}</Text>
                      </Flex>
                      {isRecovering && <Text fontSize="12px">Recovering</Text>}
                      {item.chainIdHex === selectedChainId && !isRecovering && (
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
