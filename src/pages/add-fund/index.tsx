import { useEffect, useState } from 'react';
import useWalletContext from '@/context/hooks/useWalletContext';
import Header from '@/components/Header';
import { Box, Text, Flex, useToast, Tooltip } from '@chakra-ui/react';
import { InfoWrap, InfoItem } from '@/components/SignModal';
import { Image } from '@chakra-ui/react';
import IconEth from '@/assets/chains/eth.svg';
import { copyText } from '@/lib/tools';
import ReceiveCode from '@/components/ReceiveCode';
import Button from '@/components/Button';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';

export default function AddFund() {
  const toast = useToast();
  const { selectedAddress } = useAddressStore();
  const { chainList } = useChainStore();

  const doCopy = () => {
    copyText(selectedAddress);
    toast({
      title: 'Copied',
      status: 'success',
    });
  };

  return (
    <Box px="5" pt="6">
      <Header />
      <Box bg="#fff" rounded="20px" p="4" mb="14px">
        <ReceiveCode address={selectedAddress} imgWidth="170px" showFullAddress={true} />
      </Box>

      <InfoWrap gap="3">
        <InfoItem>
          <Text>Supported Networks:</Text>
          <Flex align="center" gap="2px">
            {chainList.map((item, index) => (
              <Tooltip label={item.chainName}>
                <Image key={index} src={item.icon} w="20px" />
              </Tooltip>
            ))}
          </Flex>
        </InfoItem>
      </InfoWrap>

      <Button w="full" onClick={doCopy} fontSize="20px" py="4" fontWeight={'800'} mt="14px">
        Copy address
      </Button>
    </Box>
  );
}
