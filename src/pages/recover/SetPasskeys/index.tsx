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
import api from '@/lib/api';
import { defaultGuardianSafePeriod } from '@/config';

export default function SetPasskeys({ changeStep }: any) {
  const { navigate } = useBrowser();
  const { register } = usePassKey();
  const { chainConfig } = useConfig();
  const [isCreating, setIsCreating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { calcGuardianHash } = useKeystore();
  const {
    updateSlotInfo,
    setEditingGuardiansInfo,
    recoveringGuardiansInfo,
    getRecoveringGuardiansInfo,
    updateRecoveringGuardiansInfo
  } = useGuardianStore();
  const { walletName } = useCredentialStore();
  const { setAddressList } = useAddressStore();
  const { calcWalletAddress } = useSdk();
  const toast = useToast();
  const credentials = recoveringGuardiansInfo.credentials || []

  const addCredential = async (credential: any) => {
    const credentials = getRecoveringGuardiansInfo().credentials || []
    credentials.push(credential)

    updateRecoveringGuardiansInfo({
      credentials
    })
  }

  const changeCredentialName = async (credentialId: string, name: string) => {
    const credentials = getRecoveringGuardiansInfo().credentials || []
    const index = credentials.findIndex((item: any) => item.id === credentialId);

    if (index > -1) {
      credentials[index].name = name;

      updateRecoveringGuardiansInfo({
        credentials
      })
    }
  }

  const createWallet = async () => {
    try {
      setIsCreating(true);
      const credentials = getRecoveringGuardiansInfo().credentials || []
      const credentialKey = await register(walletName);
      addCredential(credentialKey)
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

  const handleNext = async () => {
    const hasGuardians = recoveringGuardiansInfo.guardianDetails && recoveringGuardiansInfo.guardianDetails.guardians && !!recoveringGuardiansInfo.guardianDetails.guardians.length

    if (hasGuardians) {
      setIsConfirming(true)
      const keystore = chainConfig.contracts.l1Keystore;
      const credentials = recoveringGuardiansInfo.credentials || []
      const initialKeys = await Promise.all(credentials.map((credential: any) => {
        console.log('credential.publicKey', credential.publicKey)
        return credential.publicKey
      }))
      const newOwners = L1KeyStore.initialKeysToAddress(initialKeys);
      const slot = recoveringGuardiansInfo.slot
      const slotInitInfo = recoveringGuardiansInfo.slotInitInfo
      const guardianDetails = recoveringGuardiansInfo.guardianDetails

      const params = {
        guardianDetails,
        slot,
        slotInitInfo,
        keystore,
        newOwners
      }

      console.log('createRecoverRecord', params);

      const res = await api.guardian.createRecoverRecord(params)
      const recoveryRecordID = res.data.recoveryRecordID
      const recoveryRecord = await api.guardian.getRecoverRecord({ recoveryRecordID })
      updateRecoveringGuardiansInfo({
        recoveryRecordID,
        recoveryRecord,
        enabled: false,
      });
      setTimeout(() => {
        setIsConfirming(false)
        changeStep(4)
      })
    } else {
      changeStep(3)
    }

  }

  const createInitialWallet = async () => {
    const newAddress = await calcWalletAddress(0);
    // const walletName = `Account 1`;
    setAddressList([{ address: newAddress, activatedChains: [],}]);
    setEditingGuardiansInfo({});
  };

  const createInitialSlotInfo = async () => {
    const initialKeys = await Promise.all(credentials.map((credential: any) => credential.publicKey))
    const initialGuardianHash = calcGuardianHash([], 0);
    // const salt = ethers.ZeroHash;
    let initialGuardianSafePeriod = toHex(defaultGuardianSafePeriod);
    const slotInitInfo = {
      initialKeys,
      initialGuardianHash,
      initialGuardianSafePeriod,
    };
    updateSlotInfo(slotInitInfo)
    console.log('createSlotInfo', initialKeys, slotInitInfo)
  };

  const onConfirm = async () => {
    try {
      setIsConfirming(true)
      await createInitialSlotInfo()
      await createInitialWallet()
      setIsConfirming(false)
      navigate('/wallet')
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
      <Box w={{base: "360px", md: "480px"}} maxWidth="calc(100vw - 20px)" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box marginBottom="12px">
          <Steps
            backgroundColor="#1E1E1E"
            foregroundColor="white"
            count={4}
            activeIndex={1}
            marginTop="24px"
          />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Heading1 textAlign="center">Welcome! Your passkey is ready.</Heading1>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <TextBody color="#1E1E1E" textAlign="center">
            Add a second passkey from another device — it's free now, but will cost gas fee later. More devices enhance wallet security and protect against access loss if one device is lost or damaged.
          </TextBody>
        </Box>
      </Box>
      <Box margin="48px 0">
        <PassKeyList passKeys={credentials} setPassKeyName={changeCredentialName} />
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="20px">
        <Button onClick={createWallet} _styles={{ width: '320px', marginBottom: '12px', background: '#9648FA' }} _hover={{ background: '#9648FA' }} disabled={isCreating} loading={isCreating}>
          {!credentials.length ? 'Add passkey' : 'Add another passkey'}
        </Button>
        <Button onClick={handleNext} _styles={{ width: '320px' }} loading={isConfirming} disabled={isCreating || isConfirming || !credentials.length}>
          Continue
        </Button>
      </Box>
    </FullscreenContainer>
  );
}
