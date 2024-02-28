import { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Table,
  Tr,
  Thead,
  Tbody,
  Th,
  Td,
  Image,
  GridItem,
  Grid,
  TableContainer,
} from '@chakra-ui/react';
import BN from 'bignumber.js';
import useWalletContext from '@/context/hooks/useWalletContext';
import IconDefaultToken from '@/assets/tokens/default.svg';
import { useChainStore } from '@/store/chain';
import IconSend from '@/assets/icons/wallet/send.svg';
import IconLoading from '@/assets/loading.svg';
import { ITokenBalanceItem, useBalanceStore } from '@/store/balance';
import useConfig from '@/hooks/useConfig';
import EmptyHint from '@/components/EmptyHint';
import AssetEmpty from '@/assets/icons/asset-empty.svg';
import { toFixed } from '@/lib/tools';
export default function TokensTable() {
  const { showSend } = useWalletContext();
  const { fetchTokenBalance, tokenBalance } = useBalanceStore();
  const { setSelectedChainId, selectedChainId } = useChainStore();
  const { selectedAddressItem, selectedChainItem } = useConfig();

  useEffect(() => {
    if (!selectedAddressItem.address || !selectedChainItem.chainIdHex) return;
    fetchTokenBalance(selectedAddressItem.address, selectedChainItem.chainIdHex, selectedChainItem.paymasterTokens);
  }, [selectedAddressItem, selectedChainItem]);

  const showTransfer = (tokenAddress: string, chainIdHex: string) => {
    // IMPORTANT TODO, change to this chain id
    setSelectedChainId(chainIdHex);
    showSend(tokenAddress);
  };

  const isEmpty = tokenBalance.every((item: ITokenBalanceItem) => BN(item.tokenBalanceFormatted).isEqualTo(0));

  return isEmpty ? (
    <Box py="120px">
      <EmptyHint title="You don't have any tokens yet" icon={AssetEmpty} />
    </Box>
  ) : (
    <TableContainer overflowX={'auto'}>
      <Table color="#000">
        <Thead>
          <Tr fontFamily={'Nunito'} fontWeight={'400'} fontSize={'18px'}>
            <Th w={'25%'}>Token</Th>
            <Th w={'25%'} textAlign={'left'}>
              Balance
            </Th>
            <Th w={'25%'} textAlign={'center'} />
            <Th w={'25%'} textAlign={'right'}>
              Price(24hr)
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {!tokenBalance.length && <Image src={IconLoading} display={'block'} mt="6" w="50px" h="50px" />}
          {tokenBalance.length
            ? tokenBalance.map((item: ITokenBalanceItem, idx: number) => {
                return (
                  <Tr
                    key={idx}
                    _hover={{
                      '.send-button': {
                        visibility: 'visible',
                      },
                    }}
                  >
                    <Td w={'25%'}>
                      <Flex gap="4" align="center">
                        <Image
                          src={item.logoURI || IconDefaultToken}
                          w={{ base: '16px', lg: '35px' }}
                          h={{ base: '16px', lg: '35px' }}
                        />
                        <Text fontWeight={'800'} fontSize={'18px'}>
                          {item.symbol}
                        </Text>
                      </Flex>
                    </Td>
                    {/* <Td>
                    <Flex align={'center'} justify={'center'} bg="#F2F2F2" rounded="full" w="12" h="12">
                      <Image src={(chainMapping as any)[item.chainID].icon} w="5" h="5" />
                    </Flex>
                  </Td> */}
                    <Td w={'25%'} textAlign={'left'}>
                      <Text mb="1" fontWeight={'800'}>
                        {toFixed(item.tokenBalanceFormatted, 6)}
                      </Text>
                      <Text fontWeight={'400'}>${toFixed(item.usdValue, 2)}</Text>
                    </Td>
                    <Td w={'25%'} textAlign={'center'}>
                      <Box
                        cursor={'pointer'}
                        className="send-button"
                        display={'inline-block'}
                        visibility={{ base: 'visible', lg: 'hidden' }}
                        onClick={() => {
                          showTransfer(item.contractAddress, item.chainID);
                        }}
                      >
                        <Image src={IconSend} w="8" h="8" mb="2px" />
                        <Text fontSize={'12px'} fontWeight={'600'} lineHeight={'15px'}>
                          Send
                        </Text>
                      </Box>
                      {/* <Button
                      transition={'none'}
                      className="send-button"
                      visibility={'hidden'}
                      py="2"
                      px="5"
                      onClick={() => {
                        showTransfer(item.contractAddress, item.chainID);
                      }}
                    >
                      Send
                    </Button> */}
                    </Td>
                    <Td w={'25%'} textAlign={'right'} fontWeight={'800'}>
                      {toFixed(item.tokenPrice, 2)}
                    </Td>
                  </Tr>
                );
              })
            : ''}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
