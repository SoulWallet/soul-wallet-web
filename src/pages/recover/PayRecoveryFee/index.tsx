import React, { useState, useCallback, useEffect } from 'react';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Text,
  Image,
  Flex,
  useToast,
  Input,
  Menu,
  MenuList,
  MenuButton,
  MenuItem
} from '@chakra-ui/react';
import { SignHeader } from '@/pages/public/Sign';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import IconLogo from '@/assets/logo-all-v3.svg';
import IntroImg from '@/assets/Intro.jpg';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import Title from '@/components/new/Title'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/Button'
import PlusIcon from '@/components/Icons/Plus';
import ComputerIcon from '@/components/Icons/Computer';
import TwitterIcon from '@/components/Icons/Social/Twitter'
import TelegramIcon from '@/components/Icons/Social/Telegram'
import GithubIcon from '@/components/Icons/Social/Github'
import PasskeyIcon from '@/components/Icons/Intro/Passkey'
import AccountIcon from '@/components/Icons/Intro/Account'
import TransferIcon from '@/components/Icons/Intro/Transfer'
import TokenIcon from '@/components/Icons/Intro/Token'
import usePassKey from '@/hooks/usePasskey';
import { useSignerStore } from '@/store/signer';
import { useTempStore } from '@/store/temp';
import useTools from '@/hooks/useTools';
import { ethers } from 'ethers';
import BN from 'bignumber.js';
import { copyText, toShortAddress, getNetwork, getStatus, getKeystoreStatus } from '@/lib/tools';
import { useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import config from '@/config';
import { paymentContractConfig } from '@/contracts/contracts';
import { metaMask } from 'wagmi/connectors'
import StepProgress from '../StepProgress'

export default function PayRecoveryFee({ next }: any) {
  const { recoverInfo, updateRecoverInfo } = useTempStore()
  const { recoveryRecordID, recoveryRecord  } = recoverInfo
  const { estimatedFee } = recoveryRecord
  const [imgSrc, setImgSrc] = useState<string>('');
  const { generateQrCode } = useTools();
  const [paying, setPaying] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const toast = useToast();
  const { switchChain } = useSwitchChain();
  const { connectAsync } = useConnect();
  const { address, isConnected, isConnecting, chainId : connectedChainId, } = useAccount()
  const { writeContract: pay, data: payHash } = useWriteContract();
  const result = useWaitForTransactionReceipt({
    hash: payHash,
  });

  const mainnetChainId = Number(import.meta.env.VITE_MAINNET_CHAIN_ID);

  const payUrl = `${location.origin}/public/pay/${recoveryRecordID}`

  const generateQR = async (text: string) => {
    try {
      setImgSrc(await generateQrCode(text));
    } catch (err) {
      console.error(err);
    }
  };

  const doPay = useCallback(async () => {
    try {
      setPaying(true)
      pay(
        {
          ...paymentContractConfig,
          functionName: 'pay',
          args: [recoveryRecordID],
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

            if (message && message.indexOf('User rejected the request') !== -1) {
              message = 'User rejected the request.'
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
  }, [recoveryRecordID, estimatedFee])

  const doCopy = () => {
    copyText(payUrl);
    toast({
      title: 'Copy success!',
      status: 'success',
    });
  };

  const handlePay = async () => {
    window.open(payUrl, '_blank');
  };

  const connectWallet = useCallback(async () => {
    await connectAsync({ connector: metaMask() });
  }, [])

  useEffect(() => {
    generateQR(payUrl);
  }, []);

  console.log('estimatedFee', estimatedFee)

  return (
    <Flex align={'center'} justify={'center'} width="100%" minHeight="100vh" background="#F2F4F7">
      <SignHeader url="/auth" />
      <Box
        padding="20px"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        minHeight="calc(100% - 58px)"
        width="100%"
        paddingTop="60px"
        flexDirection={{ base: 'column', 'md': 'row' }}
      >
        <RoundContainer
          width="1058px"
          maxWidth="100%"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          background="white"
          marginBottom="20px"
        >
          <Box
            width="100%"
            height="100%"
            padding={{ base: '20px', md: '50px' }}
            display="flex"
            alignItems="flex-start"
            justifyContent="center"
            flexDirection="column"
          >
            <Heading marginBottom="18px" type="h4" fontSize="24px" fontWeight="700">
              Step 4/4: Pay recovery fee
            </Heading>
            <TextBody
              fontWeight="600"
              maxWidth="650px"
              marginBottom="20px"
              width="100%"
              wordBreak="break-all"
            >
              Pay the recovery fee to get the wallet back. This fee is used on the Ethereum network for wallet recovery. We don't charge fee from this transaction.
            </TextBody>
            <Box
              background="#F9F9F9"
              borderRadius="20px"
              fontSize="18px"
              fontWeight="700"
              padding="24px"
              width={{ base: '100%', md: '260px' }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              marginBottom="20px"
            >
              <Box width="150px" height="150px">
                <Image src={imgSrc} width="150px" height="150px" />
              </Box>
              <Box width="100%" display="flex" fontSize="12px" alignItems="center" justifyContent="space-between" padding="10px 5px">
                <Box>Network:</Box>
                <Box color="#EC588D">Sepolia</Box>
              </Box>
              <Box width="100%" display="flex" fontSize="12px" alignItems="center" justifyContent="space-between" padding="5px">
                <Box>Network fee:</Box>
                <Box>{BN(ethers.formatEther(BN(estimatedFee || 0).toFixed())).toFixed(6)} ETH</Box>
              </Box>
            </Box>
            <Box
              width="100%"
              display="flex"
              alignItems="flex-start"
              flexDirection="column"
            >
              {isConnected ? (
                connectedChainId === mainnetChainId ?
                <Button
                  type="black"
                  color="white"
                  marginBottom="18px"
                  onClick={doPay}
                  size="xl"
                  skipSignCheck
                  loading={paying}
                  disabled={paying}
                  width={{ base: '100%', md: '275px' }}
                >
                  Pay Fee
                </Button>: <Button
                             type="black"
                             color="white"
                             marginBottom="18px"
                             onClick={() => switchChain({ chainId: mainnetChainId })}
                             size="xl"
                             skipSignCheck
                             loading={paying}
                             disabled={paying}
                             width={{ base: '100%', md: '275px' }}
                           >
                  Switch Chain
                </Button>
              ) : (
                <Button
                  type="black"
                  color="white"
                  marginBottom="18px"
                  onClick={connectWallet}
                  size="xl"
                  skipSignCheck
                  disabled={isConnecting}
                  width={{ base: '100%', md: '275px' }}
                >
                  {isConnecting ? 'Connecting' : 'Connect wallet'}
                </Button>
              )}

              <Button
                width={{ base: '100%', md: '275px' }}
                maxWidth="100%"
                type="white"
                onClick={doCopy}
                size="xl"
                skipSignCheck
              >
                Ask friend to pay
              </Button>
            </Box>
          </Box>
        </RoundContainer>
        <StepProgress activeIndex={3} />
      </Box>
    </Flex>
  )
}
