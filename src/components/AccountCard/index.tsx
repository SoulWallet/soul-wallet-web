import { Box, Flex, Text, useToast, Image } from '@chakra-ui/react';

import IconScan from '@/assets/icons/scan.svg';
import IconScanFaded from '@/assets/icons/scan-faded.svg';
import IconTrendUp from '@/assets/icons/trend-up.svg';
import { useAddressStore } from '@/store/address';
import useConfig from '@/hooks/useConfig';
import ImgNotActived from '@/assets/not-activated.svg';
import { useChainStore } from '@/store/chain';

export default function AccountCard() {
  const { selectedAddress, getIsActivated } = useAddressStore();
  const { selectedChainId } = useChainStore();
  const { selectedChainItem } = useConfig();
  const isActivated = getIsActivated(selectedAddress, selectedChainId);


  return (
    <Flex
      gap="50px"
      flexDir={'column'}
      rounded="24px"
      py="16px"
      color={isActivated ? '#29510A' : '#1e1e1e'}
      px="24px"
      bg={isActivated ? selectedChainItem.cardBg : selectedChainItem.cardBgUnactivated}
      boxShadow={'0px 4px 8px 0px rgba(0, 0, 0, 0.12)'}
    >
      <Flex align={'center'} justify={'space-between'}>
        <Image src={isActivated ? IconScan : IconScanFaded} w="28px" h="28px" />
      </Flex>
      <Flex justify={'space-between'} align="center">
        <Box>
          <Text fontSize={'26px'} fontWeight={'800'} mb="6px" lineHeight={'1'}>
            $0
          </Text>
          {isActivated ? (
            <Flex gap="1" align="center">
              <Image src={IconTrendUp} w="12px" h={'12px'} />
              <Text color="#848488" fontSize="12px" fontWeight={'600'}>
                $123.45
              </Text>
            </Flex>
          ) : (
            <Image src={ImgNotActived} mt="1" />
          )}
        </Box>
        <Image src={selectedChainItem.iconFaded} />
      </Flex>
    </Flex>
  );
}
