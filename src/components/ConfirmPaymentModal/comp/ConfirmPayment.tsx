import React, { useEffect } from 'react'
import { Flex, Box, Text, useToast, Image } from '@chakra-ui/react';
import Button from '../../Button';
import BN from 'bignumber.js';
import { toShortAddress } from '@/lib/tools';
import useConfig from '@/hooks/useConfig';
import { useBalanceStore } from '@/store/balance';
import { useAddressStore } from '@/store/address';
import ChainSelect from '@/components/ChainSelect';
import { AccountSelect } from '@/components/AccountSelect';
import IconEth from '@/assets/chains/eth.svg';
import api from '@/lib/api';

export default function ConfirmPayment({ onSuccess, fee }: any) {
  const toast = useToast();
  const { tokenBalance } = useBalanceStore();
  const { chainConfig, selectedAddressItem } = useConfig();
  const { selectedAddress } = useAddressStore();

  const onConfirm = async () => {
    try {
      onSuccess(true);
    } catch (err) {
      console.log('sign page failed', err);
    } finally {

    }
  };

  useEffect(() => {
    const getTokenBalance = async () => {
      const res = await api.balance.token({
        walletAddress: selectedAddress,
        chains: [
          {
            chainID: '',
            reservedTokenAddresses: [],
          },
        ],
      });
      console.log('ressssss', res);
    };

    getTokenBalance();
  }, []);

  console.log('ConfirmPayment', chainConfig, selectedAddressItem)
  return (
    <>
      <Flex flexDir={'column'} gap="5" mt="6">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Box fontSize="12px" fontWeight="600" fontFamily="Martian">Estimated fee</Box>
          <Box fontSize="32px" fontWeight="800" fontFamily="Nunito" textAlign="center">{BN(fee).shiftedBy(-18).toString()} ETH</Box>
        </Box>
        <Box width="100%" display="flex" alignItems="center" justifyContent="center">
          <Box bg="#f2f2f2" width="320px" borderRadius="36px" height="36px" display="flex" alignItems="center" justifyContent="center">
            <Image src={IconEth} w="5" h="5" />
            <Text fontSize="16px" fontWeight="800" marginLeft="5px">ETH</Text>
            {tokenBalance && tokenBalance[0] && <Text fontSize="12px" fontWeight="600" marginLeft="5px">Available {tokenBalance[0].tokenBalanceFormatted}</Text>}
          </Box>
        </Box>
        <Box width="100%" height="1px" background="#D7D7D7" />
        <Box padding="0 10px">
          <Box padding="5px 0" display="flex" alignItems="center" justifyContent="space-between">
            <Box fontSize="12px" fontWeight="500" fontFamily="Martian">From:</Box>
            <Box fontSize="12px" fontWeight="400" fontFamily="Martian" color="#6A52EF">
              <AccountSelect isInModal={true} />
            </Box>
          </Box>
          <Box padding="5px 0" display="flex" alignItems="center" justifyContent="space-between">
            <Box fontSize="12px" fontWeight="500" fontFamily="Martian">Network:</Box>
            <Box fontSize="12px" fontWeight="400" fontFamily="Martian" color="#6A52EF">
              <ChainSelect isInModal={true} />
            </Box>
          </Box>
        </Box>
      </Flex>
      <Button
        w="100%"
        fontSize={'20px'}
        py="4"
        fontWeight={'800'}
        mt="6"
        onClick={onConfirm}
        bg="#6A52EF"
        color="white"
        _hover={{ bg: '#6A52EF', color: 'white' }}
      >
        Preview Payment
      </Button>
    </>
  );
}
