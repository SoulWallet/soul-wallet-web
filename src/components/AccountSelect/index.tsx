import React, { useState } from 'react';
import { Flex, Menu, MenuButton, Image, MenuItem, Text, MenuList, MenuDivider, Box } from '@chakra-ui/react';
import IconCheveronRight from '@/assets/icons/chevron-right.svg';
import IconChecked from '@/assets/icons/checked.svg';
import IconLoading from '@/assets/loading.gif';
import useBrowser from '@/hooks/useBrowser';
import useConfig from '@/hooks/useConfig';
import { useAddressStore } from '@/store/address';
import { toShortAddress } from '@/lib/tools';
import AddressIcon from '../AddressIcon';
import useSdk from '@/hooks/useSdk';
import IconPlus from '@/assets/icons/plus.svg';
import { PlusSquareIcon } from '@chakra-ui/icons';

const CreateAccount = () => {
  const [creating, setCreating] = useState(false);
  const { calcWalletAddress } = useSdk();
  const { addressList, addAddressItem } = useAddressStore();

  const doCreate = async () => {
    setCreating(true);
    const newIndex = addressList.length;
    const newAddress = await calcWalletAddress(newIndex);
    addAddressItem({
      title: `Account ${newIndex + 1}`,
      address: newAddress,
      activatedChains: [],
      allowedOrigins: [],
    });
    setCreating(false);
  };

  return (
    <MenuItem onClick={doCreate} as={Flex} gap="2" closeOnSelect={false} cursor={'pointer'}>
      {creating ? <Image src={IconLoading} w="24px" /> : <PlusSquareIcon boxSize="6" />}
      <Text fontSize={'14px'} fontWeight={'700'} lineHeight={1}>
        Create account
      </Text>
    </MenuItem>
  );
};

const DestroyAccount = () => {
  const doDestroy = async () => {
    localStorage.clear();
    location.href = '/launch';
  };

  return (
    <MenuItem onClick={doDestroy} pl="44px" as={Flex} gap="2" closeOnSelect={false} cursor={'pointer'}>
      <Text fontSize={'14px'} fontWeight={'700'} lineHeight={1} color="red">
        Destroy Wallet (for test)
      </Text>
    </MenuItem>
  );
};

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
                        <AddressIcon address={item.address} width={24} />
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
            <MenuDivider />
            <CreateAccount />
            <DestroyAccount />
          </MenuList>
        </>
      )}
    </Menu>
  );
}
