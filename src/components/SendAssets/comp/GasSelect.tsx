import React from "react";
import { Flex, Text, MenuButton, Menu, MenuList, MenuItem } from "@chakra-ui/react";
import {Image} from "@chakra-ui/react";
import IconChevronRightRed from "@/assets/icons/chevron-right-red.svg";
import { ethers } from "ethers";
import TokenLine from "./TokenLine";
import { ITokenBalanceItem, useBalanceStore } from "@/store/balance";
import useConfig from "@/hooks/useConfig";
export default function GasSelect({ gasToken, onChange }: any) {
    const { tokenBalance } = useBalanceStore();
    const { chainConfig } = useConfig();

    return (
        <Menu>
            <MenuButton>
                <Flex align="center">
                    <Text color="brand.red">
                        {tokenBalance.filter((item: ITokenBalanceItem) => item.contractAddress === gasToken)[0].symbol}
                    </Text>
                    <Image src={IconChevronRightRed} />
                </Flex>
            </MenuButton>
            <MenuList>
                {tokenBalance
                    .filter(
                        (item: ITokenBalanceItem) =>
                            item.contractAddress !== gasToken &&
                            (item.contractAddress === ethers.ZeroAddress ||
                                chainConfig.paymasterTokens
                                    .map((item: any) => item.toLowerCase())
                                    .includes(item.contractAddress)),
                    )
                    .map((item: ITokenBalanceItem) => (
                        <MenuItem key={item.contractAddress} onClick={() => onChange(item.contractAddress)}>
                            <TokenLine icon={item.logoURI} symbol={item.symbol} memo={item.tokenBalanceFormatted} />
                        </MenuItem>
                    ))}
            </MenuList>
        </Menu>
    );
}
