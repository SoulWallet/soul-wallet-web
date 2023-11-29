import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Divider, Image, Link } from '@chakra-ui/react';
import BN from 'bignumber.js';
import { numToFixed } from '@/lib/tools';
import { toShortAddress, getIconMapping } from '@/lib/tools';
import { IActivityItem } from '@/pages/wallet/comp/Activity/comp/ActivityItem';
import { fetchHistoryApi } from '@/store/history';
import { useAddressStore } from '@/store/address';
import IconLoading from '@/assets/loading.svg';
import { getChainIcon } from '@/lib/tools';
import useWalletContext from '@/context/hooks/useWalletContext';
import useConfig from '@/hooks/useConfig';

const ActivityItem = ({ item }: any) => {
  const { chainConfig } = useConfig();
  const { scanUrl } = chainConfig;
  return (
    <Link
      display={'flex'}
      href={`${scanUrl}/tx/${item.trxHash}`}
      target="_blank"
      justifyContent={'space-between'}
      alignItems={'center'}
      py="4"
    >
      <Flex flex="2" align={'center'} gap="2">
        <Box pos={'relative'}>
          <Image src={getIconMapping(item.functionName)} />
          <Image pos="absolute" right="-4px" bottom="-2px" src={getChainIcon(item.chainId)} w="15px" h="15px" />
        </Box>
        <Text textTransform={'capitalize'} fontSize={'18px'} fontWeight={'800'}>
          {item.functionName || 'Unknown'}
        </Text>
      </Flex>
      <Flex flex="1">
        {item.actualGasCost ? `${numToFixed(BN(item.actualGasCost).shiftedBy(-18).toString(), 6)} ETH` : ''}
      </Flex>
      <Flex flex="1">
        <Text>{item && item.to ? `To ${toShortAddress(item.to || '')} ` : ''}</Text>
      </Flex>
    </Link>
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
        <>
          {loading ? <Image src={IconLoading} display={'block'} w="50px" h="50px" /> : <Text>No Activity</Text>}
        </>
      )}
      {activeChains.length && list.length
        ? list.map((item: IActivityItem, idx) => (
            <React.Fragment key={idx}>
              <Divider />
              <ActivityItem key={idx} item={item} />
            </React.Fragment>
          ))
        : ''}
    </Flex>
  );
}
