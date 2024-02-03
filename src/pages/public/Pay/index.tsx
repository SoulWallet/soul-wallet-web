import React, { useState, useCallback, useEffect } from 'react';
import { Box, Text, Image, useToast, Grid, GridItem, Flex, Popover, PopoverTrigger } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { paymentContractConfig } from '@/contracts/contracts';
import Header from '@/components/Header';
import IconLogo from '@/assets/logo-all-v3.svg';
import IntroImg from '@/assets/Intro.jpg';
import RoundContainer from '@/components/new/RoundContainer';
import Heading from '@/components/new/Heading';
import TextBody from '@/components/new/TextBody';
import Button from '@/components/new/Button';
import TwitterIcon from '@/components/Icons/Social/Twitter';
import TelegramIcon from '@/components/Icons/Social/Telegram';
import GithubIcon from '@/components/Icons/Social/Github';
import PasskeyIcon from '@/components/Icons/Intro/Passkey';
import AccountIcon from '@/components/Icons/Intro/Account';
import TransferIcon from '@/components/Icons/Intro/Transfer';
import TokenIcon from '@/components/Icons/Intro/Token';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useTempStore } from '@/store/temp';
import { useAddressStore } from '@/store/address';
import { useSettingStore } from '@/store/setting';
import usePassKey from '@/hooks/usePasskey';
import api from '@/lib/api';
import { copyText, toShortAddress, getNetwork, getStatus, getKeystoreStatus } from '@/lib/tools';
import useWallet from '@/hooks/useWallet';
import useSdk from '@/hooks/useSdk';
import { useSignerStore } from '@/store/signer';
import AuthImg from '@/assets/auth.svg';
import SignatureRequestImg from '@/assets/icons/signature-request.svg';
import { ethers } from 'ethers';
import config from '@/config';
import useTools from '@/hooks/useTools';
import { useParams } from 'react-router-dom'
import { metaMask } from 'wagmi/connectors'
import SuccessIcon from '@/components/Icons/Success'
import BN from 'bignumber.js';

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
  const recoveryRecordID = '';
  const { connectAsync } = useConnect();
  const { address, isConnected, isConnecting } = useAccount()
  const { writeContract: pay, data: payHash } = useWriteContract();
  const result = useWaitForTransactionReceipt({
    hash: payHash,
  });

  console.log('pay result', result);

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
            toast({
              title: error.message,
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

  const connectWallet = useCallback(async () => {
    await connectAsync({ connector: metaMask() });
  }, [])

  if (!loaded) {
    return (
      <Box width="100%" minHeight="100vh" background="#F2F4F7">
        <Box height="58px" padding="10px 20px">
          <Link to="/dashboard">
            <Image src={IconLogo} h="44px" />
          </Link>
        </Box>
        <Box
          padding="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="calc(100vh - 58px)"
          flexDirection="column"
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
      <Box width="100%" minHeight="100vh" background="#F2F4F7">
        <Box height="58px" padding="10px 20px">
          <Link to="/dashboard">
            <Image src={IconLogo} h="44px" />
          </Link>
        </Box>
        <Box
          padding="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="calc(100vh - 58px)"
          flexDirection="column"
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
                <Box
                  width="320px"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  marginTop="30px"
                >
                  <Button
                    width="100%"
                    theme="dark"
                    color="white"
                    marginBottom="18px"
                    onClick={() => {}}
                  >
                    Close
                  </Button>
                </Box>
              </Box>
            </Box>
          </RoundContainer>
        </Box>
      </Box>
    )
  }

  return (
    <Box width="100%" minHeight="100vh" background="#F2F4F7">
      <Box height="58px" padding="10px 20px">
        <Image src={IconLogo} h="44px" />
      </Box>
      <Box
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 58px)"
        flexDirection="column"
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
                {/* <Box marginBottom="22px" width="120px" height="120px">
                    <Image src={SignatureRequestImg} />
                    </Box> */}
                <Box fontSize="32px" fontWeight="700" fontFamily="Nunito">
                  Pay Recover Fee
                </Box>
                <TextBody fontWeight="600" maxWidth="650px" marginBottom="20px">
                  Pay the recovery fee to get the wallet back. This fee is used on the Ethereum network for wallet
                  recovery. We don't charge fee from this transaction.
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
                    <Box textAlign="right">{ethers.formatEther(BN(estimatedFee || 0).toFixed())} ETH</Box>
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
                  <Button
                    width="100%"
                    theme="dark"
                    color="white"
                    marginBottom="18px"
                    onClick={doPay}
                    loading={paying}
                    disabled={paying}
                  >
                    Pay Fee
                  </Button>
                ) : (
                  <Button
                    width="100%"
                    theme="dark"
                    color="white"
                    marginBottom="18px"
                    onClick={connectWallet}
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
    </Box>
  );
}
