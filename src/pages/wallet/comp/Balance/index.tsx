import { Box, Flex, Text, useToast, Image } from '@chakra-ui/react';
import HomeCard from '../HomeCard';
import Button from '@/components/Button';
import { ethers } from 'ethers';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useCredentialStore } from '@/store/credential';
export default function Balance() {
  const { showTransferAssets } = useWalletContext();
  const { walletName } = useCredentialStore();
  return (
    <HomeCard
      title={'Balance'}
      titleProps={{ display: { base: 'none', lg: 'block' } }}
      external={<></>}
      mt={{ base: '10px', lg: 'unset' }}
      px="8"
      overflow="none"
      contentHeight="160px"
    >
      <Box p="4">
        {walletName && (
          <Text color="#000" fontSize={'16px'} fontWeight={'600'} mb="4" fontFamily={'Martian'}>
            {walletName}
          </Text>
        )}
        <Text mt={{ base: 4, lg: 'unset' }} fontSize={'48px'} fontWeight={'800'} lineHeight={'1'}>
          $0
        </Text>
        {/* <Flex fontSize={'16px'} gap="1">
        <Text color="#10c003" fontWeight={'700'}>
          + $0 (0%)
        </Text>
        <Text fontWeight={'600'}>Past day</Text>
      </Flex> */}
        <Flex gap="2" mt="6" mb="2" align={'center'} display={{ base: 'flex', lg: 'none' }}>
          <Button
            flex="1"
            py="3"
            onClick={() => {
              showTransferAssets(ethers.ZeroAddress, 'receive');
            }}
          >
            Receive
          </Button>
          <Button
            flex="1"
            py="3"
            onClick={() => {
              showTransferAssets(ethers.ZeroAddress, 'send');
            }}
          >
            Send
          </Button>
        </Flex>
      </Box>
    </HomeCard>
  );
}
