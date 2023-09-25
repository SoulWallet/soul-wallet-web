import { useEffect, useState } from 'react';
import useWalletContext from '@/context/hooks/useWalletContext';
import Header from '@/components/Header';
import BN from 'bignumber.js';
import { ethers } from 'ethers';
import MobileContainer from '@/components/MobileContainer';
import useWallet from '@/hooks/useWallet';
import { Box, Text, Flex, Divider, useToast } from '@chakra-ui/react';
import { useBalanceStore } from '@/store/balance';
import { InfoWrap, InfoItem } from '@/components/SignModal';
import GasSelect from '@/components/SendAssets/comp/GasSelect';
import useBrowser from '@/hooks/useBrowser';
import PageTitle from '@/components/PageTitle';
import ReceiveCode from '@/components/ReceiveCode';
import Button from '@/components/Button';
import { useAddressStore, getIndexByAddress } from '@/store/address';
import useConfig from '@/hooks/useConfig';
import { useChainStore } from '@/store/chain';

export default function ActivateWallet() {
  const toast = useToast();
  const { account } = useWalletContext();
  const { selectedAddress, addressList } = useAddressStore();
  const [needCost, setNeedCost] = useState('');
  const [payToken, setPayToken] = useState(ethers.ZeroAddress);
  const { selectedChainItem } = useConfig();
  const [payTokenSymbol, setPayTokenSymbol] = useState('');
  const [userBalance, setUserBalance] = useState('');
  const [balanceEnough, setBalanceEnough] = useState(true);
  const [loading, setLoading] = useState(false);
  const { activateWallet } = useWallet();
  const { navigate } = useBrowser();
  const { getTokenBalance, fetchTokenBalance } = useBalanceStore();

  const doActivate = async () => {
    // TODO，add back
    if (new BN(userBalance).isLessThan(needCost)) {
      toast({
        title: 'Balance not enough',
        status: 'error',
      });
      return;
    }
    setLoading(true);
    try {
      const activateIndex = getIndexByAddress(addressList, selectedAddress);
      console.log('activateIndex', activateIndex);
      await activateWallet(activateIndex, payToken, false);
      navigate('wallet');
      toast({
        title: 'Wallet activated',
        status: 'success',
      });
    } catch (err) {
      toast({
        title: 'Activate wallet failed',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userBalance = getTokenBalance(payToken).tokenBalanceFormatted;
    setBalanceEnough(new BN(userBalance).isGreaterThanOrEqualTo(needCost));
  }, [payToken, needCost, userBalance]);

  const onPayTokenChange = async () => {
    // important TODO, clear previous request
    const activateIndex = getIndexByAddress(addressList, selectedAddress);
    setNeedCost('');
    const token = getTokenBalance(payToken);
    setPayTokenSymbol(token.symbol);
    const requiredAmount = await activateWallet(activateIndex, payToken, true);
    setNeedCost(requiredAmount || '0');
  };

  useEffect(() => {
    if (!payToken || !selectedAddress) {
      return;
    }
    onPayTokenChange();
  }, [payToken, selectedAddress]);

  const checkBalance = async () => {
    const { chainIdHex, paymasterTokens } = selectedChainItem;

    if (!selectedAddress || !chainIdHex || !paymasterTokens) {
      return;
    }

    // set user balance
    fetchTokenBalance(selectedAddress, chainIdHex, paymasterTokens);
    setUserBalance(getTokenBalance(payToken).tokenBalanceFormatted);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkBalance();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <MobileContainer>
      <Box px="5" pt="6">
        <Header />
        <PageTitle mb="0">Activate your Soul Wallet</PageTitle>
        <Text fontWeight={'600'} my="12px">
          Setting up your wallet requires a fee to cover deployment gas costs. This is not a Soul Wallet service charge.
          <br />
          <br />
          Add any of the following tokens to your wallet, and then you can continue the activation process: ETH, USDC,
          DAI, USDT.
        </Text>
        <Box bg="#fff" rounded="20px" p="3">
          <ReceiveCode address={selectedAddress} />
          <Divider h="1px" bg="#d7d7d7" my="2" />
          <InfoWrap gap="3">
            <InfoItem>
              <Text>Network</Text>
              <Text>{selectedChainItem.chainName}</Text>
            </InfoItem>
            <InfoItem>
              <Text>Network fee</Text>
              {needCost ? (
                <Flex gap="2">
                  <Text data-testid="network-fee">{BN(needCost).toFixed(6)}</Text>
                  <GasSelect data-testid="paytoken-select" gasToken={payToken} onChange={setPayToken} />
                </Flex>
              ) : (
                <Text>Loading...</Text>
              )}
            </InfoItem>
          </InfoWrap>
        </Box>

        <Button
          disabled={!needCost || !balanceEnough}
          w="full"
          loading={loading}
          onClick={doActivate}
          fontSize="20px"
          py="4"
          fontWeight={'800'}
          mt="14px"
        >
          Activate
        </Button>

        {!balanceEnough && needCost && (
          <Text color="#FF2096" textAlign={'center'} fontSize={'12px'} fontWeight={'500'} fontFamily={'Martian'} mt="1">
            Not enough {payTokenSymbol} for activation
          </Text>
        )}
      </Box>
    </MobileContainer>
  );
}
