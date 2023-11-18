import { useEffect, useState } from 'react';
import { Box, Flex, Text, Table, Tr, Thead, Tbody, Th, Td, Image, GridItem, Grid } from '@chakra-ui/react';
import api from '@/lib/api';
import { useAddressStore } from '@/store/address';
import IconEthSquare from '@/assets/chains/eth-square.svg';
import IconOpSquare from '@/assets/chains/op-square.svg';
import IconArbSquare from '@/assets/chains/arb-square.svg';
import Button from '@/components/Button';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useChainStore } from '@/store/chain';

const getChainIcon = (chainIdHex: string) => {
  switch (chainIdHex) {
    case '0x5':
      return IconEthSquare;
    case '0x66eed':
      return IconArbSquare;
    case '0x1a4':
      return IconOpSquare;
    default:
      return '';
  }
};

export default function TokensTable({ activeChains }: any) {
  const { showTransferAssets } = useWalletContext();
  const { selectedAddress } = useAddressStore();
  const { setSelectedChainId } = useChainStore();
  const [balanceList, setBalanceList] = useState([]);

  const getTokenBalance = async () => {
    const res = await api.balance.token({
      walletAddress: selectedAddress,
      chains: activeChains.map((item: any) => ({
        chainID: item,
        reservedTokenAddresses: [],
      })),
    });

    setBalanceList(res.data);
  };

  useEffect(() => {
    if (!activeChains || !activeChains.length) {
      return;
    }
    getTokenBalance();
  }, [activeChains]);

  const showTransfer = (tokenAddress: string, chainIdHex: string) => {
    // IMPORTANT TODO, change to this chain id
    setSelectedChainId(chainIdHex);
    showTransferAssets(tokenAddress);
  };

  return (
    <Table color="#000">
      <Thead>
        <Tr fontWeight={'600'}>
          <Th>Token · Network</Th>
          <Th isNumeric>Price</Th>
          <Th isNumeric>Balance</Th>
          <Th isNumeric>USD Value</Th>
        </Tr>
      </Thead>
      <Tbody>
        {balanceList.map((item: any, idx: number) => {
          return (
            <Tr
              key={idx}
              fontWeight={'700'}
              _hover={{
                '.send-button': {
                  visibility: 'visible',
                },
              }}
            >
              <Td as={Flex} align="center" justify={'space-between'}>
                <Flex gap="4" align="center">
                  <Box pos="relative">
                    <Image src={item.logoURI} w="35px" h="35px" />
                    <Image
                      pos="absolute"
                      right="-4px"
                      bottom="-2px"
                      src={getChainIcon(item.chainID)}
                      w="15px"
                      h="15px"
                    />
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
              </Td>
              <Td isNumeric>0.0000</Td>
              <Td isNumeric>{item.tokenBalanceFormatted}</Td>
              <Td isNumeric>0.0000</Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}
