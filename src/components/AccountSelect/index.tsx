import React, { useState } from 'react';
import { Flex, Menu, MenuButton, Image, MenuItem, Text, MenuList, MenuDivider, Box } from '@chakra-ui/react';
import IconCheveronRight from '@/assets/icons/chevron-right.svg';
import IconChecked from '@/assets/icons/checked.svg';

import useBrowser from '@/hooks/useBrowser';
import useConfig from '@/hooks/useConfig';
import { useAddressStore } from '@/store/address';
import { toShortAddress } from '@/lib/tools';
import AddressIcon from '../AddressIcon';

export default function AccountSelect() {
  const { navigate } = useBrowser();
  const { selectedAddressItem } = useConfig();
  const { addressList, setSelectedAddress } = useAddressStore();

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton data-testid="btn-account-select">
            <Flex
              align="center"
              gap="2px"
              fontWeight={'800'}
              cursor={'pointer'}
              _hover={{ color: 'brand.red' }}
              onClick={() => navigate('accounts')}
            >
              {selectedAddressItem && <Text>{selectedAddressItem.title}</Text>}
              <Image src={IconCheveronRight} w="20px" h="20px" transform={isOpen ? 'rotate(90deg)' : 'none'} />
            </Flex>
          </MenuButton>

          <MenuList w="200px">
            {addressList.map((item: any, idx: number) => {
              return (
                <React.Fragment key={idx}>
                  {idx ? <MenuDivider /> : ''}
                  <MenuItem key={item.address} onClick={() => setSelectedAddress(item.address)}>
                    <Flex w="100%" align={'center'} justify={'space-between'}>
                      <Flex align={'center'} gap="2">
                        <AddressIcon address={item.address} width={28} />
                        <Box>
                          <Text mb="1" fontSize={'14px'} fontWeight={'700'} lineHeight={1}>
                            {item.title}
                          </Text>
                          <Text fontSize={'12px'} data-testid={`text-accountname-${idx}`} lineHeight={1}>
                            {toShortAddress(item.address, 4, 6)}
                          </Text>
                        </Box>
                      </Flex>
                      {item.address === selectedAddressItem.address && <Image src={IconChecked} w="5" h="5" />}
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
