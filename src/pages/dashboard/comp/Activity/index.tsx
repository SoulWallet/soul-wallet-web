import ActivityItem from './comp/ActivityItem';
import { Text, Box, Link, Flex } from '@chakra-ui/react';
import useConfig from '@/hooks/useConfig';
import { useHistoryStore } from '@/store/history';
import Button from '@/components/Button';
import { Link as RLink } from 'react-router-dom';

export default function Activity() {
  const { chainConfig } = useConfig();
  const { historyList } = useHistoryStore();

  if (!historyList.length) {
    return;
  }

  return (
    <Box mt="40px" w="380px">
      <Text fontWeight="800" fontSize={'18px'} lineHeight={'1.25'} mb="22px">
        Recent Transactions
      </Text>
      <Flex gap="5" flexDir={"column"}>
        {historyList.slice(0, 3).map((item: any, idx: number) => (
          <ActivityItem key={idx} idx={idx} item={item} scanUrl={chainConfig.scanUrl} />
        ))}
      </Flex>

      {historyList.length > 3 && (
        <Link as={RLink} to="/activity">
          <Button
            py="2"
            px="14px"
            fontSize={'14px'}
            fontWeight={'600'}
            color="rgba(0, 0, 0, 0.60)"
            type="white"
            border="none"
            display={'block'}
            mt="14px"
            mx="auto"
          >
            View More
          </Button>
        </Link>
      )}
    </Box>
  );
}
