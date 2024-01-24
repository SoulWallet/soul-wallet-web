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
import IconEthSquare from '@/assets/chains/eth-square.svg';
import IconOpSquare from '@/assets/chains/op-square.svg';
import IconArbSquare from '@/assets/chains/arb-square.svg';

export default function RecoverProgress() {
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
              Recovering for: 0xAAAA12345678E25FDa5f8a56B8e267fDaB6dS123
            </TextBody>
            <Box marginBottom="20px" display="flex">
              <Box background="white" borderRadius="12px" padding="16px" width="200px" height="240px" display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginRight="20px">
                <Box>
                  <Image src={IconEthSquare} width="40px" />
                </Box>
                <Box fontSize="16px" fontWeight="700">
                  Ethereum
                </Box>
                <Box width="100%" height="12px" borderRadius="12px" display="block" background="#EEE" overflow="hidden" marginTop="20px" marginBottom="30px">
                  <Box width="40%" height="100%" background="#0CB700" />
                </Box>
                <Box color="#0CB700" fontSize="16px" fontWeight="700">
                  Recovered
                </Box>
              </Box>
              <Box background="white" borderRadius="12px" padding="16px" width="200px" height="240px" display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginRight="20px">
                <Box>
                  <Image src={IconEthSquare} width="40px" />
                </Box>
                <Box fontSize="16px" fontWeight="700">
                  Goerli
                </Box>
                <Box width="100%" height="12px" borderRadius="12px" display="block" background="#EEE" overflow="hidden" marginTop="20px" marginBottom="30px">
                  <Box width="40%" height="100%" background="#0CB700" />
                </Box>
                <Box color="#0CB700" fontSize="16px" fontWeight="700">
                  Recovered
                </Box>
              </Box>
              <Box background="white" borderRadius="12px" padding="16px" width="200px" height="240px" display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginRight="20px">
                <Box>
                  <Image src={IconArbSquare} width="40px" />
                </Box>
                <Box fontSize="16px" fontWeight="700">
                  Arbitrum One
                </Box>
                <Box width="100%" height="12px" borderRadius="12px" display="block" background="#EEE" overflow="hidden" marginTop="20px" marginBottom="30px">
                  <Box width="40%" height="100%" background="#0CB700" />
                </Box>
                <Box color="#0CB700" fontSize="16px" fontWeight="700">
                  Recovered
                </Box>
              </Box>
              <Box background="white" borderRadius="12px" padding="16px" width="200px" height="240px" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                <Box>
                  <Image src={IconOpSquare} width="40px" />
                </Box>
                <Box fontSize="16px" fontWeight="700">
                  Optimism
                </Box>
                <Box width="100%" height="12px" borderRadius="12px" display="block" background="#EEE" overflow="hidden" marginTop="20px" marginBottom="30px">
                  <Box width="40%" height="100%" background="#0CB700" />
                </Box>
                <Box color="#0CB700" fontSize="16px" fontWeight="700">
                  Recovered
                </Box>
              </Box>
            </Box>
            <Box>
              <Button
                width="320px"
                maxWidth="100%"
                theme="dark"
                type="mid"
                onClick={() => {}}
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
