import { Box, Flex, Text, useToast, Image, Link } from '@chakra-ui/react';
import HomeCard from '../HomeCard';
import Button from '@/components/Button';
import { ethers } from 'ethers';
import useWalletContext from '@/context/hooks/useWalletContext';
import IconClaim from '@/assets/icons/claim.svg';
import IconShare from '@/assets/icons/share.svg';
import { useCredentialStore } from '@/store/credential';
import useConfig from '@/hooks/useConfig';
import { useAddressStore } from '@/store/address';
import useTools from '@/hooks/useTools';

const Btn = ({ children, ...restProps }: any) => {
  return (
    <Box p="10px" bg="#f2f2f2" cursor={'pointer'} rounded="full" {...restProps}>
      {children}
    </Box>
  );
};

export default function Balance() {
  const { showTransferAssets, showClaimAssets } = useWalletContext();
  const { getWalletName } = useTools();
  const { selectedAddress } = useAddressStore();
  const { chainConfig } = useConfig();
  const { scanUrl } = chainConfig;

  const walletName = getWalletName();

  return (
    <Box w="400px" zIndex={"20"} pt="14px" px="30px" pb="20px" rounded="20px" border="1px solid #EAECF0" bg="brand.white" boxShadow="0px 4px 30px 0px rgba(0, 0, 0, 0.05)">
      {walletName && (
        <Text color="#000" fontSize={'16px'} fontWeight={'600'} mb="4" fontFamily={'Martian'}>
          {walletName}
        </Text>
      )}
      <Text mt={{ base: 4, lg: 'unset' }} fontSize={'48px'} fontWeight={'800'} lineHeight={'1'}>
        $0
      </Text>

      <Flex gap="2" align={'center'} right="4" bottom="3" display={{ base: 'none', lg: 'flex' }}>
        <Btn onClick={showClaimAssets}>
          <Image src={IconClaim} />
        </Btn>
        <Btn as={Link} href={`${scanUrl}/address/${selectedAddress}`} target="_blank">
          <Image src={IconShare} />
        </Btn>
      </Flex>

      <Flex gap="2" mt="6" mb="2" align={'center'}>
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
  );
}
