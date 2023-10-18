import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Box, Flex, Text, Table, Tr, Thead, Tbody, Th, Td, Image } from '@chakra-ui/react';
import AppContainer from '@/components/AppContainer';
import Footer from '@/components/Footer';
import api from '@/lib/api';
import ChainSelectMultiple from '@/components/ChainSelectMultiple';
import { useAddressStore } from '@/store/address';
import { useBalanceStore } from '@/store/balance';
import IconEthSquare from '@/assets/chains/eth-square.svg';
import Button from '@/components/Button';

const tabList = [
  {
    title: 'Tokens',
    key: 'tokens',
  },
  {
    title: 'NFTs',
    key: 'nfts',
  },
];

export const Tabs = ({ activeTab }: any) => {
  return (
    <Flex>
      {tabList.map((item, idx) => {
        return (
          <Text
            key={idx}
            color={activeTab === idx ? 'brand.red' : 'brand.gray'}
            mr="4"
            fontWeight={'800'}
            lineHeight={'1'}
            fontSize={'18px'}
          >
            {item.title}
          </Text>
        );
      })}
    </Flex>
  );
};

const TokensTable = () => {
  const { selectedAddress } = useAddressStore();
  const { tokenBalance } = useBalanceStore();

  const getTokenBalance = async () => {
    const res = await api.balance.token({
      walletAddress: selectedAddress,
    });
    console.log('ressssss', res);
  };

  useEffect(() => {
    getTokenBalance();
  }, []);

  return (
    <Box rounded="20px" bg="#fff" p="8">
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
                  <Button transition={"none"} className="send-button" visibility={'hidden'} py="2" px="5" onClick={() => {}}>
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
    </Box>
  );
};

export default function Asset() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeChains, setActiveChains] = useState([]);

  return (
    <Box color="#000">
      <Header />
      <AppContainer minH="calc(100vh - 100px)">
        <Text fontWeight="800" fontSize="32px" mb="9">
          Asset
        </Text>
        <Tabs activeTab={activeTab} />
        <Flex gap="5" mt="3" alignItems={"flex-start"}>
          <Box w="100%">
            {activeTab === 0 && <TokensTable />}
            {activeTab === 1 && <TokensTable />}
          </Box>
          <ChainSelectMultiple activeChains={activeChains} onChange={setActiveChains} />
        </Flex>
        <Footer />
      </AppContainer>
    </Box>
  );
}
