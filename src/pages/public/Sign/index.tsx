import React, { useState, useCallback, useEffect } from 'react';
import { Box, Text, Image, useToast, Grid, GridItem, Flex, Popover, PopoverTrigger, Link } from '@chakra-ui/react';
// import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import IconLogo from '@/assets/logo-all-v3.svg';
import IntroImg from '@/assets/Intro.jpg';
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
import { useAccount, useConfig, useConnect, useDisconnect, useSignTypedData, useSwitchChain } from 'wagmi';
import { useTempStore } from '@/store/temp';
import { useAddressStore } from '@/store/address';
import { useSettingStore } from '@/store/setting';
import usePassKey from '@/hooks/usePasskey';
import api from '@/lib/api';
import useWallet from '@/hooks/useWallet';
import useSdk from '@/hooks/useSdk';
import { useSignerStore } from '@/store/signer';
import AuthImg from '@/assets/auth.svg';
import SignatureRequestImg from '@/assets/icons/signature-request.svg';
import { useParams } from 'react-router-dom';
import WarningIcon from '@/components/Icons/Warning';
import SuccessIcon from '@/components/Icons/Success';
import { metaMask } from 'wagmi/connectors';
import { L1KeyStore } from '@soulwallet/sdk';
import { useEthersSigner } from '@/hooks/useEthersSigner';
import { useChainStore } from '@/store/chain';

const validateSigner = (recoveryRecord: any, address: any) => {
  if (!recoveryRecord) return;
  const guardians = recoveryRecord.guardianDetails.guardians;
  console.log('validateSigner', guardians, String(address).toLowerCase());
  return !!guardians && guardians.indexOf(String(address).toLowerCase()) !== -1;
};

const checkSigned = (recoveryRecord: any, address: any) => {
  if (!recoveryRecord) return;
  const guardianSignatures = recoveryRecord.guardianSignatures;
  return guardianSignatures.map((item: any) => item.guardian).includes(String(address).toLowerCase());
};

export const SignHeader = ({ url }: { url?: string }) => {
  return (
    <Box height="58px" pos="absolute" top="0" left={'0'} right={'0'} padding="10px 20px">
      <Link
        display="inline-block"
        {...(url
          ? {
              href: url,
            }
          : {
              cursor: 'default',
            })}
      >
        <Image src={IconLogo} h="44px" />
      </Link>
    </Box>
  );
};

export default function Sign() {
  const { recoverId } = useParams();
  const [recoveryRecord, setRecoveryRecord] = useState<any>();
  const { address, isConnected, isConnecting, chainId: connectedChainId } = useAccount();
  const { connectAsync } = useConnect();
  const [signing, setSigning] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isSigned, setIsSigned] = useState<any>(false);
  const toast = useToast();
  const { switchChain } = useSwitchChain();
  const ethersSigner = useEthersSigner();

  const isValidSigner = validateSigner(recoveryRecord, address);
  console.log('recoverId', recoveryRecord, isSigned);

  const loadRecord = async (recoverId: any) => {
    try {
      const res = await api.guardian.getRecoverRecord({ recoveryRecordID: recoverId });
      const recoveryRecord = res.data;
      setLoaded(true);
      setRecoveryRecord(recoveryRecord);
    } catch (error: any) {
      console.log('error', error.message);
    }
  };

  useEffect(() => {
    setIsSigned(checkSigned(recoveryRecord, address));
  }, [recoveryRecord, address]);

  useEffect(() => {
    if (recoverId) {
      loadRecord(recoverId);
      const interval = setInterval(() => loadRecord(recoverId), 5000);
      return () => clearInterval(interval);
    }
  }, [recoverId]);

  const connectWallet = useCallback(async () => {
    // await disconnectAsync()
    await connectAsync({ connector: metaMask() });
  }, []);

  const sign = useCallback(async () => {
    try {
      if (!recoveryRecord) return;

      setSigning(true);
      // await ensureChainId()
      const domain = {
        name: 'KeyStore',
        version: '1',
        chainId: recoveryRecord.chainId,
        verifyingContract: recoveryRecord.keystore,
      };

      // SocialRecovery(bytes32 keyStoreSlot,uint256 nonce,bytes32 newKey)
      // SetKey(bytes32 keyStoreSlot,uint256 nonce,bytes32 newKey)
      const types = {
        SocialRecovery: [
          { name: 'keyStoreSlot', type: 'bytes32' },
          { name: 'nonce', type: 'uint256' },
          { name: 'newSigner', type: 'bytes32' },
        ],
      };

      const newKeyHash = L1KeyStore.getKeyHash(recoveryRecord.newOwners);
      console.log('L1KeyStore', newKeyHash);

      const message = {
        keyStoreSlot: recoveryRecord.slot,
        nonce: recoveryRecord.nonce,
        newSigner: newKeyHash,
      };

      const signer = await ethersSigner;
      const signature = await signer?.signTypedData(domain, types, message);
      // const signature = await signTypedDataAsync({ domain, types, primaryType: 'SocialRecovery', message });
      // console.log('to sign type', domain, types, message, signature)
      // const signature = await signMessage(recoverId);
      const res: any = await api.guardian.guardianSign({
        recoveryRecordID: recoverId,
        guardianAddress: address,
        signature: signature,
      });

      if (res.code === 200) {
        toast({
          title: 'Signed',
          status: 'success',
        });
        setIsSigned(true);
      }
      setSigning(false);
    } catch (error: any) {
      setSigning(false);
      let message = error.message;

      if (message && message.indexOf('user rejected action') !== -1) {
        message = 'User rejected action';
      }

      toast({
        title: message,
        status: 'error',
      });
      console.log('error', message);
    }
  }, [recoveryRecord, address]);

  if (!loaded) {
    return (
      <Flex justify="center" align="center" width="100%" minHeight="100vh" background="#F2F4F7">
        <SignHeader />
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
                  <Box fontSize="32px" fontWeight="700" lineHeight={'normal'} fontFamily="Nunito">
                    Loading...
                  </Box>
                </Box>
              </Box>
            </Box>
          </RoundContainer>
        </Box>
      </Flex>
    );
  }

  if (!!isSigned) {
    return (
      <Flex justify="center" align="center" width="100%" minHeight="100vh" background="#F2F4F7">
        <SignHeader />
        <Box
          padding="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="calc(100vh - 58px)"
          flexDirection="column"
          width="100%"
          marginTop="60px"
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
                  <Box
                    marginBottom="22px"
                    width="120px"
                    height="120px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <SuccessIcon size="120" />
                  </Box>
                  <Box fontSize="32px" fontWeight="700" lineHeight={'normal'} fontFamily="Nunito">
                    Thank you, signature received!
                  </Box>
                  <Box
                    fontSize="14px"
                    fontWeight="400"
                    fontFamily="Nunito"
                    lineHeight={'normal'}
                    color="black"
                    marginTop="34px"
                    maxWidth="500px"
                  >
                    Recover for: {recoveryRecord.addresses.map((item: any) => item.address).join(', ')}
                  </Box>
                </Box>
                {/* <Box
                    width="320px"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    marginTop="30px"
                    >
                    <Button width="100%" type="black" color="white" marginBottom="18px" onClick={() => {}} size="xl">
                    Close
                    </Button>
                    </Box> */}
              </Box>
            </Box>
          </RoundContainer>
        </Box>
      </Flex>
    );
  }

  if (!!isConnected && !isValidSigner) {
    return (
      <Flex justify="center" align="center" width="100%" minHeight="100vh" background="#F2F4F7">
        <SignHeader />
        <Box
          padding="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="calc(100vh - 58px)"
          flexDirection="column"
          width="100%"
          paddingTop="60px"
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
                  <Box
                    marginBottom="22px"
                    width="120px"
                    height="120px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <WarningIcon size="80" />
                  </Box>
                  <Box fontSize="32px" fontWeight="700" lineHeight={'normal'} fontFamily="Nunito">
                    You’re not the guardian
                  </Box>
                  <Box
                    fontSize="14px"
                    fontWeight="400"
                    fontFamily="Nunito"
                    lineHeight={'normal'}
                    color="black"
                    marginTop="34px"
                  >
                    The wallet you connected is not the guardian for the recovery wallet. Please double check.
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
                  <Button width="100%" type="black" color="white" marginBottom="18px" onClick={connectWallet} size="xl">
                    Connect another wallet
                  </Button>
                </Box>
              </Box>
            </Box>
          </RoundContainer>
        </Box>
      </Flex>
    );
  }

  const mainnetChainId = Number(import.meta.env.VITE_MAINNET_CHAIN_ID);

  return (
    <Flex justify="center" align="center" width="100%" minHeight="100vh" background="#F2F4F7">
      <SignHeader />
      <Box
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 58px)"
        flexDirection="column"
        width="100%"
        paddingTop="60px"
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
                  <Image src={SignatureRequestImg} width="120px" height="120px" />
                </Box>
                <Box fontSize="32px" fontWeight="700" lineHeight={'normal'} fontFamily="Nunito">
                  Signature request
                </Box>
                {address && (
                  <Box fontSize="14px" fontWeight="500" fontFamily="Nunito" color="rgba(0, 0, 0, 0.80)" wordBreak="break-all">
                    From: {address}
                  </Box>
                )}
                <Box
                  fontSize="14px"
                  fontWeight="400"
                  fontFamily="Nunito"
                  color="black"
                  marginTop="34px"
                  lineHeight={'normal'}
                  wordBreak="break-all"
                >
                  Your friend's wallet is lost. As their guardian, please connect your wallet and confirm request to
                  assist with their wallet recovery.
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
                  connectedChainId === mainnetChainId ? (
                    <Button
                      width="100%"
                      type="black"
                      color="white"
                      marginBottom="18px"
                      onClick={sign}
                      loading={signing}
                      disabled={signing}
                      size="xl"
                    >
                      Sign typed data
                    </Button>
                  ) : (
                    <Button
                      width="100%"
                      type="black"
                      color="white"
                      marginBottom="18px"
                      onClick={() => switchChain({ chainId: mainnetChainId })}
                      size="xl"
                    >
                      Switch chain
                    </Button>
                  )
                ) : (
                  <Button
                    width="100%"
                    type="black"
                    color="white"
                    marginBottom="18px"
                    onClick={connectWallet}
                    disabled={isConnecting}
                    size="xl"
                  >
                    {isConnecting ? 'Connecting' : 'Connect wallet'}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </Flex>
  );
}
