import { Flex, Text, Image, MenuButton, Menu, MenuList, MenuItem } from '@chakra-ui/react';
import { ethers } from 'ethers';
import TokenLine from './TokenLine';
import { ITokenBalanceItem, useBalanceStore } from '@/store/balance';
import useConfig from '@/hooks/useConfig';
import DropdownSelect from '@/components/DropdownSelect';
export default function GasSelect({ gasToken, onChange }: any) {
  const { tokenBalance } = useBalanceStore();
  const { chainConfig } = useConfig();

  const selectedToken = tokenBalance.filter((item: ITokenBalanceItem) => item.contractAddress === gasToken)[0];
  const unselectedToken = tokenBalance.filter(
    (item: ITokenBalanceItem) =>
      item.contractAddress !== gasToken &&
      (item.contractAddress === ethers.ZeroAddress ||
        chainConfig.paymasterTokens.map((item: any) => item.toLowerCase()).includes(item.contractAddress)),
  );
  return unselectedToken.length > 0 ? (
    <Menu>
      <MenuButton>
        <DropdownSelect>
          <Image src={selectedToken.logoURI} w="4" h="4" />
          {selectedToken.symbol}
        </DropdownSelect>
      </MenuButton>
      <MenuList>
        {unselectedToken.map((item: ITokenBalanceItem) => (
          <MenuItem key={item.contractAddress} onClick={() => onChange(item.contractAddress, false)}>
            <TokenLine icon={item.logoURI} symbol={item.symbol} memo={item.tokenBalanceFormatted} />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  ) : (
    <DropdownSelect hideChevron={true}>
      <Image src={selectedToken.logoURI} w="4" h="4" />
      {selectedToken.symbol}
    </DropdownSelect>
  );
}
