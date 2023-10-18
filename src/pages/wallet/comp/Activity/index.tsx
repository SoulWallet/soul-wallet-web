import { useEffect, useState } from 'react';
import ActivityItem from './comp/ActivityItem';
import { Image } from '@chakra-ui/react';
import scanApi from '@/lib/scanApi';
import { useAddressStore } from '@/store/address';
import EmptyHint from '@/components/EmptyHint';
import useConfig from '@/hooks/useConfig';
import { useChainStore } from '@/store/chain';
import { useHistoryStore } from '@/store/history';
import HomeCard from '../HomeCard';
import IconLoading from '@/assets/loading.gif';
import { ExternalLink } from '../HomeCard';

export default function Activity() {
  const { selectedAddress } = useAddressStore();
  const { selectedChainId } = useChainStore();
  const [loading, setLoading] = useState(false);
  // IMPORTANT TODO: MOVE history list to store
  // const [historyList, setHistoryList] = useState<any>([]);
  const { chainConfig } = useConfig();
  const { historyList, fetchHistory } = useHistoryStore();

  useEffect(() => {
    if (!selectedAddress || !selectedChainId) {
      return;
    }

    const interval = setInterval(() => {
      fetchHistory(selectedAddress, [selectedChainId]);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedAddress, selectedChainId]);

  return (
    <HomeCard title={'Activity'} external={<ExternalLink title="View all" to="/activity" />} contentHeight="290px">
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
