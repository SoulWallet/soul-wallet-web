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
import BN from 'bignumber.js';

export default function Sign() {
  const [imgSrc, setImgSrc] = useState<string>('');
  const { generateQrCode } = useTools();
  const toast = useToast();
  const estimatedFee = 0;
  const recoveryRecordID = '';
  const { connect } = useConnect();
  const { isConnected } = useAccount();
  const { writeContract: pay, data: payHash } = useWriteContract();
  const result = useWaitForTransactionReceipt({
    hash: payHash,
  });

  console.log('pay result', result);

  const doPayFee = (fee: bigint, payId: string) => {
    pay(
      {
        ...paymentContractConfig,
        functionName: 'pay',
        args: [payId],
        value: fee,
      },
      // {
      //   onSuccess: (hash) => {
      //     console.log('success', hash);
      //   },
      //   onSettled: () => {
      //     console.log('settled');
      //   },
      //   onError: (error) => {
      //     console.log('error', error);
      //   },
      // },
    );
  };

  const generateQR = async (text: string) => {
    try {
      setImgSrc(await generateQrCode(text));
    } catch (err) {
      console.error(err);
    }
  };

  const doCopy = () => {
    copyText(`${config.officialWebUrl}/pay-recover/${recoveryRecordID}`);
    toast({
      title: 'Copy success!',
      status: 'success',
    });
  };

  useEffect(() => {
    generateQR(`${config.officialWebUrl}/pay-recover/${recoveryRecordID}`);
  }, []);

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
                <Box marginBottom="22px" width="120px" height="120px">
                  <Image src={SignatureRequestImg} />
                </Box>
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
                    <Box>Network fee:</Box>
                    <Box>{ethers.formatEther(BN(estimatedFee || 0).toFixed())} ETH</Box>
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
                    onClick={() =>
                      doPayFee(
                        ethers.parseEther('0.00921619648411735'),
                        '0xe4c1084173787a7a9b396e76ed4fe1d94eee74ba78e6156b5afad25024277557',
                      )
                    }
                  >
                    Pay Fee Test
                  </Button>
                ) : (
                  <Button width="100%" theme="dark" color="white" marginBottom="18px" onClick={connect}>
                    Connect wallet
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
