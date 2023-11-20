import { useEffect } from 'react';
import { Box, Text, Flex, Menu, Image, MenuButton, MenuList, MenuItem, Input } from '@chakra-ui/react';

import TokenLine from './TokenLine';
import Button from '@/components/Button';
import { ITokenBalanceItem, useBalanceStore } from '@/store/balance';
import IconChevronRight from '@/assets/icons/chevron-right.svg';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import useConfig from '@/hooks/useConfig';

export default function AmountInput({ sendToken, label, onTokenChange, amount, onChange }: any) {
  const { tokenBalance, fetchTokenBalance } = useBalanceStore();
  const { selectedAddress } = useAddressStore();
  const { selectedChainItem } = useConfig();

  const selectedToken = tokenBalance.filter((item: ITokenBalanceItem) => item.contractAddress === sendToken)[0];

  const onInputChange = (event: any) => {
    const inputValue = event.target.value;

    if (inputValue === '.') {
      return;
    }

    // only allow number
    const filteredValue = inputValue.replace(/[^0-9.]/g, '');

    // remove extra dot
    if ((filteredValue.match(/\./g) || []).length > 1) {
      onChange(filteredValue.replace(/\.(?=.*\.)/g, ''));
    } else {
      onChange(filteredValue);
    }
  };

  useEffect(() => {
    const { chainIdHex, paymasterTokens } = selectedChainItem;
    if (!selectedAddress || !chainIdHex || !paymasterTokens) {
      return;
    }
    fetchTokenBalance(selectedAddress, chainIdHex, paymasterTokens);
  }, [selectedAddress, selectedChainItem]);

  return (
    <Box>
      <Text fontFamily={'Martian'} fontSize="12px" fontWeight={'500'} mb="1" px="4">
        {label}
      </Text>
      <Flex flexDir={'column'} pos={"relative"} gap="3" 
      // py="3" px="4"
       bg={'rgba(247, 247, 247, 0.74)'} rounded="20px">
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton px="4" pt="3">
                <TokenLine
                  icon={selectedToken.logoURI}
                  symbol={selectedToken.symbol}
                  memo={`Available: ${selectedToken.tokenBalanceFormatted || '0'}`}
                  rightElement={<Image src={IconChevronRight} transform={isOpen ? 'rotate(90deg)' : ''} />}
                />
              </MenuButton>
              <MenuList rootProps={{ w: '100%' }}>
                {tokenBalance
                  .filter((item: ITokenBalanceItem) => item.contractAddress !== sendToken)
                  .map((item: ITokenBalanceItem) => (
                    <MenuItem w="100%" key={item.contractAddress}>
                      <TokenLine
                        icon={item.logoURI}
                        symbol={item.symbol}
                        memo={item.tokenBalanceFormatted}
                        onClick={() => onTokenChange(item.contractAddress)}
                      />
                    </MenuItem>
                  ))}
              </MenuList>
            </>
          )}
        </Menu>
        <Box bg="#d7d7d7" h="1px" mx="4" />
        <Box px="4" pb="3">
          <Input
            value={amount}
            onChange={onInputChange}
            placeholder="0.0"
            outline="none"
            border="none"
            fontSize="40px"
            fontWeight={'800'}
            lineHeight={'1'}
            color="#1e1e1e"
            variant={'unstyled'}
          />
          <Flex align="center" justify={'flex-end'}>
            <Button
              color="#1e1e1e"
              border={'1px solid #1e1e1e'}
              bg="transparent"
              _hover={{ bg: '#1e1e1e', color: '#fff' }}
              py="1"
              fontWeight={'800'}
              px="2"
              fontSize={'14px'}
              height={'unset'}
              rounded={'full'}
              onClick={() => {
                onChange(selectedToken.tokenBalanceFormatted);
              }}
            >
              MAX
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
