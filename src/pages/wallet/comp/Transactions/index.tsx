import { useEffect, useState } from 'react';
import ActivityItem from './comp/ActivityItem';
import { Image } from '@chakra-ui/react';
import scanApi from '@/lib/scanApi';
import { useAddressStore } from '@/store/address';
import EmptyHint from '@/components/EmptyHint';
import useConfig from '@/hooks/useConfig';
import { useChainStore } from '@/store/chain';
import HomeCard from '../HomeCard';
import IconLoading from '@/assets/loading.gif';
import { ExternalLink } from '../HomeCard';

export default function Transactions() {
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
    <HomeCard
      title={'Activity'}
      external={<ExternalLink title="View all activities" to="/activity" />}
      contentHeight="290px"
    >
      {!historyList ||
        (historyList.length === 0 && (
          <>
            {loading ? (
              <Image
                src={IconLoading}
                m="auto"
                w="12"
                h="12"
                pos="absolute"
                top={'0'}
                bottom={'0'}
                left="0"
                right="0"
              />
            ) : (
              <EmptyHint title="No activities" />
            )}
          </>
        ))}

      {historyList.map((item: any, idx: number) => (
        <ActivityItem key={idx} idx={idx} item={item} scanUrl={chainConfig.scanUrl} />
      ))}
    </HomeCard>
  );
}
