import React, { useState } from 'react';
import FullscreenContainer from '@/components/FullscreenContainer';
import { Box, useToast } from '@chakra-ui/react';
import Heading1 from '@/components/web/Heading1';
import TextBody from '@/components/web/TextBody';
import Button from '@/components/web/Button';
import TextButton from '@/components/web/TextButton';
import Steps from '@/components/web/Steps';
import PassKeyList from '@/components/web/PassKeyList';
import usePassKey from '@/hooks/usePasskey';
import { useCredentialStore } from '@/store/credential';
import useBrowser from '@/hooks/useBrowser';
import useConfig from '@/hooks/useConfig';
import useKeystore from '@/hooks/useKeystore';
import { useGuardianStore } from '@/store/guardian';
import { ethers } from 'ethers';
import { L1KeyStore } from '@soulwallet/sdk';
import { toHex } from '@/lib/tools';
import useSdk from '@/hooks/useSdk';
import { useAddressStore } from '@/store/address';
import WarningIcon from '@/components/Icons/Warning';
import SecureIcon from '@/components/Icons/Secure';
import api from '@/lib/api';

export default function SetGuardians({ changeStep }: any) {
  const { navigate } = useBrowser();
  const { register } = usePassKey();
  const { chainConfig } = useConfig();
  const { addCredential, credentials, changeCredentialName, setSelectedCredentialId, walletName, } = useCredentialStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { calcGuardianHash } = useKeystore();
  const { setSlotInfo, setGuardiansInfo, setEditingGuardiansInfo } = useGuardianStore();
  const { setSelectedAddress, setAddressList } = useAddressStore();
  const { calcWalletAddress } = useSdk();
  const [status, setStatus] = useState<string>('intro');
  const toast = useToast();

  const startBackup = () => {
    setStatus('backuping')
  }

  const startEdit = () => {
    setStatus('editing')
  }

  const createWallet = async () => {
    try {
      setIsCreating(true);
      const credentialKey = await register(walletName);
      addCredential(credentialKey);
      setIsCreating(false);
      // navigate('/create');
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

  const createInitialWallet = async () => {
    const newAddress = await calcWalletAddress(0);
    const walletName = `Account 1`;
    setAddressList([{ title: walletName, address: newAddress, activatedChains: []}]);
    setEditingGuardiansInfo({});
    setSelectedCredentialId(credentials[0].id)
  };

  const createInitialSlotInfo = async () => {
    const keystore = chainConfig.contracts.l1Keystore;
    const initialKeys = await Promise.all(credentials.map((credential: any) => credential.publicKey))
    const initialGuardianHash = calcGuardianHash([], 0);
    const salt = ethers.ZeroHash;
    let initialGuardianSafePeriod = toHex(300);
    const initalkeysAddress = L1KeyStore.initialKeysToAddress(initialKeys);
    const initialKeyHash = L1KeyStore.getKeyHash(initalkeysAddress);
    const slot = L1KeyStore.getSlot(initialKeyHash, initialGuardianHash, initialGuardianSafePeriod);

    const slotInfo = {
      initialKeys,
      initialGuardianHash,
      initialGuardianSafePeriod,
      initalkeysAddress,
      initialKeyHash,
      slot
    };

    const walletInfo = {
      keystore,
      slot,
      slotInitInfo: {
        initialKeyHash,
        initialGuardianHash,
        initialGuardianSafePeriod
      },
      initialKeys: initalkeysAddress
    };

    const guardiansInfo = {
      keystore,
      slot,
      guardianHash: initialGuardianHash,
      guardianNames: [],
      guardianDetails: {
        guardians: [],
        threshold: 0,
        salt,
      },
    };

    const result = await api.guardian.backupSlot(walletInfo)
    setGuardiansInfo(guardiansInfo)
    setSlotInfo(slotInfo)
    console.log('createSlotInfo', slotInfo, walletInfo, guardiansInfo, result)
  };

  const onConfirm = async () => {
    try {
      setIsConfirming(true)
      await createInitialSlotInfo()
      await createInitialWallet()
      setIsConfirming(false)
      if(location.search){
        navigate({pathname: '/popup', search: location.search})
      }else{
        navigate('/wallet')
      }
    } catch (error: any) {
      setIsConfirming(false)
      console.log('error', error)
      toast({
        title: error.message,
        status: 'error',
      });
    }
  }

  return (
    <FullscreenContainer>
      <Box width="calc(100% - 40px)" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box marginBottom="12px">
          <Steps
            backgroundColor="#1E1E1E"
            foregroundColor="white"
            count={3}
            activeIndex={2}
            marginTop="24px"
          />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Heading1>Setup guardians for social recovery</Heading1>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginBottom="24px">
          <TextBody color="#1E1E1E" textAlign="center" fontSize="16px">
            Ensure your wallet's safety with a last step.
          </TextBody>
        </Box>
      </Box>
      <Box width="calc(100% - 40px)" bg="#EDEDED" borderRadius="20px" padding="45px" paddingRight="2px" display="flex" alignItems="flex-start" justifyContent="space-around" margin="0 auto">
        <Box width="40%" marginRight="45px">
          <Box marginBottom="16px">
            <Box display="flex" alignItems="center" justifyContent="flex-start">
              {/* <ArrowRightIcon /> */}
              <TextBody fontSize="16px" fontWeight="800">
                What is Soul Wallet guardian?
              </TextBody>
            </Box>
            <Box maxWidth="560px">
              <TextBody fontSize="14px" fontWeight="700">
                Guardians are Ethereum wallet addresses that assist you in recovering your wallet if needed. Soul Wallet replaces recovery phrases with guardian-signature social recovery, improving security and usability.
              </TextBody>
            </Box>
          </Box>
          <Box marginBottom="16px">
            <Box display="flex" alignItems="center" justifyContent="flex-start">
              <TextBody fontSize="16px" fontWeight="800">
                Who can be my guardians?
              </TextBody>
            </Box>
            <Box maxWidth="560px">
              <TextBody fontSize="14px" fontWeight="700">
                Choose trusted friends or use your existing Ethereum wallets as guardians. You can setup using regular Ethereum wallets (e.g MetaMask, Ledger, Coinbase Wallet, etc) and other Soul Wallets as your guardians. If choosing a Soul Wallet as your guardian, ensure it's activated on Ethereum for social recovery.
              </TextBody>
            </Box>
          </Box>
          <Box>
            <Box display="flex" alignItems="center" justifyContent="flex-start">
              <TextBody fontSize="16px" fontWeight="800">
                What is wallet recovery?
              </TextBody>
            </Box>
            <Box maxWidth="560px">
              <TextBody fontSize="14px" fontWeight="700">
                If your Soul Wallet is lost or stolen, social recovery helps you easily retrieve wallets with guardian signatures. The guardian list will be stored in an Ethereum-based keystore contract.
              </TextBody>
            </Box>
          </Box>
        </Box>
        <Box as="video" width="50%" aspectRatio="auto" borderRadius="24px" controls>
          <source src="https://static-assets.soulwallet.io/videos/guardians-and-recovery-intro.webm" type="video/webm" />
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="20px">
        <Button _styles={{ width: '300px', marginBottom: '12px' }} disabled={isCreating} loading={isCreating}>
          Set up now
        </Button>
        <TextButton loading={isConfirming} disabled={isConfirming || !credentials.length} onClick={onConfirm} _styles={{ width: '300px' }}>
          Set up later
        </TextButton>
      </Box>
    </FullscreenContainer>
  );
}
