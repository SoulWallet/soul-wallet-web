import React, { useEffect, useState } from 'react';
import { Flex, Menu, MenuButton, Image, MenuItem, Text, MenuList, MenuDivider, Box, useToast } from '@chakra-ui/react';
import IconCheveronRight from '@/assets/icons/chevron-right.svg';
import IconChecked from '@/assets/icons/checked.svg';
import IconLoading from '@/assets/loading.gif';
import useBrowser from '@/hooks/useBrowser';
import useConfig from '@/hooks/useConfig';
import { useAddressStore } from '@/store/address';
import { toShortAddress } from '@/lib/tools';
import AddressIcon from '../AddressIcon';
import useSdk from '@/hooks/useSdk';
import IconCopy from '@/assets/copy.svg';
import { PlusSquareIcon } from '@chakra-ui/icons';
import useTools from '@/hooks/useTools';
import { useSettingStore } from '@/store/setting';

const CreateAccount = () => {
  const [creating, setCreating] = useState(false);
  const { calcWalletAddress } = useSdk();
  const { addressList, addAddressItem } = useAddressStore();
  const { saveAddressName } = useSettingStore();

  const doCreate = async () => {
    if (creating) {
      return;
    }
    setCreating(true);
    const newIndex = addressList.length;
    const newAddress = await calcWalletAddress(newIndex);
    addAddressItem({
      address: newAddress,
      activatedChains: [],
    });
    saveAddressName(newAddress, `Account ${newIndex + 1}`, true);
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

export function AccountSelectFull({ ...restProps }) {
  const { selectedAddress } = useAddressStore();
  const { doCopy } = useTools();

  return (
    <Flex align={'center'} gap="2px" {...restProps}>
      <AccountSelect pl={{ base: '3', lg: '4' }} wrapperProps={{ w: { base: '50%', lg: 'unset' } }} />
      <Flex
        w={{ base: '50%', lg: 'unset' }}
        gap="1"
        align={'center'}
        px="3"
        py="10px"
        roundedRight={'full'}
        bg={{ base: '#fff', lg: '#f2f2f2' }}
      >
        {/* <Text fontSize={'12px'} fontFamily={'Martian'} fontWeight={'600'}>
          {toShortAddress(selectedAddress, 5, 4)}
        </Text> */}
        <Image src={IconCopy} w="20px" cursor={'pointer'} onClick={() => doCopy(selectedAddress)} />
      </Flex>
    </Flex>
  );
}

export function AccountSelect({ labelType = 'title', wrapperProps, isInModal, ...restProps }: any) {
  const { navigate } = useBrowser();
  const { selectedAddressItem, selectedChainItem } = useConfig();
  const { getAddressName } = useSettingStore();
  const { addressList, setAddressList, selectedAddress, setSelectedAddress } = useAddressStore();

  useEffect(() => {
    setAddressList([
      {
        address: '0x1277d149314bB96292ec2B135D5caa5AB02Fb2D6',
        activatedChains: [],
      },
      {
        address: '0x1277d149314bB96292ec2B135D5caa5AB02Fb2D4',
        activatedChains: [],
      },
    ]);
  }, []);
  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton data-testid="btn-account-select" {...wrapperProps}>
            <Flex
              align="center"
              px="3"
              py="10px"
              h="40px"
              bg={isInModal ? 'transparent' : { base: '#fff', lg: '#f2f2f2' }}
              roundedLeft={'full'}
              cursor={'pointer'}
              _hover={{ color: 'brand.red' }}
              onClick={() => navigate('/accounts')}
              {...restProps}
            >
              {isInModal && selectedAddressItem && (
                <Text>
                  {getAddressName(selectedAddress)} ({toShortAddress(selectedAddress, 4, 6)})
                </Text>
              )}
              {!isInModal && selectedAddressItem && (
                <Flex mr="1" align={'center'}>
                  <Image w="5" h="5" src={selectedChainItem.icon} />
                  <Text ml="2" fontWeight={'700'}>
                    {selectedChainItem.chainName}
                  </Text>
                  &nbsp;
                  <Text fontWeight={'600'}>({toShortAddress(selectedAddressItem.address, 5, 5)})</Text>
                </Flex>
              )}
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
                            {getAddressName(item.address)}
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
            {/* <MenuDivider />
            <CreateAccount /> */}
            {/* <DestroyAccount /> */}
          </MenuList>
        </>
      )}
    </Menu>
  );
}
