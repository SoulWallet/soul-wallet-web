import { useEffect, useState } from 'react';
import ActivityItem from './comp/ActivityItem';
import { Box } from '@chakra-ui/react';
import IconLoading from '@/assets/activity-loading.gif';
import { Image } from '@chakra-ui/react';
import scanApi from '@/lib/scanApi';
import { useAddressStore } from '@/store/address';
import EmptyHint from '../EmptyHint';
import useConfig from '@/hooks/useConfig';
import { useChainStore } from '@/store/chain';

export default function Activities() {
  const { selectedAddress } = useAddressStore();
  const { selectedChainId } = useChainStore();
  const [loading, setLoading] = useState(false);
  // IMPORTANT TODO: MOVE history list to store
  const [historyList, setHistoryList] = useState<any>([]);
  const { chainConfig } = useConfig();

  const getHistory = async () => {
    setLoading(true);
    const res = await scanApi.op.list(selectedAddress, selectedChainId);
    setLoading(false);
    setHistoryList(res.data.ops);
  };

  useEffect(() => {
    getHistory();
  }, [selectedAddress, selectedChainId]);

  return (
    <Box color="#1e1e1e" fontSize={'14px'} lineHeight={'1'}>
      {!loading && (!historyList || historyList.length === 0) && <EmptyHint title="No activities" />}
      {loading && <Image src={IconLoading} w="100%" />}
      {historyList.map((item: any, idx: number) => (
        <ActivityItem key={idx} idx={idx} item={item} scanUrl={chainConfig.scanUrl} />
      ))}
    </Box>
  );
}
