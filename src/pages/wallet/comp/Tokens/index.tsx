import { useEffect } from 'react';
import { BoxProps, Flex, Image, Text } from '@chakra-ui/react';
import { ExternalLink } from '../HomeCard';
import ListItem from '@/components/ListItem';
import { ITokenBalanceItem, useBalanceStore } from '@/store/balance';
import useConfig from '@/hooks/useConfig';
import IconDefaultToken from '@/assets/tokens/default.svg';
import useBrowser from '@/hooks/useBrowser';
import { useAddressStore } from '@/store/address';
import { numToFixed, truncateString } from '@/lib/tools';
import HomeCard from '../HomeCard';

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
    <HomeCard
      title={'Tokens'}
      external={
       <ExternalLink title="View all tokens" to="/tokens" />
      }
      contentHeight="290px"
    >
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
      {/* <Table color="#1e1e1e">
          <Thead>
            <Tr fontWeight={'600'} fontSize={'16px'} color="#1e1e1e">
              <Th></Th>
              <Th>Balance</Th>
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
              </Tr>
            ))}
          </Tbody>
        </Table> */}
    </HomeCard>
  );
}
