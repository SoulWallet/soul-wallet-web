import React from 'react';
import { Flex, Text, MenuButton, Menu, MenuList, MenuItem } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import IconChevronRight from '@/assets/icons/chevron-right-purple.svg';
import { ethers } from 'ethers';
import TokenLine from './TokenLine';
import IconSponsor from '@/assets/icons/sponsor.svg';
import { ITokenBalanceItem, useBalanceStore } from '@/store/balance';
import useConfig from '@/hooks/useConfig';
export default function GasSelect({ gasToken, onChange, sponsor, useSponsor }: any) {
  const { tokenBalance } = useBalanceStore();
  const { chainConfig } = useConfig();

  return (
    <Menu>
      <MenuButton>
        <Flex align="center">
          <Text color="brand.purple">
            {sponsor && useSponsor
              ? 'Sponsored'
              : tokenBalance.filter((item: ITokenBalanceItem) => item.contractAddress === gasToken)[0].symbol}
          </Text>
          <Image src={IconChevronRight} />
        </Flex>
      </MenuButton>
      <MenuList>
        {sponsor && (
          <MenuItem onClick={() => onChange(ethers.ZeroAddress, true)}>
            <TokenLine icon={IconSponsor} symbol={'Sponsor'} memo={sponsor.sponsorParty || 'Soul Wallet'} />
          </MenuItem>
        )}
        {tokenBalance
          .filter(
            (item: ITokenBalanceItem) =>
              (item.contractAddress !== gasToken || useSponsor) &&
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
