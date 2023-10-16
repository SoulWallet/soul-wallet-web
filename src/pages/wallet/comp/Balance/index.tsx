import { Box, Flex, Text, useToast, Image } from '@chakra-ui/react';

import IconScan from '@/assets/icons/scan.svg';
import IconScanFaded from '@/assets/icons/scan-faded.svg';
import IconTrendUp from '@/assets/icons/trend-up.svg';
import { useAddressStore } from '@/store/address';
import useConfig from '@/hooks/useConfig';
import ImgNotActived from '@/assets/not-activated.svg';
import { useChainStore } from '@/store/chain';
import HomeCard from '../HomeCard';
import useBrowser from '@/hooks/useBrowser';

export default function Balance({ ...restProps }) {
  const { navigate } = useBrowser();
  const { selectedAddress, getIsActivated } = useAddressStore();
  const { selectedChainId } = useChainStore();
  const isActivated = getIsActivated(selectedAddress, selectedChainId);

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
