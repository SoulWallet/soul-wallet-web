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
import IconLogo from '@/assets/logo-all-v3.svg';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/Button'
import IconEthSquare from '@/assets/chains/eth-square.svg';
import IconOpSquare from '@/assets/chains/op-square.svg';
import IconArbSquare from '@/assets/chains/arb-square.svg';
import { useTempStore } from '@/store/temp';
import CheckedIcon from '@/components/Icons/Checked';
import { copyText, toShortAddress, getNetwork, getStatus, getKeystoreStatus } from '@/lib/tools';
import { SignHeader } from '@/pages/public/Sign';

const getProgressPercent = (startTime: any, endTime: any, status: any) => {
  if (status === 1) return '100%'

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

const getWalletIcon = (chainId: any) => {
  if (chainId == '0xaa36a7') {
    return IconEthSquare
  } if (chainId == '0x66eee') {
    return IconArbSquare
  } if (chainId == '0xaa37dc') {
    return IconOpSquare
  }

  return IconEthSquare
}

export const getWalletAddress = (chainId: any, list: any) => {
  const item = list.filter((item: any) => item.chain_id == chainId)
  console.log('getWalletAddress', chainId, list, item)

  if (item && item[0]) {
    return item[0].address
  }

  return null
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

  const canViewWallet = chainRecoveryStatus.filter((item: any) => !!item.status).length > 0

  return (
    <Flex align={'center'} justify={'center'} width="100%" minHeight="100vh" background="#F2F4F7">
      <SignHeader />
      <Box
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
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
          boxShadow="none"
          marginBottom="20px"
        >
          <Box
            width="100%"
            height="100%"
            padding={{ base: '20px', md: '84px' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Heading marginBottom="18px" type="h3" textAlign="center">
              Wallet recovery progress
            </Heading>
            <Box
              marginBottom="20px"
              display="flex"
              flexDirection={{ base: 'column', 'md': 'row' }}
            >
              {chainRecoveryStatus.map((item: any) => {
                return (
                  <Box
                    key={item.chainId}
                    background="white"
                    borderRadius="12px"
                    padding="16px"
                    height="240px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    marginRight="20px"
                    marginBottom="20px"
                    width={{ base: '100%', 'md': '200px' }}
                  >
                    <Box mb="2">
                      <Image src={getWalletIcon(item.chainId)} width="40px" height="40px" />
                    </Box>
                    <Box fontSize="16px" lineHeight={"1"} fontWeight="700">
                      {getNetwork(Number(item.chainId))}
                    </Box>
                    <Box fontSize="12px" lineHeight={"normal"} fontWeight="500" maxWidth="100%" textAlign="center" marginTop="16px">
                      {getWalletAddress(String(item.chainId), addresses)}
                    </Box>
                    <Box width="100%" height="12px" borderRadius="12px" display="block" background="#EEE" overflow="hidden" marginTop="24px" marginBottom="16px">
                      <Box width={getProgressPercent(item.startTime, item.expectFinishTime, item.status)} height="100%" background="#0CB700" />
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
                type="black"
                size="mid"
                onClick={viewWallet}
                skipSignCheck
                disabled={!canViewWallet}
              >
                View in wallet
              </Button>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </Flex>
  )
}
