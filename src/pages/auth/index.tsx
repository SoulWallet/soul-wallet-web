import React, { useState, useCallback, useEffect } from 'react';
import useBrowser from '@/hooks/useBrowser';
import { Box, Text, Image, useToast, Grid, GridItem, Flex, Popover, Link, PopoverTrigger } from '@chakra-ui/react';
import config from '@/config';
import RoundContainer from '@/components/new/RoundContainer';
import Heading from '@/components/new/Heading';
import TextBody from '@/components/new/TextBody';
import Button from '@/components/Button';
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
import useWallet from '@/hooks/useWallet';
import useSdk from '@/hooks/useSdk';
import { useSignerStore } from '@/store/signer';
import AuthImg from '@/assets/auth.svg';
import useKeystore from '@/hooks/useKeystore';
import SetPasskey from './SetPasskey';
import SetWalletName from './SetWalletName';
import ImportAccount from './ImportAccount';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import SelectAccountModal from './SelectAccountModal';
import ImportAccountModal from './ImportAccountModal';
import { SignHeader } from '../public/Sign';
import useTools from '@/hooks/useTools';
import { useGuardianStore } from '@/store/guardian';

export default function Auth() {
  const [stepType, setStepType] = useState('auth');
  const { clearLogData } = useTools();
  const [registerMethod, setRegisterMethod] = useState('eoa');
  const [loginMethod, setLoginMethod] = useState('eoa');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isConnectAtive, setIsConnectAtive] = useState(false);
  const [activeConnector, setActiveConnector] = useState();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSelectAccountOpen, setIsSelectAccountOpen] = useState(false);
  const [isImportAccountOpen, setIsImportAccountOpen] = useState(false);
  const { connect } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { createInfo, updateCreateInfo, loginInfo, updateLoginInfo, getLoginInfo } = useTempStore();
  const account = useAccount();
  const { address, isConnected, isConnecting } = account;
  const { signerIdAddress, getSignerIdAddress } = useSettingStore();
  const { authenticate } = usePassKey();
  const [isLoging, setIsLoging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { retrieveSlotInfo } = useWallet();
  const { setAddressList } = useAddressStore();
  const { calcWalletAddressAllChains } = useSdk();
  const { setSignerIdAddress } = useSettingStore();
  const toast = useToast();
  const { navigate } = useBrowser();
  const { setCredentials, setEoas } = useSignerStore();
  const { getActiveGuardianHash } = useKeystore();
  const { updateGuardiansInfo } = useGuardianStore();
  const activeSignerId = loginInfo.signerId;
  const activeLoginAccounts = signerIdAddress[loginInfo.signerId];
  console.log('signerIdAddress', activeSignerId, activeLoginAccounts);

  const openRecover = useCallback(() => {
    navigate('/recover');
  }, []);

  const openLogin = useCallback(() => {
    setIsLoginOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setIsLoginOpen(false);
  }, []);

  const openRegister = useCallback(() => {
    // make sure no previous log data exist

    setIsRegisterOpen(true);
  }, []);

  const closeRegister = useCallback(() => {
    setIsRegisterOpen(false);
  }, []);

  const openSelectAccount = useCallback(() => {
    setIsSelectAccountOpen(true);
  }, []);

  const closeSelectAccount = useCallback(() => {
    setIsSelectAccountOpen(false);
  }, []);

  const openImportAccount = useCallback(() => {
    setIsImportAccountOpen(true);
  }, []);

  const closeImportAccount = useCallback(() => {
    setIsImportAccountOpen(false);
  }, []);

  const startLogin = useCallback(() => {
    setIsLoginOpen(false);
    setIsSelectAccountOpen(true);
  }, []);

  const connectEOA = useCallback(async (connector: any) => {
    console.log('connectEOA', connector);
    setIsConnectAtive(true);
    connect({ connector });
    setActiveConnector(connector);
  }, []);

  const updateWalletName = useCallback((name: any) => {
    updateCreateInfo({
      walletName: name,
    });
    setStepType('setPassKey');
  }, []);

  const startRegisterWithPasskey = useCallback(() => {
    setIsConnectAtive(true);
    setRegisterMethod('passkey');
    closeRegister();
    setStepType('setWalletName');
  }, []);

  const startRegisterWithEOA = useCallback((address: any) => {
    setIsConnectAtive(true);
    setRegisterMethod('eoa');
    closeRegister();
    updateCreateInfo({
      eoaAddress: [address],
    });
    setStepType('setWalletName');
  }, []);

  const disconnectEOA = useCallback(async () => {
    await disconnectAsync();
    setIsConnectAtive(false);
    updateCreateInfo({
      eoaAddress: [],
    });
    // closeRegister()
  }, []);

  const startLoginWithPasskey = useCallback(async () => {
    try {
      setLoginMethod('passkey');
      setIsLoging(true);
      // closeLogin()
      const { credential } = await authenticate();
      const { credentialId } = credential;
      updateLoginInfo({
        signerId: credentialId,
        method: 'passkey',
        credential,
      });
      setIsLoging(false);
      closeLogin();
      const signerIdAddress = getSignerIdAddress();

      if (signerIdAddress[credentialId]) {
        openSelectAccount();
      } else {
        setStepType('importAccount');
      }
    } catch (error: any) {
      console.log('error', error.message);
      setIsLoging(false);
    }
  }, []);

  const startLoginWithEOA = useCallback(
    (connector: any) => {
      connect({ connector });
      setLoginMethod('eoa');
      updateLoginInfo({
        signerId: address,
        method: 'eoa',
        eoaAddress: address,
      });
      closeLogin();

      const signerIdAddress = getSignerIdAddress();

      if (signerIdAddress[address as any]) {
        openSelectAccount();
      } else {
        setStepType('importAccount');
      }
    },
    [address],
  );

  const startImportAccount = useCallback(() => {
    setIsSelectAccountOpen(false);
    setIsImportAccountOpen(true);
  }, []);

  const importWallet = useCallback(async (address: string) => {
    setIsImporting(true);
    const slotInfo = (
      await api.guardian.getSlotInfo({
        walletAddress: address,
      })
    ).data;

    retrieveSlotInfo(slotInfo);

    const addresses = await calcWalletAddressAllChains(0);
    console.log('addresses', addresses);
    setAddressList(addresses);

    const activeGuardianInfo = await getActiveGuardianHash(slotInfo.slotInitInfo)
    let activeGuardianHash

    if (activeGuardianInfo.pendingGuardianHash !== activeGuardianInfo.activeGuardianHash && activeGuardianInfo.guardianActivateAt && activeGuardianInfo.guardianActivateAt * 1000 < Date.now()) {
      activeGuardianHash = activeGuardianInfo.pendingGuardianHash
    } else {
      activeGuardianHash = activeGuardianInfo.activeGuardianHash
    }

    const res2 = await api.guardian.getGuardianDetails({ guardianHash: activeGuardianHash });
    const data = res2.data;

    if (!data) {
      console.log('No guardians found!')
    } else {
      const guardianDetails = data.guardianDetails;
      const guardianNames = data.guardianNames;

      updateGuardiansInfo({
        guardianDetails,
        guardianNames
      })
    }

    const loginInfo = getLoginInfo();

    if (loginInfo.method === 'eoa') {
      setEoas([loginInfo.eoaAddress]);
    } else {
      setCredentials([loginInfo.credential]);
    }

    console.log('loginInfo', loginInfo);
    setIsImporting(false);
    toast({
      title: 'Logged in',
      status: 'success',
    });
    setIsSelectAccountOpen(false);
    navigate('/dashboard');
  }, []);

  const jumpToHome = useCallback(() => {}, []);

  useEffect(() => {
    if (isConnected && address) {
      updateLoginInfo({
        signerId: address,
        method: 'eoa',
        eoaAddress: address,
      });
    }
  }, [isConnected, address]);

  useEffect(() => {
    // clear log data everytime visited
    clearLogData();
  }, []);

  if (stepType === 'importAccount') {
    return <ImportAccount importWallet={importWallet} isImporting={isImporting} back={() => setStepType('auth')} />;
  }

  if (stepType === 'setWalletName') {
    return <SetWalletName updateWalletName={updateWalletName} back={() => setStepType('auth')} />;
  }

  if (stepType === 'setPassKey' || registerMethod === 'passkey') {
    return <SetPasskey />;
  }

  return (
    <Flex width="100%" align={'center'} justify={'center'} minHeight="100vh" background="#F2F4F7">
      <SignHeader />
      <Box
        padding="20px"
        paddingTop="60px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={{ base: 'auto', 'md': 'calc(100vh - 58px)' }}
        flexDirection="column"
        width="100%"
      >
        <RoundContainer
          minHeight="544px"
          display="flex"
          padding="0"
          overflow="hidden"
          flexDirection={{ base: 'column', md: 'row' }}
          background="#FFFFFF"
        >
          <Box width={{ base: '100%', md: '50%' }} height="100%" p={{base: "32px", lg: "60px"}} pt={{base: "40px", lg: "100px"}}>
            <Heading marginBottom={{base: "24px", lg: "40px"}} fontSize={{base: "28px",md: "32px", lg: "40px"}}>
              Social recovery wallet for Ethereum
            </Heading>
            <Box marginBottom={{base: "50px", lg: "90px"}}>
              <Box marginBottom="18px" height="20px" display="flex">
                <Box marginRight="14px">
                  <PasskeyIcon />
                </Box>
                <Box>
                  <TextBody>Self-custody with passkey</TextBody>
                </Box>
              </Box>
              <Box marginBottom="18px" height="20px" display="flex">
                <Box marginRight="14px">
                  <AccountIcon />
                </Box>
                <Box>
                  <TextBody>Recover wallet through trusted friends</TextBody>
                </Box>
              </Box>
              <Box marginBottom="18px" height="20px" display="flex">
                <Box marginRight="14px">
                  <TransferIcon />
                </Box>
                <Box>
                  <TextBody>Pay gas fee with ERC-20 tokens and stablecoin</TextBody>
                </Box>
              </Box>
              <Box marginBottom="18px" height="20px" display="flex">
                <Box marginRight="14px">
                  <TokenIcon />
                </Box>
                <Box>
                  <TextBody>Cross-L2 experience secured by Ethereum</TextBody>
                </Box>
              </Box>
            </Box>
            <TextBody fontWeight="700" color="#818181">
              For more info, check out{' '}
              <Box
                as="a"
                target="_blank"
                href={`${import.meta.env.VITE_OFFICIAL_WEB_URL}#faq`}
                color="#FF2E79"
              >{`FAQs >`}</Box>
            </TextBody>
          </Box>
          <Box width={{ base: '100%', md: '50%' }} background="#F7F7FF" flex="1" display="flex" padding="60px">
            <Box width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
              <Box marginBottom="40px">
                <Image src={AuthImg} w="300px" h="200px" />
              </Box>
              <Box width="335px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Button width="100%" type="black" color="white" marginBottom="18px" size="xl" onClick={openRegister}>
                  Create account
                </Button>
                <Button width="100%" type="white" marginBottom="48px" onClick={openLogin} size="xl">
                  Login
                </Button>
                <TextBody onClick={openRecover} cursor="pointer">
                  Lost access to your account?
                </TextBody>
              </Box>
            </Box>
          </Box>
        </RoundContainer>
        <Box
          marginTop="40px"
          textAlign="center"
        >
          <TextBody fontWeight="600" color="#818181" fontSize="16px">
            If you have any questions, reach out to us at{' '}
            <Box as="a" href="mailto:support@soulwallet.io" color="#2D5AF6" textDecoration="underline">
              support@soulwallet.io
            </Box>
          </TextBody>

          <Flex gap="4" justify={'center'} align={'center'} mt="10px">
            {config.socials.map((item, idx) => (
              <Link
                href={item.link}
                target="_blank"
                key={idx}
                _hover={{
                  '> .icon': {
                    display: 'none',
                  },
                  '> .icon-activated': {
                    display: 'block',
                  },
                }}
              >
                <Image w="6" src={item.icon} className="icon" />
                <Image w="6" src={item.iconActivated} display={'none'} className="icon-activated" />
              </Link>
            ))}
          </Flex>
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
          activeLoginAccounts={activeLoginAccounts}
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
    </Flex>
  );
}
