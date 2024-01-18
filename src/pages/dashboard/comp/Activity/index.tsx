import React, { useEffect, useState } from 'react';
import ActivityItem from './comp/ActivityItem';
import { Image, Divider, Text, Box } from '@chakra-ui/react';
import useConfig from '@/hooks/useConfig';
import { useHistoryStore } from '@/store/history';
import Button from '@/components/Button';

export default function Activity() {
  const [loading, setLoading] = useState(false);
  // IMPORTANT TODO: MOVE history list to store
  // const [historyList, setHistoryList] = useState<any>([]);
  const { chainConfig } = useConfig();
  const { historyList } = useHistoryStore();

  if (!historyList.length) {
    return;
  }

  return (
    <Box mt="40px">
      <Text fontWeight="800" fontSize={'18px'} lineHeight={'1.25'} mb="22px">
        Recent Transactions
      </Text>
      {historyList.map((item: any, idx: number) => (
        <React.Fragment key={idx}>
          <ActivityItem key={idx} idx={idx} item={item} scanUrl={chainConfig.scanUrl} />
        </React.Fragment>
      ))}

      <Button type="white" border="none" mt="14px">
        View More
      </Button>
    </Box>
  );
}
