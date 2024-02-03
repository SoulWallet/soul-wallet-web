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

  return (
    <Menu>
      <MenuButton>
        <DropdownSelect>
          <Image src={selectedToken.logoURI} w="4" h="4" />
          {selectedToken.symbol}
        </DropdownSelect>
        {/* <Flex align="center">
          <Text color="brand.purple">
            {sponsor && useSponsor
              ? 'Sponsored'
              : tokenBalance.filter((item: ITokenBalanceItem) => item.contractAddress === gasToken)[0].symbol}
          </Text>
          <Image src={IconChevronRight} />
        </Flex> */}
      </MenuButton>
      <MenuList>
        {/* {sponsor && (
          <MenuItem onClick={() => onChange(ethers.ZeroAddress, true)}>
            <TokenLine icon={IconSponsor} symbol={'Sponsor'} memo={sponsor.sponsorParty || 'Soul Wallet'} />
          </MenuItem>
        )} */}
        {tokenBalance
          .filter(
            (item: ITokenBalanceItem) =>
              item.contractAddress !== gasToken &&
              (item.contractAddress === ethers.ZeroAddress ||
                chainConfig.paymasterTokens.map((item: any) => item.toLowerCase()).includes(item.contractAddress)),
          )
          .map((item: ITokenBalanceItem) => (
            <MenuItem key={item.contractAddress} onClick={() => onChange(item.contractAddress, false)}>
              <TokenLine icon={item.logoURI} symbol={item.symbol} memo={item.tokenBalanceFormatted} />
            </MenuItem>
          ))}
      </MenuList>
    </Menu>
  );
}
