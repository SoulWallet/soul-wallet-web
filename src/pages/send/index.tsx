import React from "react";
import { Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import SendAssets from "@/components/SendAssets";
import {ethers} from 'ethers'

export default function Send() {
    const params = useParams();
    const tokenAddress = params.tokenAddress || ethers.ZeroAddress;
    return (
        <Box p="5">
            <Navbar backUrl="wallet" />
            <SendAssets tokenAddress={tokenAddress} />
        </Box>
    );
}
