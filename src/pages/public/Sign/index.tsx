import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Text,
  Image,
  useToast,
  Grid,
  GridItem,
  Flex,
  Popover,
  PopoverTrigger,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import IconLogo from '@/assets/logo-all-v3.svg';
import IntroImg from '@/assets/Intro.jpg';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/new/Button'
import TwitterIcon from '@/components/Icons/Social/Twitter'
import TelegramIcon from '@/components/Icons/Social/Telegram'
import GithubIcon from '@/components/Icons/Social/Github'
import PasskeyIcon from '@/components/Icons/Intro/Passkey'
import AccountIcon from '@/components/Icons/Intro/Account'
import TransferIcon from '@/components/Icons/Intro/Transfer'
import TokenIcon from '@/components/Icons/Intro/Token'
import { useAccount, useConnect, useDisconnect, useSignTypedData } from 'wagmi'
import { useTempStore } from '@/store/temp';
import { useAddressStore } from '@/store/address';
import { useSettingStore } from '@/store/setting';
import usePassKey from '@/hooks/usePasskey';
import api from '@/lib/api';
import useWallet from '@/hooks/useWallet';
import useSdk from '@/hooks/useSdk';
import { useSignerStore } from '@/store/signer';
import AuthImg from '@/assets/auth.svg'
import SignatureRequestImg from '@/assets/icons/signature-request.svg'
import { useParams } from 'react-router-dom'

export default function Sign() {
  const { recoverId } = useParams()
  const { address, isConnected, isConnecting } = useAccount()
  const { connect } = useConnect();
  console.log('recoverId', recoverId)
  const  {signTypedData} = useSignTypedData();

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
                <Box marginBottom="22px" width="120px" height="120px">
                  <Image src={SignatureRequestImg} />
                </Box>
                <Box
                  fontSize="32px"
                  fontWeight="700"
                  fontFamily="Nunito"
                >
                  Signature request
                </Box>
                <Box
                  fontSize="14px"
                  fontWeight="500"
                  fontFamily="Nunito"
                  color="rgba(0, 0, 0, 0.80)"
                >
                  From: {address}
                </Box>
                <Box
                  fontSize="14px"
                  fontWeight="400"
                  fontFamily="Nunito"
                  color="black"
                  marginTop="34px"
                >
                  Your friend's wallet is lost. As their guardian, please connect your wallet and confirm request to assist with their wallet recovery.
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
                {isConnected ?  <Button
                  width="100%"
                  theme="dark"
                  color="white"
                  marginBottom="18px"
                  onClick={() => signTypedData({
                    types: {
                      Person: [
                        { name: 'name', type: 'string' },
                        { name: 'wallet', type: 'address' },
                      ],
                      Mail: [
                        { name: 'from', type: 'Person' },
                        { name: 'to', type: 'Person' },
                        { name: 'contents', type: 'string' },
                      ],
                    },
                    primaryType: 'Mail',
                    message: {
                      from: {
                        name: 'Cow',
                        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
                      },
                      to: {
                        name: 'Bob',
                        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
                      },
                      contents: 'Hello, Bob!',
                    },
                  })}
                >
                  Sign typed data
                </Button>: <Button
                  width="100%"
                  theme="dark"
                  color="white"
                  marginBottom="18px"
                  onClick={connect}
                >
                  Connect wallet
                </Button>}
               
              </Box>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </Box>
  )
}
