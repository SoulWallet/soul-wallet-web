import { useEffect, useState } from 'react';
import { Box, Flex, Text, Table, Tr, Thead, Tbody, Th, Td, Image, GridItem, Grid } from '@chakra-ui/react';
import { useAddressStore } from '@/store/address';
import { useBalanceStore } from '@/store/balance';
import EmptyHint from '@/components/EmptyHint';
import { useChainStore } from '@/store/chain';

// used only for testing nft balance
const testWalletAddress = '0x120b4Ba4df837507B91dbd0A250eac28bE063b39';
const testChainId = 1;

export default function NftsTable() {
  const { selectedAddress } = useAddressStore();
  const { fetchNftBalance, nftBalance } = useBalanceStore();
  const { selectedChainId } = useChainStore();

  useEffect(() => {
    if (!selectedAddress) {
      return;
    }
    fetchNftBalance(testWalletAddress, testChainId);
  }, [selectedAddress, selectedChainId]);

  return (
    <>
      {(!nftBalance || nftBalance.length === 0) && <EmptyHint title="You have no NFTs yet" />}
      <Grid templateColumns={'repeat(4, 1fr)'} gap="9">
        {nftBalance
          .filter((item: any) => item.logoURI)
          .map((item: any) => (
            <GridItem bg="#f5f5f5" overflow={"hidden"} rounded={'20px'}>
              <Image  src={item.logoURI} />
              <Text p="4" fontWeight={'800'}>
                {item.title}
              </Text>
            </GridItem>
          ))}
      </Grid>
    </>
  );
}
