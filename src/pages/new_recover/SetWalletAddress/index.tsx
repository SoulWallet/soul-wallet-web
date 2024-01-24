import React, { useState, useCallback, useEffect } from 'react';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Text,
  Image,
  Flex,
  useToast,
  Input
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

export default function SetWalletAddress({ next }: any) {
  const toast = useToast();
  const { navigate } = useBrowser();

  const back = useCallback(() => {
    navigate(`/auth`);
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
              Step 1/4: Wallet address
            </Heading>
            <TextBody
              fontWeight="600"
              maxWidth="550px"
              marginBottom="20px"
            >
              Enter any one of your wallet address on any chains, we'll be able to recover them all.
            </TextBody>
            <Box width="550px">
              <Input placeholder="Enter ENS or wallet adderss" />
            </Box>
            <Box width="100%" display="flex" alignItems="center" justifyContent="center" marginTop="100px">
              <Button
                width="80px"
                theme="light"
                marginRight="18px"
                type="mid"
                onClick={back}
              >
                Back
              </Button>
              <Button
                width="80px"
                maxWidth="100%"
                theme="dark"
                type="mid"
                onClick={next}
              >
                Next
              </Button>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </Box>
  )
}
