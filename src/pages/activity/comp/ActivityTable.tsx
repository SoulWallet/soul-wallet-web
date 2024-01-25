import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Divider, Image, Link } from '@chakra-ui/react';
import BN from 'bignumber.js';
import { numToFixed } from '@/lib/tools';
import { toShortAddress, getIconMapping } from '@/lib/tools';
import { IActivityItem } from '@/pages/dashboard/comp/Activity/comp/ActivityItem';
import { fetchHistoryApi } from '@/store/history';
import { useAddressStore } from '@/store/address';
import IconLoading from '@/assets/loading.svg';
import useWalletContext from '@/context/hooks/useWalletContext';
import useConfig from '@/hooks/useConfig';
import { chainMapping } from '@/config';
import IconExternal from '@/assets/icons/external.svg';
import IconEth from '@/assets/tokens/eth.svg';

const ActivityItem = ({ item }: any) => {
  const { chainConfig } = useConfig();
  const { scanUrl } = chainConfig;
  return (
    <Flex justifyContent={'space-between'} alignItems={'center'} py="5">
      <Link display={'flex'} alignItems={'center'} target="_blank" href={`${scanUrl}/tx/${item.trxHash}`} gap="2">
        <Box pos={'relative'}>
          <Image src={getIconMapping(item.functionName)} />
        </Box>
        <Box>
          <Flex align={'center'} gap="1">
            <Text textTransform={'capitalize'} fontSize={'16px'} fontWeight={'800'}>
              {item.functionName || 'Unknown'}
            </Text>
            <Image src={IconExternal} />
          </Flex>

          <Text color="#898989">{new Date(item.timestamp * 1000).toLocaleString()}</Text>
        </Box>
      </Link>
      <Flex w="12" h="12" bg="#f2f2f2" rounded={'full'} align={'center'} justify={'center'}>
        <Image src={(chainMapping as any)[item.chainId].icon} />
      </Flex>
      {item.actualGasCost ? (
        <Flex gap="2">
          <Image src={IconEth} w="8" />
          <Box>
            <Text color="brand.black" fontWeight={'800'}>
              -{numToFixed(BN(item.actualGasCost).shiftedBy(-18).toString(), 6)} ETH
            </Text>
            <Text color="#898989">$141.00</Text>
          </Box>
        </Flex>
      ) : (
        ''
      )}
      <Box>{item.sender && <Text color="brand.black">Sender: {toShortAddress(item.sender)}</Text>}</Box>
    </Flex>
  );
};

export default function ActivityTable({ activeChains }: any) {
  const { selectedAddress } = useAddressStore();
  const { ethersProvider } = useWalletContext();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const getList = async () => {
    setLoading(true);
    try {
      const res = await fetchHistoryApi(selectedAddress, activeChains, ethersProvider);
      setList(res.data.ops);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeChains || !activeChains.length) {
      return;
    }
    setList([]);
    getList();
  }, [activeChains]);

  return (
    <Flex flexDir={'column'}>
      {activeChains.length === 0 && (
        <Text fontSize={'20px'} fontWeight={'600'}>
          Please select a chain
        </Text>
      )}
      {!list.length && (
        <Flex py="120px" flexDir={'column'} justify={'center'} align={'center'}>
          {loading ? (
            <Image src={IconLoading} display={'block'} w="50px" h="50px" />
          ) : (
            <>
              <Box mb="2" rounded="full" w="12" h="12" bg="#D9D9D9" opacity={0.23} />
              <Text color="#7F7F7F" fontWeight={'500'} fontSize={'12px'}>
                You don't have any activities yet
              </Text>
            </>
          )}
        </Flex>
      )}
      {activeChains.length && list.length
        ? list.map((item: IActivityItem, idx) => (
            <React.Fragment key={idx}>
              {idx ? <Divider /> : ''}
              <ActivityItem key={idx} item={item} />
            </React.Fragment>
          ))
        : ''}
    </Flex>
  );
}
