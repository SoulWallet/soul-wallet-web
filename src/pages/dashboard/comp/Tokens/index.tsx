import React, { useState } from 'react';
import { ExternalLink } from '../HomeCard';
import ListItem from '@/components/ListItem';
import { Divider, Text, Box, Flex } from '@chakra-ui/react';
import { ITokenBalanceItem, useBalanceStore } from '@/store/balance';
import HomeCard from '../HomeCard';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useSlotStore } from '@/store/slot';
import Button from '@/components/Button';
import { Link } from 'react-router-dom';
import useWallet from '@/hooks/useWallet';
import { useTempStore } from '@/store/temp';
import { ethers } from 'ethers';
import config from '@/config';
import { defaultGuardianSafePeriod } from '@/config';
import useKeystore from '@/hooks/useKeystore';
import ReceiveCode from '@/components/ReceiveCode';

const SetGuardianHint = () => {
  const { createWallet } = useWallet();
  const { updateCreateInfo } = useTempStore();
  const { calcGuardianHash } = useKeystore();
  const skipSetupGuardian = async () => {
    // generate wallet address

    const initialGuardianHash = calcGuardianHash([], 0);

    console.log('1111', initialGuardianHash, ethers.ZeroHash);
    updateCreateInfo({
      initialGuardianHash: ethers.ZeroHash,
      initialGuardianSafePeriod: defaultGuardianSafePeriod,
    });

    await createWallet();
  };
  return (
    <Flex
      align={'center'}
      justify={'center'}
      backdropFilter={'blur(32px)'}
      pos="absolute"
      pt="64px"
      pb="64px"
      top="0"
      right={'0'}
      left={0}
      // bottom={0}
    >
      <Box>
        <Text mb="18px" fontSize={'16px'} lineHeight={1.5} textAlign={'center'}>
          Setup guardians to finish your wallet creation
          <br /> for{' '}
          <Text as="span" fontWeight={'700'}>
            $0 gas fee
          </Text>
          . Effective immediately!
        </Text>
        <Flex gap="2" flexDir={'column'} align={'center'}>
          <Link to="/new_security">
            <Button py="13px" w="152px">
              Setup guardians
            </Button>
          </Link>

          <Button
            py="13px"
            w="152px"
            color="brand.black"
            bg="brand.white"
            _hover={{ bg: '#eee' }}
            border="1px solid #D0D5DD"
            onClick={skipSetupGuardian}
          >
            Later
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

const DepositHint = () => {
  return (
    <Box>
      <Text fontWeight={'600'} lineHeight={1.5} textAlign={'center'} mb="4">
        You are not holding any token yet.
        <br />
        Get your first deposit with your wallet address
      </Text>
      {/** mock alert */}
      <ReceiveCode address={'0xFDF7AC7Be34f2882734b1e6A8f39656D6B14691C'} imgWidth="100px" showFullAddress={true} mb="6" />
    </Box>
  );
};

export default function Tokens() {
  const { showTransferAssets } = useWalletContext();
  const { tokenBalance } = useBalanceStore();
  const { slotInfo } = useSlotStore();

  const showTransfer = (tokenAddress: string) => {
    showTransferAssets(tokenAddress);
  };

  const TokenBalanceTable = () => {
    return (
      <>
        {tokenBalance.map((item: ITokenBalanceItem, idx: number) => (
          <React.Fragment key={idx}>
            {idx !== 0 && <Divider my="10px" />}
            <ListItem
              key={idx}
              idx={idx}
              icon={item.logoURI}
              title={item.name || 'Unknown'}
              titleDesc={'Token'}
              amount={item.tokenBalanceFormatted}
              amountDesc={item.symbol}
              onClick={() => showTransfer(item.contractAddress)}
            />
          </React.Fragment>
        ))}
      </>
    );
  };

  const isTokenBalanceEmpty = tokenBalance.every((item) => item.tokenBalance === '0');

  return (
    <HomeCard title={'Assets'} pos="relative" external={<ExternalLink title="View more" to="/asset" />} h="100%">
      {!slotInfo.initialGuardianHash && <SetGuardianHint />}

      {isTokenBalanceEmpty ? <DepositHint /> : <TokenBalanceTable />}
    </HomeCard>
  );
}
