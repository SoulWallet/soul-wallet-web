import { useEffect, useState } from 'react';
import { Box, Flex, Text, Table, Tr, Thead, Tbody, Th, Td, Image, GridItem, Grid } from '@chakra-ui/react';
import api from '@/lib/api';
import { useAddressStore } from '@/store/address';
import Button from '@/components/Button';
import useWalletContext from '@/context/hooks/useWalletContext';
import IconDefaultToken from '@/assets/tokens/default.svg';
import { useChainStore } from '@/store/chain';
import IconLoading from '@/assets/loading.svg';
import { chainMapping } from '@/config';
import BN from 'bignumber.js';

export default function TokensTable({ activeChains }: any) {
  const { showSend } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const { selectedAddress } = useAddressStore();
  const { setSelectedChainId } = useChainStore();
  const [balanceList, setBalanceList] = useState([]);

  const getTokenBalance = async () => {
    try {
      setLoading(true);
      const res = await api.balance.token({
        walletAddress: selectedAddress,
        chains: activeChains.map((item: any) => ({
          chainID: item,
          reservedTokenAddresses: [],
        })),
      });
      setBalanceList(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeChains || !activeChains.length) {
      return;
    }
    setBalanceList([]);
    getTokenBalance();
  }, [activeChains]);

  const showTransfer = (tokenAddress: string, chainIdHex: string) => {
    // IMPORTANT TODO, change to this chain id
    setSelectedChainId(chainIdHex);
    showSend(tokenAddress);
  };

  return (
    <Table color="#000">
      <Thead>
        <Tr fontFamily={'Nunito'} fontWeight={'400'} fontSize={'18px'}>
          <Th>Token</Th>
          <Th>Network</Th>
          <Th isNumeric>Balance</Th>
          <Th isNumeric>Price(24hr)</Th>
        </Tr>
      </Thead>
      <Tbody>
        {activeChains.length === 0 && (
          <Text fontSize={'20px'} fontWeight={'600'} mt="6">
            Please select a chain
          </Text>
        )}
        {loading && !balanceList.length && activeChains.length && <Image src={IconLoading} display={'block'} mt="6" w="50px" h="50px" />}
        {activeChains.length && balanceList.length
          ? balanceList.map((item: any, idx: number) => {
              return (
                <Tr
                  key={idx}
                  _hover={{
                    '.send-button': {
                      visibility: 'visible',
                    },
                  }}
                >
                  <Td>
                    <Flex align={'center'} gap="4">
                      <Flex gap="4" align="center">
                        <Box pos="relative">
                          <Image src={item.logoURI || IconDefaultToken} w="35px" h="35px" />
                        </Box>
                        <Text fontWeight={'800'} fontSize={'18px'}>
                          {item.symbol}
                        </Text>
                      </Flex>
                      <Button
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
                      </Button>
                    </Flex>
                  </Td>
                  <Td>
                    <Flex align={'center'} justify={'center'} bg="#F2F2F2" rounded="full" w="12" h="12">
                      <Image src={(chainMapping as any)[item.chainID].icon} w="5" h="5" />
                    </Flex>
                  </Td>
                  <Td isNumeric>
                    <Text mb="1" fontWeight={'800'}>
                      {BN(item.tokenBalance).shiftedBy(-item.decimals).toFixed(4)}
                    </Text>
                    <Text fontWeight={'400'}>$120.88</Text>
                  </Td>
                  <Td isNumeric fontWeight={'800'}>
                    0.0000
                  </Td>
                </Tr>
              );
            })
          : ''}
      </Tbody>
    </Table>
  );
}
