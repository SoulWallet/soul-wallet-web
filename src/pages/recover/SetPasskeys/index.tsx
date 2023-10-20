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

export default function SetPasskeys({ changeStep }: any) {
  const { navigate } = useBrowser();
  const { register, getCoordinates } = usePassKey();
  const { chainConfig } = useConfig();
  const { credentials, changeCredentialName } = useCredentialStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { calcGuardianHash } = useKeystore();
  const { updateSlotInfo, setEditingGuardiansInfo } = useGuardianStore();
  const { setSelectedAddress, setAddressList } = useAddressStore();
  const { calcWalletAddress } = useSdk();
  const toast = useToast();

  const onStepChange = (i: number) => {
    if (i == 0) {
      // navigate('/launch')
    } else if (i == 1) {
      setIsReady(false);
    }
  };

  const createWallet = async () => {
    try {
      setIsCreating(true);
      await register();
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

  const onSkip = () => {
    // setIsReady(true)
  }

  const handleNext = async () => {
    changeStep(2)
  }

  const createInitialWallet = async () => {
    const newAddress = await calcWalletAddress(0);
    const walletName = `Account 1`;
    setAddressList([{ title: walletName, address: newAddress, activatedChains: [], allowedOrigins: [] }]);
    console.log('createInitialWallet', newAddress);
    setSelectedAddress(newAddress);
    setEditingGuardiansInfo({});
  };

  const createInitialSlotInfo = async () => {
    const initialKeys = await Promise.all(credentials.map((credential: any) => getCoordinates(credential.publicKey)))
    const initialGuardianHash = calcGuardianHash([], 0);
    const salt = ethers.ZeroHash;
    let initialGuardianSafePeriod = toHex(L1KeyStore.days * 2);
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

  if (isReady) {
    return (
      <FullscreenContainer>
        <Box width="480px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            <TextBody color="#1E1E1E" textAlign="center" fontSize="24px">
              Your passkey indicates that you already have an active wallet account on this device
            </TextBody>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="20px">
          <Button loading={isConfirming} disabled={isConfirming} onClick={onConfirm} _styles={{ width: '320px' }}>
            Go to wallet
          </Button>
        </Box>
      </FullscreenContainer>
    );
  }

  return (
    <FullscreenContainer>
      <Box width="480px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box marginBottom="12px">
          <Steps
            backgroundColor="#1E1E1E"
            foregroundColor="white"
            count={4}
            activeIndex={1}
            marginTop="24px"
            showBackButton
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
          Add another passkey
        </Button>
        <Button onClick={handleNext} _styles={{ width: '320px' }} disabled={isCreating}>
          Continue
        </Button>
      </Box>
    </FullscreenContainer>
  );
}
