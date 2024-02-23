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
import EmptyHint from '@/components/EmptyHint';
import ActivityEmpty from '@/assets/icons/activity-empty.svg';
import { useChainStore } from '@/store/chain';

const ActivityItem = ({ item }: any) => {
  const { chainConfig } = useConfig();
  const { scanUrl } = chainConfig;
  return (
    <Flex
      // flexDir={{ base: 'column', md: 'row' }}
      // gap={{ base: 3, lg: 0 }}
      justifyContent={'space-between'}
      alignItems={'center'}
      py="5"
    >
      <Link
        w={{ base: '50%', lg: '30%' }}
        display={'flex'}
        alignItems={'center'}
        target="_blank"
        href={`${scanUrl}/tx/${item.trxHash}`}
        gap="2"
      >
        <Box pos={'relative'}>
          <Image src={getIconMapping(item.functionName)} />
        </Box>
        <Box>
          <Flex align={'center'} gap="1">
            <Text textTransform={'capitalize'} fontSize={{ base: '14px', lg: '18px' }} fontWeight={'800'}>
              {item.functionName || 'Unknown'}
            </Text>
            <Image src={IconExternal} />
          </Flex>

          <Text color="#898989">{new Date(item.timestamp * 1000).toLocaleString()}</Text>
        </Box>
      </Link>
      {/* <Flex w="12" h="12" bg="#f2f2f2" rounded={'full'} align={'center'} justify={'center'}>
        <Image src={(chainMapping as any)[item.chainId].icon} />
      </Flex> */}
      {item.actualGasCost ? (
        <Flex gap="2">
          <Image src={IconEth} w={{ base: 4, lg: 8 }} />
          <Box>
            <Text color="brand.black" fontSize={{ base: '14px', lg: '18px' }} fontWeight={'800'}>
              -{numToFixed(BN(item.actualGasCost).shiftedBy(-18).toString(), 6)} ETH
            </Text>
            <Text color="#898989">$141.00</Text>
          </Box>
        </Flex>
      ) : (
        ''
      )}
      <Box display={{ base: 'none', lg: 'block' }}>
        {item.sender && <Text color="brand.black">Sender: {toShortAddress(item.sender)}</Text>}
      </Box>
    </Flex>
  );
};

export default function ActivityTable() {
  const { selectedAddress } = useAddressStore();
  const { ethersProvider } = useWalletContext();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedChainId } = useChainStore();
  const getList = async () => {
    setLoading(true);
    try {
      const res = await fetchHistoryApi(selectedAddress, [selectedChainId], ethersProvider);
      setList(res.data.ops);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedChainId) {
      return;
    }
    setList([]);
    getList();
  }, [selectedChainId]);

  return (
    <Flex flexDir={'column'}>
      {/* {activeChains.length === 0 && (
        <Text fontSize={'20px'} fontWeight={'600'}>
          Please select a chain
        </Text>
      )} */}
      {!list.length && (
        <Flex py="120px" flexDir={'column'} justify={'center'} align={'center'}>
          {loading ? (
            <Image src={IconLoading} display={'block'} w="50px" h="50px" />
          ) : (
            <>
              <EmptyHint title="You don't have any activities yet" icon={ActivityEmpty} />
            </>
          )}
        </Flex>
      )}
      {list.length
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
