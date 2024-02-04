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
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import IconLogo from '@/assets/logo-all-v3.svg';
import IntroImg from '@/assets/Intro.jpg';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import Title from '@/components/new/Title'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/new/Button'
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
import config from '@/config';
import StepProgress from '../StepProgress'

export default function PayRecoveryFee({ next }: any) {
  const { recoverInfo, updateRecoverInfo } = useTempStore()
  const { recoveryRecordID, recoveryRecord  } = recoverInfo
  const { estimatedFee } = recoveryRecord
  const [imgSrc, setImgSrc] = useState<string>('');
  const { generateQrCode } = useTools();
  const toast = useToast();

  const payUrl = `${location.origin}/public/pay/${recoveryRecordID}`

  const generateQR = async (text: string) => {
    try {
      setImgSrc(await generateQrCode(text));
    } catch (err) {
      console.error(err);
    }
  };

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

  useEffect(() => {
    generateQR(payUrl);
  }, []);

  console.log('estimatedFee', estimatedFee)

  return (
    <Box width="100%" minHeight="100vh" background="#F2F4F7">
      <Box height="58px" padding="10px 20px">
        <Image src={IconLogo} h="44px" />
      </Box>
      <Box
        padding="20px"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        minHeight="calc(100% - 58px)"
      >
        <RoundContainer
          width="1058px"
          maxWidth="100%"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          background="white"
        >
          <Box
            width="100%"
            height="100%"
            padding="50px"
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
              <Button
                width="275px"
                maxWidth="100%"
                marginBottom="14px"
                onClick={handlePay}
              >
                Connect wallet and pay
              </Button>
              <Button
                width="275px"
                maxWidth="100%"
                theme="light"
                onClick={doCopy}
              >
                Ask friend to pay
              </Button>
            </Box>
          </Box>
        </RoundContainer>
        <StepProgress activeIndex={3} />
      </Box>
    </Box>
  )
}
