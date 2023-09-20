import React from "react";
import { Box } from "@chakra-ui/react";
import { Navbar } from "@/components/Navbar";
import SendAssets from "@/components/SendAssets";
import config from "@/config";
import {ethers} from 'ethers'

export default function Send() {
    const tokenAddress = params.tokenAddress || ethers.ZeroAddress;
    return (
        <Box p="5">
            <Navbar backUrl="wallet" />
            <SendAssets tokenAddress={tokenAddress} />
        </Box>
    );
}
