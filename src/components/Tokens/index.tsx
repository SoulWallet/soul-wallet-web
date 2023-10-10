import { useEffect } from 'react';
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Image,
  BoxProps,
  Grid,
  GridItem,
  Tr,
  Tooltip,
} from '@chakra-ui/react';
import { ITokenBalanceItem, useBalanceStore } from '@/store/balance';
import BN from 'bignumber.js';
import useConfig from '@/hooks/useConfig';
import IconDefaultToken from '@/assets/tokens/default.svg';
import useBrowser from '@/hooks/useBrowser';
import { useAddressStore } from '@/store/address';
import IconChevronRight from '@/assets/icons/chevron-right.svg';
import { numToFixed, truncateString } from '@/lib/tools';

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
        {/* <Flex align={'center'} gap="1">
          <Text fontFamily={'Martian'} fontSize="12px">
            All Networks
          </Text>
          <Image src={IconChevronRight} />
        </Flex> */}
      </Flex>
      <Box
        h="100%"
        overflowY={'auto'}
        bg="rgba(217, 217, 217, 0.32)"
        rounded="20px"
        py="2"
        fontSize={'14px'}
        lineHeight={'1'}
      >
        <Table color="#1e1e1e">
          <Thead>
            <Tr fontWeight={'600'} fontSize={'16px'} color="#1e1e1e">
              <Th></Th>
              <Th>Balance</Th>
              {/* <Th>Value</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {tokenBalance.map((item: ITokenBalanceItem, idx: number) => (
              <Tr key={idx} border={"none"}>
                <Td py="2" display={'flex'} gap="3" alignItems={'center'}>
                  <Image src={item.logoURI || IconDefaultToken} w="38px" h="38px" />
                  <Text fontWeight={'800'} fontSize={'14px'}>
                    {item.name}
                  </Text>
                </Td>
                <Td py="2" fontWeight={'800'} fontSize={'14px'}>
                  <Tooltip label={`${item.tokenBalanceFormatted} ${item.symbol}`}>
                    {`${numToFixed(item.tokenBalanceFormatted, 4)}
                    ${truncateString(item.symbol, 6)}`}
                  </Tooltip>
                </Td>
                {/* <Td color="#898989">US $0</Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table>
        {/* {tokenBalance.map((item: ITokenBalanceItem, idx: number) => (
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
        ))} */}
      </Box>
    </Box>
  );
}
