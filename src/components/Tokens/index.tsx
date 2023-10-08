import { useEffect } from 'react';
import { Box, Flex, Table, Tbody, Td, Text, Th, Thead, Image, BoxProps } from '@chakra-ui/react';
import { ITokenBalanceItem, useBalanceStore } from '@/store/balance';
import ListItem from '@/components/ListItem';
import useConfig from '@/hooks/useConfig';
import IconDefaultToken from '@/assets/tokens/default.svg';
import useBrowser from '@/hooks/useBrowser';
import { useAddressStore } from '@/store/address';
import IconChevronRight from '@/assets/icons/chevron-right.svg';

const BalanceItem = () => {
  return <Box></Box>;
};

export default function Tokens({ ...restProps }: BoxProps) {
  const { selectedAddress } = useAddressStore();
  const { tokenBalance, fetchTokenBalance } = useBalanceStore();
  const { selectedChainItem } = useConfig();
  const { navigate } = useBrowser();

  useEffect(() => {
    const { chainIdHex, paymasterTokens } = selectedChainItem;

    if (!selectedAddress) {
      return;
    }
    fetchTokenBalance(selectedAddress, chainIdHex, paymasterTokens);
  }, [selectedAddress, selectedChainItem]);

  return (
    <Box {...restProps}>
      <Flex align={'center'} px="2" justify={'space-between'} mb="6px">
        <Text fontSize={'18px'} fontWeight={'800'}>
          Tokens
        </Text>
        <Flex align={'center'} gap="1">
          <Text fontFamily={'Martian'} fontSize="12px">
            All Networks
          </Text>
          <Image src={IconChevronRight} />
        </Flex>
      </Flex>
      <Box
        h="100%"
        overflowY={'auto'}
        bg="rgba(217, 217, 217, 0.32)"
        rounded="20px"
        p="6"
        fontSize={'14px'}
        lineHeight={'1'}
      >
        {/* <Table>
          <Thead>
            <Th>
              <Td></Td>
              <Td>Balance</Td>
              <Td>Value</Td>
            </Th>
          </Thead>
          <Tbody></Tbody>
        </Table> */}
        {tokenBalance.map((item: ITokenBalanceItem, idx: number) => (
          <ListItem
            key={idx}
            idx={idx}
            icon={item.logoURI || IconDefaultToken}
            title={item.name || 'Unknown'}
            titleDesc={'Token'}
            amount={item.tokenBalanceFormatted}
            amountDesc={item.symbol}
            onClick={() => navigate(`send/${item.contractAddress}`)}
          />
        ))}
      </Box>
    </Box>
  );
}
