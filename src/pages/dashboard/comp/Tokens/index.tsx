import React, { useState } from 'react';
import { ExternalLink } from '../HomeCard';
import ListItem from '@/components/ListItem';
import { Text, Box, Flex } from '@chakra-ui/react';
import { ITokenBalanceItem, useBalanceStore } from '@/store/balance';
import HomeCard from '../HomeCard';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useSlotStore } from '@/store/slot';
import Button from '@/components/Button';
import { Link } from 'react-router-dom';
import { SkipModal } from '@/pages/create/SetGuardians';
import ReceiveCode from '@/components/ReceiveCode';
import { useAddressStore } from '@/store/address';
import useTools from '@/hooks/useTools';

const SetGuardianHint = ({ onShowSkip }: { onShowSkip: () => void }) => {
  return (
    <Flex
      align={'center'}
      justify={'center'}
      backdropFilter={'blur(12px)'}
      pos="absolute"
      pt={{ xl: "80px", "2xl" :"100px"}}
      pb="100px"
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
            onClick={onShowSkip}
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
      You don't have any tokens in your wallet yet,<br/> deposit tokens into the following address to experience Soul wallet.
      </Text>
      <ReceiveCode address={selectedAddress} imgWidth="100px" showFullAddress={true} mb="6" />
    </Box>
  );
};

const lineColors = [
  '#5B92FF',
  '#AF81F2',
  '#FF9458',
  '#FFAAB4',
  '#FE5A95',
  '#AF56D9',
  '#00C4A0',
  '#FFA800',
  '#8AB11B',
  '#6328E5',
];

const TokenBalanceTable = ({ tokenBalance, showSendAssets }: any) => {
  const { totalUsdValue } = useBalanceStore();
  return (
    <Flex gap="6" flexDir={'column'}>
      {tokenBalance.map((item: ITokenBalanceItem, idx: number) => (
        <React.Fragment key={idx}>
          <ListItem
            key={idx}
            idx={idx}
            icon={item.logoURI}
            tokenPrice={item.tokenPrice}
            usdValue={item.usdValue}
            totalUsdValue={totalUsdValue}
            title={item.name || 'Unknown'}
            lineColor={lineColors[idx] || 'brand.gray'}
            amount={item.tokenBalanceFormatted}
            onClick={() => showSendAssets(item.contractAddress)}
          />
        </React.Fragment>
      ))}
    </Flex>
  );
};

export default function Tokens() {
  const { showSend } = useWalletContext();
  const { checkInitialized } = useTools();
  const { tokenBalance } = useBalanceStore();
  const { slotInfo } = useSlotStore();
  const [isSkipOpen, setIsSkipOpen] = useState(false);

  const showSendAssets = (tokenAddress: string) => {
    showSend(tokenAddress);
  };

  const isTokenBalanceEmpty = tokenBalance.every((item) => !Number(item.tokenBalance));

  return (
    <HomeCard title={'Assets'} pos="relative" external={checkInitialized() ? <ExternalLink title="View more" to="/asset" /> : null} h="100%">
      {(!slotInfo.initialGuardianHash || isSkipOpen) && <SetGuardianHint onShowSkip={() => setIsSkipOpen(true)} />}
      {isTokenBalanceEmpty ? (
        <DepositHint />
      ) : (
        <TokenBalanceTable tokenBalance={tokenBalance} showSendAssets={showSendAssets} />
      )}
      <SkipModal isOpen={isSkipOpen} onClose={() => setIsSkipOpen(false)} />
    </HomeCard>
  );
}
