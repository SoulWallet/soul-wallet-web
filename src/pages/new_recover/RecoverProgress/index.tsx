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
import IconEthSquare from '@/assets/chains/eth-square.svg';
import IconOpSquare from '@/assets/chains/op-square.svg';
import IconArbSquare from '@/assets/chains/arb-square.svg';
import { useTempStore } from '@/store/temp';
import CheckedIcon from '@/components/Icons/Checked';
import { copyText, toShortAddress, getNetwork, getStatus, getKeystoreStatus } from '@/lib/tools';

const getProgressPercent = (startTime: any, endTime: any) => {
  if (startTime && endTime) {
    const ct = Date.now();
    const st = +new Date(startTime);
    const et = +new Date(endTime);
    console.log('getProgressPercent', `${((ct - st) / (et - st)) * 100}%`);

    if (ct > et) {
      return '100%';
    } else if (ct > st && et > ct) {
      return `${((ct - st) / (et - st)) * 100}%`;
    }
  }

  return '0%';
};

const getWalletIcon = (chainId) => {
  if (chainId == '0xaa36a7') {
    return IconEthSquare
  } if (chainId == '0x66eee') {
    return IconArbSquare
  } if (chainId == '0xaa37dc') {
    return IconOpSquare
  }

  return IconEthSquare
}

export default function RecoverProgress() {
  const { recoverInfo, updateRecoverInfo } = useTempStore()
  const { recoveryRecordID, recoveryRecord  } = recoverInfo
  const { addresses, statusData } = recoveryRecord
  const { chainRecoveryStatus } = statusData
  const { navigate } = useBrowser();

  const viewWallet = useCallback(() => {
    navigate(`/dashboard`);
  }, [])

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
        justifyContent="flex-start"
        minHeight="calc(100% - 58px)"
        flexDirection="column"
      >
        <RoundContainer
          width="1058px"
          maxWidth="100%"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          boxShadow="none"
        >
          <Box
            width="100%"
            height="100%"
            padding="84px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Heading marginBottom="18px" type="h3">
              Wallet recovery progress
            </Heading>
            <TextBody
              fontWeight="600"
              maxWidth="550px"
              textAlign="center"
              marginBottom="20px"
              color="rgba(0, 0, 0, 0.8)"
            >
              Recovering for: {addresses.map((item: any) => item.address).join(', ')}
            </TextBody>
            <Box marginBottom="20px" display="flex">
              {chainRecoveryStatus.map((item: any) => {
                return (
                  <Box key={item.chainId} background="white" borderRadius="12px" padding="16px" width="200px" height="240px" display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginRight="20px">
                    <Box>
                      <Image src={getWalletIcon(item.chainId)} width="40px" />
                    </Box>
                    <Box fontSize="16px" fontWeight="700">
                      {getNetwork(Number(item.chainId))}
                    </Box>
                    <Box width="100%" height="12px" borderRadius="12px" display="block" background="#EEE" overflow="hidden" marginTop="20px" marginBottom="30px">
                      <Box width={getProgressPercent(item.startTime, item.expectFinishTime)} height="100%" background="#0CB700" />
                    </Box>
                    {item.status === 0 && (
                      <Box fontSize="14px" fontWeight="bold" color="#848488" zIndex="2">
                        Pending
                      </Box>
                    )}
                    {item.status === 1 && (
                      <Box color="#0CB700" fontSize="16px" fontWeight="700" display="flex" alignItems="center">
                        <Text marginLeft="4px">
                          <CheckedIcon />
                        </Text>
                        Recovered
                      </Box>
                    )}
                  </Box>
                )
              })}
            </Box>
            <Box>
              <Button
                width="320px"
                maxWidth="100%"
                theme="dark"
                type="mid"
                onClick={viewWallet}
              >
                View in wallet
              </Button>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </Box>
  )
}
