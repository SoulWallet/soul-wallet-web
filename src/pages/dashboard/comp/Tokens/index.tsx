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
import { defaultGuardianSafePeriod } from '@/config';
import useKeystore from '@/hooks/useKeystore';
import ReceiveCode from '@/components/ReceiveCode';
import { useAddressStore } from '@/store/address';

const SetGuardianHint = () => {
  const { createWallet } = useWallet();
  const { updateCreateInfo } = useTempStore();
  const [creating, setCreating] = useState(false);
  const skipSetupGuardian = async () => {
    setCreating(true);
    // generate wallet address
    updateCreateInfo({
      initialGuardianHash: ethers.ZeroHash,
      initialGuardianSafePeriod: defaultGuardianSafePeriod,
    });

    await createWallet();
    setCreating(false);
  };
  return (
    <Flex
      align={'center'}
      justify={'center'}
      backdropFilter={'blur(32px)'}
      pos="absolute"
      pt="100px"
      pb="90px"
      top="0"
      right={'0'}
      zIndex={'10'}
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
          <Link to="/security/guardian">
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
            // loading={creating}
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
  const { selectedAddress } = useAddressStore();
  return (
    <Box>
      <Text fontWeight={'600'} lineHeight={1.5} textAlign={'center'} mb="4">
        You are not holding any token yet.
        <br />
        Get your first deposit with your wallet address
      </Text>
      <ReceiveCode address={selectedAddress} imgWidth="100px" showFullAddress={true} mb="6" />
    </Box>
  );
};

const TokenBalanceTable = ({ tokenBalance, showSendAssets }: any) => {
  return (
    <Flex gap="6" flexDir={'column'}>
      {tokenBalance.map((item: ITokenBalanceItem, idx: number) => (
        <React.Fragment key={idx}>
          <ListItem
            key={idx}
            idx={idx}
            icon={item.logoURI}
            title={item.name || 'Unknown'}
            amount={item.tokenBalanceFormatted}
            // amountDesc={item.symbol}
            onClick={() => showSendAssets(item.contractAddress)}
          />
        </React.Fragment>
      ))}
    </Flex>
  );
};

export default function Tokens() {
  const { showSend } = useWalletContext();
  const { tokenBalance } = useBalanceStore();
  const { slotInfo } = useSlotStore();

  const showSendAssets = (tokenAddress: string) => {
    showSend(tokenAddress);
  };

  const isTokenBalanceEmpty = tokenBalance.every((item) => !Number(item.tokenBalance));

  return (
    <HomeCard title={'Assets'} pos="relative" external={<ExternalLink title="View more" to="/asset" />} h="100%">
      {!slotInfo.initialGuardianHash && <SetGuardianHint />}
      {isTokenBalanceEmpty ? (
        <DepositHint />
      ) : (
        <TokenBalanceTable tokenBalance={tokenBalance} showSendAssets={showSendAssets} />
      )}
    </HomeCard>
  );
}
