import { useEffect, useState } from 'react';
import { Box, Flex, Text, Table, Tr, Thead, Tbody, Th, Td, Image, GridItem, Grid } from '@chakra-ui/react';
import api from '@/lib/api';
import { useAddressStore } from '@/store/address';
import Button from '@/components/Button';
import useWalletContext from '@/context/hooks/useWalletContext';
import IconDefaultToken from '@/assets/tokens/default.svg';
import { useChainStore } from '@/store/chain';
import IconLoading from '@/assets/loading.svg';
import BN from 'bignumber.js';

export default function TokensTable() {
  const { showSend } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const { selectedAddress } = useAddressStore();
  const { setSelectedChainId, selectedChainId } = useChainStore();
  const [balanceList, setBalanceList] = useState([]);

  const getTokenBalance = async () => {
    try {
      setLoading(true);
      const res = await api.balance.token({
        walletAddress: selectedAddress,
        chains: [
          {
            chainID: selectedChainId,
            reservedTokenAddresses: [],
          },
        ],
        // chains: activeChains.map((item: any) => ({
        //   chainID: item,
        //   reservedTokenAddresses: [],
        // })),
      });
      setBalanceList(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedChainId) {
      return;
    }
    setBalanceList([]);
    getTokenBalance();
  }, [selectedChainId]);

  const showTransfer = (tokenAddress: string, chainIdHex: string) => {
    // IMPORTANT TODO, change to this chain id
    setSelectedChainId(chainIdHex);
    showSend(tokenAddress);
  };

  return (
    <Table color="#000">
      <Thead>
        <Tr fontFamily={'Nunito'} fontWeight={'400'} fontSize={'18px'}>
          <Th w="25%">Token</Th>
          <Th w="25%" textAlign={'left'}>
            Balance
          </Th>
          <Th w="25%" textAlign={'center'} />
          <Th w="25%" textAlign={'right'}>Price(24hr)</Th>
        </Tr>
      </Thead>
      <Tbody>
        {loading && !balanceList.length && <Image src={IconLoading} display={'block'} mt="6" w="50px" h="50px" />}
        {balanceList.length
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
                  <Td w="25%">
                    <Flex gap="4" align="center">
                      <Box pos="relative">
                        <Image src={item.logoURI || IconDefaultToken} w="35px" h="35px" />
                      </Box>
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
                  <Td w="25%" textAlign={'left'}>
                    <Text mb="1" fontWeight={'800'}>
                      {BN(item.tokenBalance).shiftedBy(-item.decimals).toFixed(4)}
                    </Text>
                    <Text fontWeight={'400'}>$120.88</Text>
                  </Td>
                  <Td w="25%" textAlign={'center'}>
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
                  </Td>
                  <Td w="25%" textAlign={'right'} fontWeight={'800'}>
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
