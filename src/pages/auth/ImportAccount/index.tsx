import React, { useState, useCallback, useEffect } from 'react';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Text,
  Image,
  Grid,
  GridItem,
  Flex,
  Popover,
  PopoverTrigger,
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
import { ethers } from 'ethers';
import { useTempStore } from '@/store/temp';

export default function ImportAccount({ importWallet, isImporting }: any) {
  const [address, setAddress] = useState('')
  const [added, setAdded] = useState(false)
  const { createInfo, updateCreateInfo } = useTempStore()
  const { register } = usePassKey()
  const toast = useToast();
  const {
    addCredential,
    credentials,
  } = useSignerStore();
  const [isCreating, setIsCreating] = useState(false);
  const { navigate } = useBrowser();
  console.log('create', credentials)

  const addPasskey = useCallback(() => {
    setAdded(true)
  }, [])

  const createWallet = async () => {
    try {
      setIsCreating(true);
      const credentialKey = await register();
      addCredential(credentialKey);
      setIsCreating(false);
    } catch (error: any) {
      console.log('ERR', error)
      console.log('error', error);
      setIsCreating(false);
      toast({
        title: error.message,
        status: 'error',
      });
    }
  }

  const skip = useCallback(() => {
    console.log('skip')
    navigate(`/dashboard`);
  }, [])

  const onAddressChange = useCallback((e: any) => {
    const address = e.target.value
    console.log('address', address)
    setAddress(address)
  }, [])

  const next = useCallback(() => {
    updateCreateInfo({
      credentials
    })

    navigate(`/dashboard`);
  }, [credentials])

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
            padding="84px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Box height="100px" width="100px" borderRadius="100px" background="#E3E3E3" marginBottom="30px" />
            <Heading marginBottom="18px" type="h3">
              No wallet found on this device
            </Heading>
            <TextBody fontWeight="600">To access your Soul wallet, please enter Soul wallet address</TextBody>
            <Box
              background="white"
              height="100%"
              width="100%"
              roundedBottom="20px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              padding="30px"
            >
              <Box width="100%" maxWidth="548px" display="flex" marginBottom="10px" flexDirection="column">
                <Input height="44px" borderRadius="12px" placeholder="Enter wallet address" value={address} onChange={onAddressChange} />
                <Box fontSize="14px" fontWeight="400" display="flex" alignItems="center" marginTop="10px" padding="0 10px">
                  Forgot address? Try <Box fontSize="14px" color="#FF2E79" fontWeight="700" marginLeft="6px" cursor="pointer">Social Recovery</Box>
                </Box>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" width="100%">
              <Button
                theme="dark"
                color="white"
                padding="0 20px"
                disabled={!ethers.isAddress(address) || isImporting}
                onClick={() => importWallet(address)}
                loading={isImporting}
              >
                Go to my wallet
              </Button>
              <Box fontWeight="400" fontSize="14px" textAlign="center" marginTop="20px">
                For new users, please <Box as="span" fontWeight="700" fontSize="14px" marginLeft="2px">Create New Account</Box>
              </Box>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </Box>
  )
}
