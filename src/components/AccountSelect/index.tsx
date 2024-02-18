import React from 'react';
import { Flex, Menu, MenuButton, Image, MenuItem, Text, MenuList, Box, useMediaQuery } from '@chakra-ui/react';
import IconCheveronRight from '@/assets/icons/chevron-right.svg';
import IconChecked from '@/assets/icons/checked.svg';
// import IconLoading from '@/assets/loading.gif';
import useBrowser from '@/hooks/useBrowser';
import useConfig from '@/hooks/useConfig';
import { IAddressItem, useAddressStore } from '@/store/address';
import { toShortAddress } from '@/lib/tools';
import IconCopy from '@/assets/copy.svg';
// import { PlusSquareIcon } from '@chakra-ui/icons';
import useTools from '@/hooks/useTools';
import { useSettingStore } from '@/store/setting';
import { useChainStore } from '@/store/chain';

// const CreateAccount = () => {
//   const [creating, setCreating] = useState(false);

//   const doCreate = async () => {};

//   return (
//     <MenuItem onClick={doCreate} as={Flex} gap="2" closeOnSelect={false} cursor={'pointer'}>
//       {creating ? <Image src={IconLoading} w="24px" /> : <PlusSquareIcon boxSize="6" />}
//       <Text fontSize={'14px'} fontWeight={'700'} lineHeight={1}>
//         Create account
//       </Text>
//     </MenuItem>
//   );
// };

export function AccountSelectFull({ ...restProps }) {
  const { selectedAddress } = useAddressStore();
  const { doCopy } = useTools();
  const { chainConfig } = useConfig();
  const { checkInitialized } = useTools();

  return (
    <Flex align={'center'} gap="2px" {...restProps}>
      <AccountSelect pl={{ base: '2', lg: '4' }} pr={{ base: 2, lg: 4 }} />
      <Flex
        w={{ base: '44px', lg: 'unset' }}
        gap="1"
        align={'center'}
        px="3"
        py="10px"
        roundedRight={'full'}
        bg={'#f2f2f2'}
      >
        <Image
          src={IconCopy}
          w="20px"
          cursor={'pointer'}
          onClick={() => (checkInitialized(true) ? doCopy(`${chainConfig.addressPrefix}${selectedAddress}`) : null)}
        />
      </Flex>
    </Flex>
  );
}

export function AccountSelect({ labelType = 'title', wrapperProps, isInModal, ...restProps }: any) {
  const { navigate } = useBrowser();
  const { selectedAddressItem, selectedChainItem } = useConfig();
  const [isLargerThan992] = useMediaQuery('(min-width: 992px)');
  const { getAddressName } = useSettingStore();
  const { addressList, selectedAddress, setSelectedAddress } = useAddressStore();
  const { getChainItem, setSelectedChainId } = useChainStore();

  const onAddressChange = (item: IAddressItem) => {
    console.log('change addr', item);
    setSelectedAddress(item.address);
    setSelectedChainId(item.chainIdHex);
  };

  const addressLength = isLargerThan992 ? 5 : 2;

  return selectedAddressItem ? (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton data-testid="btn-account-select" {...wrapperProps}>
            <Flex
              align="center"
              justify={'space-between'}
              px="3"
              py="10px"
              h="40px"
              w={{ lg: '340px' }}
              fontSize={{ base: '12px', lg: '16px' }}
              bg={isInModal ? 'transparent' : '#f2f2f2'}
              roundedLeft={'full'}
              cursor={'pointer'}
              _hover={{ color: 'brand.red' }}
              onClick={() => navigate('/accounts')}
              {...restProps}
            >
              <>
                {isInModal && selectedAddressItem && (
                  <Text>
                    {getAddressName(selectedAddress)} ({toShortAddress(selectedAddress)})
                  </Text>
                )}
                {!isInModal && (
                  <Flex mr="1" align={'center'}>
                    {isLargerThan992 && <Image w="5" h="5" mr="2" src={selectedChainItem.iconSquare} />}
                    <Text fontWeight={'700'}>{selectedChainItem.chainName}</Text>
                    &nbsp;
                    <Text fontWeight={'600'}>
                      ({toShortAddress(selectedAddressItem.address, addressLength, addressLength)})
                    </Text>
                  </Flex>
                )}
              </>

              <Image
                src={IconCheveronRight}
                w={{ base: 3, lg: 5 }}
                h={{ base: 3, lg: 5 }}
                transform={isOpen ? 'rotate(90deg)' : 'none'}
              />
            </Flex>
          </MenuButton>

          <MenuList w={{ lg: '340px' }} zIndex={'200'}>
            {addressList.map((item: any, idx: number) => {
              const chainInfo = getChainItem(item.chainIdHex);
              return (
                <React.Fragment key={idx}>
                  {/* {idx ? <MenuDivider /> : ''} */}
                  <MenuItem
                    key={item.address}
                    {...(item.recovering
                      ? { cursor: 'not-allowed', filter: 'grayscale(100%)' }
                      : {
                          onClick: () => onAddressChange(item),
                        })}
                  >
                    <Flex w="100%" align={'center'} justify={'space-between'}>
                      <Flex align={'center'} gap="3">
                        <Image src={chainInfo.iconSquare} w="8" h="8" />
                        {/* <AddressIcon address={item.address} width={24} /> */}
                        <Box>
                          <Flex gap="1" align={'center'}>
                            <Text fontSize={'16px'} fontWeight={'700'} lineHeight={1.25}>
                              {chainInfo.chainName}
                            </Text>
                            {item.recovering && (
                              <Box px="1" rounded="4px" bg="rgba(0, 0, 0, 0.05)" fontSize={'10px'} fontWeight={'500'}>
                                Recovering
                              </Box>
                            )}
                          </Flex>

                          <Text fontSize={'12px'} data-testid={`text-accountname-${idx}`} lineHeight={1.6}>
                            {toShortAddress(item.address)}
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
  ) : (
    <Flex
      align="center"
      px="3"
      py="10px"
      h="40px"
      fontSize={{ base: '12px', lg: '16px' }}
      bg={isInModal ? 'transparent' : '#f2f2f2'}
      roundedLeft={'full'}
      {...restProps}
    >
      <Flex mr="1" align={'center'}>
        {/* <Image w="5" h="5" src={selectedChainItem.icon} /> */}
        <Text fontWeight={'700'}>{selectedChainItem.chainName}</Text>
        &nbsp;
        <Text fontWeight={'600'}>(******)</Text>
      </Flex>
    </Flex>
  );
}
