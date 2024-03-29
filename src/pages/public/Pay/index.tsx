import React, { useState, useCallback, useEffect } from 'react';
import { Box, Text, Image, useToast, Grid, GridItem, Flex, Popover, PopoverTrigger } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { paymentContractConfig } from '@/contracts/contracts';
import Header from '@/components/Header';
import IconLogo from '@/assets/logo-all-v3.svg';
import IntroImg from '@/assets/Intro.jpg';
import RoundContainer from '@/components/new/RoundContainer';
import Heading from '@/components/new/Heading';
import TextBody from '@/components/new/TextBody';
import Button from '@/components/Button';
import { SignHeader } from '../Sign';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import api from '@/lib/api';
import { ethers } from 'ethers';
import useTools from '@/hooks/useTools';
import { useParams } from 'react-router-dom'
import { metaMask } from 'wagmi/connectors'
import SuccessIcon from '@/components/Icons/Success'
import ConnectWalletModal from '@/pages/recover/ConnectWalletModal'
import BN from 'bignumber.js';
import useWagmi from '@/hooks/useWagmi'

export default function Pay() {
  const { recoverId } = useParams()
  const [recoveryRecord, setRecoveryRecord] = useState<any>()
  const [imgSrc, setImgSrc] = useState<string>('');
  const { generateQrCode } = useTools();
  const [paying, setPaying] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [estimatedFee, setEstimatedFee] = useState(0)
  const toast = useToast();
  const { switchChain } = useSwitchChain();
  const recoveryRecordID = '';
  const {
    connectEOA,
    isConnected,
    isConnectOpen,
    openConnect,
    closeConnect,
    address,
    isConnecting,
    chainId : connectedChainId
  } = useWagmi()
  const { writeContract: pay, data: payHash } = useWriteContract();
  const result = useWaitForTransactionReceipt({
    hash: payHash,
  });

  const mainnetChainId = Number(import.meta.env.VITE_MAINNET_CHAIN_ID);

  const doPay = useCallback(async () => {
    try {
      setPaying(true)
      pay(
        {
          ...paymentContractConfig,
          functionName: 'pay',
          args: [recoverId],
          value: ethers.parseEther(ethers.formatEther(BN(estimatedFee).toFixed())),
        },
        {
          onSuccess: (hash) => {
            setPaying(false)
            setIsPaid(true)
            toast({
              title: 'Pay request sent!',
              status: 'success',
            });
            console.log('success', hash);
          },
          onSettled: () => {
            console.log('settled');
          },
          onError: (error) => {
            setPaying(false)
            let message = error.message

            if (message && message.indexOf('does not have enough funds') !== -1) {
              message = 'Not enough balance in the wallet you connected'
            }

            if (message && message.indexOf('user rejected action') !== -1) {
              message = 'User rejected action'
            }

            toast({
              title: message,
              status: 'error',
            });
            console.log('error', error);
          },
        },
      );
    } catch (error: any) {
      console.log('error', error.message)
    }
  }, [recoverId, estimatedFee])

  const generateQR = async (text: string) => {
    try {
      setImgSrc(await generateQrCode(text));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    generateQR(`${location.origin}/public/pay/${recoveryRecordID}`);
  }, []);

  const loadRecord = async (recoverId: any) => {
    try {
      const res = await api.guardian.getRecoverRecord({ recoveryRecordID: recoverId })
      const recoveryRecord = res.data
      setLoaded(true)
      setRecoveryRecord(recoveryRecord)
    } catch (error: any) {
      console.log('error', error.message)
    }
  }

  useEffect(() => {
    if (recoveryRecord) {
      setEstimatedFee(Number(recoveryRecord.estimatedFee))
      if (!isPaid) setIsPaid(recoveryRecord.status > 1)
    }
  }, [recoveryRecord, isPaid])

  useEffect(() => {
    if (recoverId) {
      loadRecord(recoverId)
      const interval = setInterval(() => loadRecord(recoverId), 5000)
      return () => clearInterval(interval)
    }
  }, [recoverId])

  if (!loaded) {
    return (
      <Box width="100%" minHeight="100vh" background="#F2F4F7">
        <SignHeader />
        <Box
          padding="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="calc(100vh - 58px)"
          flexDirection="column"
          width="100%"
          paddingTop="60px"
        >
          <RoundContainer
            width="1058px"
            maxWidth="100%"
            minHeight="544px"
            maxHeight="100%"
            display="flex"
            padding="0"
            overflow="hidden"
            flexDirection={{ base: "column", md: "row" }}
            background="#FFFFFF"
          >
            <Box
              width={{ base: "100%", md: "100%" }}
              flex="1"
              display="flex"
              padding="60px"
            >
              <Box
                width="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Box maxWidth="548px" textAlign="center" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                  <Box
                    fontSize="32px"
                    fontWeight="700"
                    fontFamily="Nunito"
                  >
                    Loading...
                  </Box>
                </Box>
              </Box>
            </Box>
          </RoundContainer>
        </Box>
      </Box>
    )
  }

  if (!!isPaid) {
    return (
      <Flex align={'center'} justify={'center'} width="100%" minHeight="100vh" background="#F2F4F7">
        <SignHeader />
        <Box
          padding="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="calc(100vh - 58px)"
          flexDirection="column"
          width="100%"
          paddingTop="60px"
        >
          <RoundContainer
            width="1058px"
            maxWidth="100%"
            minHeight="544px"
            maxHeight="100%"
            display="flex"
            padding="0"
            overflow="hidden"
            flexDirection={{ base: "column", md: "row" }}
            background="#FFFFFF"
          >
            <Box
              width={{ base: "100%", md: "100%" }}
              flex="1"
              display="flex"
              padding="60px"
            >
              <Box
                width="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Box maxWidth="548px" textAlign="center" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                  <Box
                    marginBottom="22px"
                    width="120px"
                    height="120px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <SuccessIcon size="120" />
                  </Box>
                  <Box
                    fontSize="32px"
                    fontWeight="700"
                    fontFamily="Nunito"
                  >
                    Thank you, payment received!
                  </Box>
                  <Box
                    fontSize="14px"
                    fontWeight="400"
                    fontFamily="Nunito"
                    color="black"
                    marginTop="34px"
                    maxWidth="500px"
                  >
                    Recover for: {recoveryRecord.addresses.map((item: any) => item.address).join(', ')}
                  </Box>
                </Box>
                {/* <Box
                    width="320px"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    marginTop="30px"
                    >
                    <Button
                    width="100%"
                    type="black"
                    color="white"
                    marginBottom="18px"
                    size="xl"
                    skipSignCheck
                    onClick={() => window.close()}
                    >
                    Close
                    </Button>
                    </Box> */}
              </Box>
            </Box>
          </RoundContainer>
        </Box>
      </Flex>
    )
  }

  return (
    <Flex align={'center'} justify={'center'} width="100%" minHeight="100vh" background="#F2F4F7">
      <SignHeader />
      <Box
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 58px)"
        flexDirection="column"
        width="100%"
      >
        <RoundContainer
          width="1058px"
          maxWidth="100%"
          minHeight="544px"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          flexDirection={{ base: 'column', md: 'row' }}
          background="#FFFFFF"
        >
          <Box width={{ base: '100%', md: '100%' }} flex="1" display="flex" padding="60px">
            <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <Box
                maxWidth="548px"
                textAlign="center"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Box fontSize="32px" fontWeight="700" fontFamily="Nunito">
                  Pay Recover Fee
                </Box>
                <TextBody
                  fontWeight="600"
                  maxWidth={{ base: '360px', md: '650px' }}
                  marginBottom="20px"
                  wordBreak="break-all"
                  width="100%"
                >
                  Pay the recovery fee to get the wallet back. This fee is used on the Ethereum network for wallet recovery. We don't charge fee from this transaction.
                </TextBody>
                <Box
                  background="#F9F9F9"
                  borderRadius="20px"
                  fontSize="18px"
                  fontWeight="700"
                  padding="24px"
                  width="260px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  marginBottom="20px"
                >
                  <Box width="150px" height="150px">
                    <Image src={imgSrc} width="150px" height="150px" />
                  </Box>
                  <Box
                    width="100%"
                    display="flex"
                    fontSize="12px"
                    alignItems="center"
                    justifyContent="space-between"
                    padding="10px 5px"
                  >
                    <Box>Network:</Box>
                    <Box color="#EC588D">Sepolia</Box>
                  </Box>
                  <Box
                    width="100%"
                    display="flex"
                    fontSize="12px"
                    alignItems="center"
                    justifyContent="space-between"
                    padding="5px"
                  >
                    <Box textAlign="left">Network fee:</Box>
                    <Box textAlign="right">{BN(ethers.formatEther(BN(estimatedFee || 0).toFixed())).toFixed(6)} ETH</Box>
                  </Box>
                </Box>
              </Box>
              <Box
                width="320px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                marginTop="30px"
              >
                {isConnected ? (
                  connectedChainId === mainnetChainId ?
                  <Button
                    width="100%"
                    type="black"
                    color="white"
                    marginBottom="18px"
                    onClick={doPay}
                    size="xl"
                    skipSignCheck
                    loading={paying}
                    disabled={paying}
                  >
                    Pay Fee
                  </Button>: <Button
                               width="100%"
                               type="black"
                               color="white"
                               marginBottom="18px"
                               onClick={() => switchChain({ chainId: mainnetChainId })}
                               size="xl"
                               skipSignCheck
                               loading={paying}
                               disabled={paying}
                             >
                    Switch chain
                  </Button>
                ) : (
                  <Button
                    width="100%"
                    type="black"
                    color="white"
                    marginBottom="18px"
                    onClick={openConnect}
                    size="xl"
                    skipSignCheck
                    disabled={isConnecting}
                  >
                    {isConnecting ? 'Connecting' : 'Connect wallet'}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
      <ConnectWalletModal isOpen={isConnectOpen} connectEOA={connectEOA} onClose={closeConnect} />
    </Flex>
  );
}
