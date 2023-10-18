import { useEffect, useState } from 'react';
import { Box, Flex, Text, Table, Tr, Thead, Tbody, Th, Td, Image, GridItem, Grid } from '@chakra-ui/react';
import api from '@/lib/api';
import { useAddressStore } from '@/store/address';
import { useBalanceStore } from '@/store/balance';
import IconEthSquare from '@/assets/chains/eth-square.svg';
import TransferAssets from '@/components/TransferAssets';
import Button from '@/components/Button';

export default function TokensTable() {
  const { selectedAddress } = useAddressStore();
  const { tokenBalance } = useBalanceStore();
  const [transferVisible, setTransferVisible] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');

  const getTokenBalance = async () => {
    const res = await api.balance.token({
      walletAddress: selectedAddress,
    });
    console.log('ressssss', res);
  };

  useEffect(() => {
    getTokenBalance();
  }, []);

  const showTransfer = (tokenAddress: string) => {
    console.log('t', tokenAddress);
    setTokenAddress(tokenAddress);
    setTransferVisible(true);
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
        {tokenBalance.map((item: any, idx: number) => {
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
                    <Image pos="absolute" right="-4px" bottom="-2px" src={IconEthSquare} w="15px" h="15px" />
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
                    showTransfer(item.contractAddress);
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
      {transferVisible && <TransferAssets tokenAddress={tokenAddress} onClose={() => setTransferVisible(false)} />}
    </Table>
  );
}
