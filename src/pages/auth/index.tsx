import React, { useState, useCallback, useEffect } from 'react';
import useBrowser from '@/hooks/useBrowser';
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
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useTempStore } from '@/store/temp';
import { useAddressStore } from '@/store/address';
import { useSettingStore } from '@/store/setting';
import usePassKey from '@/hooks/usePasskey';
import api from '@/lib/api';
import useWallet from '@/hooks/useWallet';
import useSdk from '@/hooks/useSdk';
import { useSignerStore } from '@/store/signer';
import AuthImg from '@/assets/auth.svg'
import SetPasskey from './SetPasskey'
import ImportAccount from './ImportAccount'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import SelectAccountModal from './SelectAccountModal'
import ImportAccountModal from './ImportAccountModal'

export default function Auth() {
  const [stepType, setStepType] = useState('auth')
  const [registerMethod, setRegisterMethod] = useState('eoa')
  const [loginMethod, setLoginMethod] = useState('eoa')
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isConnectAtive, setIsConnectAtive] = useState(false)
  const [activeConnector, setActiveConnector] = useState()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isSelectAccountOpen, setIsSelectAccountOpen] = useState(false)
  const [isImportAccountOpen, setIsImportAccountOpen] = useState(false)
  const { connect } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { createInfo, updateCreateInfo, loginInfo, updateLoginInfo, getLoginInfo } = useTempStore()
  const account = useAccount()
  const { address, isConnected, isConnecting } = account
  const { signerIdAddress, getSignerIdAddress } = useSettingStore();
  const { authenticate } = usePassKey();
  const [isLoging, setIsLoging] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const { retrieveSlotInfo } = useWallet();
  const { setAddressList } = useAddressStore();
  const { calcWalletAddressAllChains } = useSdk();
  const { setSignerIdAddress } = useSettingStore();
  const toast = useToast();
  const { navigate } = useBrowser();
  const { setCredentials, setEoas } = useSignerStore();
  const activeSignerId = loginInfo.signerId
  const activeLoginAccount = signerIdAddress[loginInfo.signerId]
  console.log('signerIdAddress', signerIdAddress, activeSignerId, activeLoginAccount)

  const openRecover = useCallback(() => {
    navigate('/recover')
  }, [])

  const openLogin = useCallback(() => {
    setIsLoginOpen(true)
  }, [])

  const closeLogin = useCallback(() => {
    setIsLoginOpen(false)
  }, [])

  const openRegister = useCallback(() => {
    setIsRegisterOpen(true)
  }, [])

  const closeRegister = useCallback(() => {
    setIsRegisterOpen(false)
  }, [])

  const openSelectAccount = useCallback(() => {
    setIsSelectAccountOpen(true)
  }, [])

  const closeSelectAccount = useCallback(() => {
    setIsSelectAccountOpen(false)
  }, [])

  const openImportAccount = useCallback(() => {
    setIsImportAccountOpen(true)
  }, [])

  const closeImportAccount = useCallback(() => {
    setIsImportAccountOpen(false)
  }, [])

  const startLogin = useCallback(() => {
    setIsLoginOpen(false)
    setIsSelectAccountOpen(true)
  }, [])

  const connectEOA = useCallback(async (connector: any) => {
    console.log('connectEOA', connector)
    setIsConnectAtive(true)
    connect({ connector })
    setActiveConnector(connector)
  }, [])

  const startRegisterWithPasskey = useCallback(() => {
    setIsConnectAtive(true)
    setRegisterMethod('passkey')
    closeRegister()
  }, [])

  const startRegisterWithEOA = useCallback((address: any) => {
    setIsConnectAtive(true)
    setRegisterMethod('eoa')
    closeRegister()
    updateCreateInfo({
      eoaAddress: [address]
    })
    setStepType('setPassKey')
  }, [])

  const disconnectEOA = useCallback(async () => {
    await disconnectAsync()
    setIsConnectAtive(false)
    updateCreateInfo({
      eoaAddress: []
    })
    // closeRegister()
  }, [])

  const startLoginWithPasskey = useCallback(async () => {
    try {
      setLoginMethod('passkey')
      setIsLoging(true)
      // closeLogin()
      const { publicKey, credential } = await authenticate();
      const { credentialId } = credential
      updateLoginInfo({
        signerId: credentialId,
        method: 'passkey',
        credential
      })
      setIsLoging(false)
      closeLogin()
      const signerIdAddress = getSignerIdAddress()

      if (signerIdAddress[credentialId]) {
        openSelectAccount()
      } else {
        setStepType('importAccount')
      }
    } catch (error: any) {
      console.log('error', error.message)
      setIsLoging(false)
    }
  }, [])

  const startLoginWithEOA = useCallback((connector: any) => {
    connect({ connector })
    setLoginMethod('eoa')
    updateLoginInfo({
      signerId: address,
      method: 'eoa',
      eoaAddress: address
    })
    closeLogin()

    const signerIdAddress = getSignerIdAddress()

    if (signerIdAddress[address as any]) {
      openSelectAccount()
    } else {
      setStepType('importAccount')
    }
  }, [address])

  const startImportAccount = useCallback(() => {
    setIsSelectAccountOpen(false)
    setIsImportAccountOpen(true)
  }, [])

  const importWallet = useCallback(async (address: string) => {
    setIsImporting(true)
    const slotInitInfo = (
      await api.guardian.getSlotInfo({
        walletAddress: address,
      })
    ).data

    retrieveSlotInfo(slotInitInfo)

    const addresses = await calcWalletAddressAllChains(0);
    console.log('addresses', addresses)
    setAddressList(addresses);

    // save signer id to address mapping
    /* const chainIdAddress = addresses.reduce((obj, item) => {
     *   return {
     *     ...obj,
     *     [item.chainIdHex]: item.address,
     *   };
     * }, {});

     * initialSignerIds.forEach((item) => {
     *   setSignerIdAddress(item, chainIdAddress);
     * });
     */
    const loginInfo = getLoginInfo()

    if (loginInfo.method === 'eoa') {
      setEoas([loginInfo.eoaAddress]);
    } else {
      setCredentials([loginInfo.credential]);
    }

    console.log('loginInfo', loginInfo)
    setIsImporting(false)
    toast({
      title: 'Logged in',
      status: 'success',
    })
    setIsSelectAccountOpen(false)
    navigate('/dashboard')
  }, [])

  const jumpToHome = useCallback(() => {

  }, [])

  useEffect(() => {
    if (isConnected && address) {
      updateLoginInfo({
        signerId: address,
        method: 'eoa',
        eoaAddress: address
      })
    }
  }, [isConnected, address])

  if (stepType === 'importAccount') {
    return (
      <ImportAccount importWallet={importWallet} isImporting={isImporting} back={() => setStepType('auth')} />
    )
  }

  if (stepType === 'setPassKey' || registerMethod === 'passkey') {
    return (
      <SetPasskey />
    )
  }

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
            width={{ base: "100%", md: "50%" }}
            height="100%"
            p="60px"
            pt="100px"
          >
            <Heading marginBottom="40px" fontSize="40px">
              Social recovery wallet for Ethereum
            </Heading>
            <Box marginBottom="90px">
              <Box marginBottom="18px" height="20px" display="flex">
                <Box marginRight="14px"><PasskeyIcon /></Box>
                <Box>
                  <TextBody>
                    Self-custody with passkey
                  </TextBody>
                </Box>
              </Box>
              <Box marginBottom="18px" height="20px" display="flex">
                <Box marginRight="14px"><AccountIcon /></Box>
                <Box>
                  <TextBody>
                    Recover wallet through trusted friends
                  </TextBody>
                </Box>
              </Box>
              <Box marginBottom="18px" height="20px" display="flex">
                <Box marginRight="14px"><TransferIcon /></Box>
                <Box>
                  <TextBody>
                    Pay gas fee with ERC-20 tokens and stablecoin
                  </TextBody>
                </Box>
              </Box>
              <Box marginBottom="18px" height="20px" display="flex">
                <Box marginRight="14px"><TokenIcon /></Box>
                <Box>
                  <TextBody>
                    Cross-L2 experience secured by Ethereum
                  </TextBody>
                </Box>
              </Box>
            </Box>
            <TextBody fontWeight="700" color="#818181">
              For more info, check out <Box as="a" target='_blank' href={`${import.meta.env.VITE_OFFICIAL_WEB_URL}#faq`} color="#FF2E79">{`FAQs >`}</Box>
            </TextBody>
          </Box>
          <Box
            width={{ base: "100%", md: "50%" }}
            background="#F7F7FF"
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
              <Box marginBottom="40px">
                <Image src={AuthImg} />
              </Box>
              <Box
                width="335px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  width="100%"
                  theme="dark"
                  color="white"
                  marginBottom="18px"
                  onClick={openRegister}
                >
                  Create account
                </Button>
                <Button
                  width="100%"
                  theme="light"
                  marginBottom="48px"
                  onClick={openLogin}
                >
                  Login
                </Button>
                <TextBody onClick={openRecover} cursor="pointer">
                  Lost access to your account?
                </TextBody>
              </Box>
            </Box>
          </Box>
        </RoundContainer>
        <Box marginTop="40px">
          <TextBody
            fontWeight="600"
            color="#818181"
            fontSize="16px"
          >
            If you have any questions, reach out to us at <Box as="a" color="#2D5AF6" textDecoration="underline">support@soulwallet.io</Box>
          </TextBody>
          <Box display="flex" alignItems="center" justifyContent="center" marginTop="10px">
            <Box padding="10px"><TwitterIcon /></Box>
            <Box padding="10px"><TelegramIcon /></Box>
            <Box padding="10px"><GithubIcon /></Box>
          </Box>
        </Box>
        <LoginModal
          isOpen={isLoginOpen}
          onClose={closeLogin}
          startLogin={startLogin}
          connectEOA={connectEOA}
          isConnecting={isConnecting}
          isConnected={isConnected}
          startLoginWithEOA={startLoginWithEOA}
          startLoginWithPasskey={startLoginWithPasskey}
          isLoging={isLoging}

        />
        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={closeRegister}
          connectEOA={connectEOA}
          isConnecting={isConnecting}
          isConnected={isConnected}
          isConnectAtive={isConnectAtive}
          startRegisterWithPasskey={startRegisterWithPasskey}
          startRegisterWithEOA={startRegisterWithEOA}
          disconnectEOA={disconnectEOA}
          activeConnector={activeConnector}
          address={address}
        />
        <SelectAccountModal
          isOpen={isSelectAccountOpen}
          onClose={closeSelectAccount}
          startImportAccount={startImportAccount}
          activeLoginAccount={activeLoginAccount}
          importWallet={importWallet}
          isImporting={isImporting}
        />
        <ImportAccountModal
          isOpen={isImportAccountOpen}
          onClose={closeImportAccount}
          importWallet={importWallet}
          openSelectAccount={openSelectAccount}
          isImporting={isImporting}
        />
      </Box>
    </Box>
  )
}
