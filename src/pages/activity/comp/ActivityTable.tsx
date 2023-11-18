import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Divider, Image } from '@chakra-ui/react';
import { useHistoryStore } from '@/store/history';
import BN from 'bignumber.js';
import { numToFixed } from '@/lib/tools';
import { toShortAddress, getIconMapping } from '@/lib/tools';
import { IActivityItem } from '@/pages/wallet/comp/Activity/comp/ActivityItem';
import { fetchHistoryApi } from '@/store/history';
import { useAddressStore } from '@/store/address';
import useWalletContext from '@/context/hooks/useWalletContext';

const ActivityItem = ({ item }: any) => {
  return (
    <Flex justify={'space-between'} align={'center'} py="4">
      <Flex flex="2" align={'center'} gap="2">
        <Image src={getIconMapping(item.functionName)} />
        <Text textTransform={'capitalize'} fontSize={'18px'} fontWeight={'800'}>
          {item.functionName}
        </Text>
      </Flex>
      <Flex flex="1">
        {item.actualGasCost ? `${numToFixed(BN(item.actualGasCost).shiftedBy(-18).toString(), 6)} ETH` : ''}
      </Flex>
      <Flex flex="1">
        <Text>{item && item.to ? `To ${toShortAddress(item.to || '')} ` : ''}</Text>
      </Flex>
    </Flex>
  );
};

export default function ActivityTable({ activeChains }: any) {
  const { selectedAddress } = useAddressStore();
  const { ethersProvider } = useWalletContext();
  const [list, setList] = useState([]);
  const getList = async () => {
    const res = await fetchHistoryApi(selectedAddress, activeChains, ethersProvider);
    setList(res.data.ops);
  };

  useEffect(() => {
    if (!activeChains || !activeChains.length) {
      return;
    }
    getList();
  }, [activeChains]);

  return (
    <Flex flexDir={'column'}>
      {list.map((item: IActivityItem, idx) => (
        <React.Fragment key={idx}>
          <Divider />
          <ActivityItem key={idx} item={item} />
        </React.Fragment>
      ))}
    </Flex>
  );
}
