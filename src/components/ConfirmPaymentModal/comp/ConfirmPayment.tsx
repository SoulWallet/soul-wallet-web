import React, { useEffect } from 'react';
import { Flex, Box, Text, useToast, Image } from '@chakra-ui/react';
import Button from '../../Button';
import BN from 'bignumber.js';
import useConfig from '@/hooks/useConfig';
import { useBalanceStore } from '@/store/balance';
import { useAddressStore } from '@/store/address';
import ChainSelect from '@/components/ChainSelect';
import IconExclamation from '@/assets/icons/exclamation.svg';
import { InfoWrap, InfoItem } from '@/components/SignTransactionModal';
import { LabelItem } from '@/components/SignTransactionModal/comp/SignTransaction';
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

  const hasBalance =
    tokenBalance &&
    tokenBalance[0] &&
    !!Number(tokenBalance[0].tokenBalance) &&
    BN(tokenBalance[0].tokenBalance).gt(BN(fee));

  console.log(
    'ConfirmPayment',
    chainConfig,
    selectedAddressItem,
    hasBalance,
    BN(tokenBalance[0].tokenBalance).gt(BN(fee)),
  );
  return (
    <>
      <Flex flexDir={'column'} gap="5" mt="4">
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Box fontSize="20px" fontWeight="800">
            Estimated fee
          </Box>
          <Box
            fontSize={{ base: '20px', md: '24px', lg: '48px' }}
            fontWeight="700"
            fontFamily="Nunito"
            textAlign="center"
          >
            {BN(fee).shiftedBy(-18).toFixed(6)} ETH
          </Box>
        </Box>
        <Box width="100%" display="flex" alignItems="center" justifyContent="center">
          <Box
            bg="#f2f2f2"
            width="320px"
            borderRadius="36px"
            height="36px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image src={IconEth} w="5" h="5" />
            <Text fontSize="16px" fontWeight="800" marginLeft="5px">
              ETH
            </Text>
            {tokenBalance && tokenBalance[0] && (
              <Text fontSize="12px" fontWeight="600" marginLeft="5px">
                Available {tokenBalance[0].tokenBalanceFormatted}
              </Text>
            )}
          </Box>
        </Box>
        {!hasBalance && (
          <Flex
            py="6px"
            px="8px"
            align={'center'}
            gap="2"
            bg="#FEF3F2"
            rounded="full"
            display={'inline-flex'}
            mx="auto"
          >
            <Image src={IconExclamation} w="4" h="4" />
            <Text fontSize="14px" fontWeight="600" color="#E83D26">
              Insufficient balance
            </Text>
          </Flex>
        )}
        <InfoWrap w="400px" mx="auto" fontSize="14px">
          <InfoItem>
            <LabelItem label="Network" tooltip={`Select any network with enough funds to cover the guardian editing fee.`} />
            <Flex gap="2" fontWeight={'500'}>
              <ChainSelect isInModal={true} />
            </Flex>
          </InfoItem>
        </InfoWrap>
      </Flex>
      <Button
        fontSize={'20px'}
        py="4"
        fontWeight={'800'}
        mt="6"
        w="320px"
        mx="auto"
        display={'block'}
        onClick={onConfirm}
        disabled={!hasBalance}
        type="black"
      >
        Preview
      </Button>
    </>
  );
}
