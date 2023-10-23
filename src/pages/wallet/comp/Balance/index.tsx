import { Box, Flex, Text, useToast, Image } from '@chakra-ui/react';
import HomeCard from '../HomeCard';
export default function Balance() {
  return (
    <HomeCard title={'Balance'} external={<></>} contentHeight="290px">
      <Text fontSize={'48px'} fontWeight={'800'} mb="3" lineHeight={'1'}>
        $0
      </Text>
      <Flex fontSize={'16px'} gap="1">
        <Text color="#10c003" fontWeight={'700'}>
          + $8.88 (0.8%)
        </Text>
        <Text fontWeight={'600'}>Past day</Text>
      </Flex>
    </HomeCard>
  );
}
