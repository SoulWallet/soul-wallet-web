import { Box, Flex, Text, useToast, Image } from '@chakra-ui/react';

import IconScan from '@/assets/icons/scan.svg';
import IconScanFaded from '@/assets/icons/scan-faded.svg';
import IconTrendUp from '@/assets/icons/trend-up.svg';
import { useAddressStore } from '@/store/address';
import useConfig from '@/hooks/useConfig';
import ImgNotActived from '@/assets/not-activated.svg';
import { useChainStore } from '@/store/chain';
import Button from '../Button';
import useBrowser from '@/hooks/useBrowser';

export default function AccountCard({
  ...restProps
}) {
  const { navigate } = useBrowser();
  const { selectedAddress, getIsActivated } = useAddressStore();
  const { selectedChainId } = useChainStore();
  const isActivated = getIsActivated(selectedAddress, selectedChainId);

  return (
    <Flex
      flexDir={'column'}
      justify={'space-between'}
      rounded="24px"
      p="10"
      h=""
      bg="#ededed"
      {...restProps}
      // color={isActivated ? '#29510A' : '#1e1e1e'}
      // bg={isActivated ? selectedChainItem.cardBg : selectedChainItem.cardBgUnactivated}
      // boxShadow={'0px 4px 8px 0px rgba(0, 0, 0, 0.12)'}
    >
      <Text fontWeight={'800'} fontSize={'18px'}>
        My Account
      </Text>
      <Flex justify={'space-between'} align="center">
        <Box>
          <Text fontSize={'48px'} fontWeight={'800'} mb="6px" lineHeight={'1'}>
            $0
          </Text>
          {/* {!isActivated && <Image src={ImgNotActived} mt="1" />} */}
          {!isActivated && (
            <Button py="2" onClick={() => navigate('activate')}>
              Activate wallet
            </Button>
          )}
        </Box>
        {/* <Image src={selectedChainItem.iconFaded} /> */}
      </Flex>
    </Flex>
  );
}
