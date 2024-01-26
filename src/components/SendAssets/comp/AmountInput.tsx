import { useEffect } from 'react';
import { Box, Text, Flex, Menu, Image, MenuButton, MenuList, MenuItem, Input } from '@chakra-ui/react';

import TokenLine from './TokenLine';
import Button from '@/components/Button';
import { ITokenBalanceItem, useBalanceStore } from '@/store/balance';
import IconChevronRight from '@/assets/icons/chevron-right.svg';
import { useAddressStore } from '@/store/address';
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
      <Text fontFamily={'Martian'} fontSize="12px" fontWeight={'700'} mb="2" lineHeight={'1'}>
        {label}
      </Text>
      <Flex flexDir={'column'} pos={'relative'} gap="3" bg={'#f9f9f9'} rounded="20px">
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton px="4" pt="3">
                <TokenLine
                  icon={selectedToken.logoURI}
                  symbol={selectedToken.symbol}
                  memo={`Available: ${selectedToken.tokenBalanceFormatted || '0'}`}
                  rightElement={<Image src={IconChevronRight} w="5" transform={isOpen ? 'rotate(90deg)' : ''} />}
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
          <Flex align={'center'} gap="1">
            <Text fontSize={'20px'} color="rgba(0, 0, 0, 0.20)">
              $
            </Text>
            <Input
              value={amount}
              onChange={onInputChange}
              placeholder="0"
              _placeholder={{
                color: 'rgba(0, 0, 0, 0.20)',
              }}
              outline="none"
              border="none"
              fontSize="48px"
              fontWeight={'800'}
              lineHeight={'1'}
              color="#1e1e1e"
              variant={'unstyled'}
            />
          </Flex>

          <Flex align="center" justify={'flex-end'}>
            <Button
              type="purple"
              py="2px"
              lineHeight={'20px'}
              fontWeight={'800'}
              px="3"
              fontSize={'12px'}
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
