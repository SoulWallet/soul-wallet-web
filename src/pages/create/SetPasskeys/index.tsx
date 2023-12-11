import { useState } from 'react';
import FullscreenContainer from '@/components/FullscreenContainer';
import { Box, useToast } from '@chakra-ui/react';
import Heading1 from '@/components/web/Heading1';
import TextBody from '@/components/web/TextBody';
import Button from '@/components/web/Button';
import Steps from '@/components/web/Steps';
import PassKeyList from '@/components/web/PassKeyList';
import usePassKey from '@/hooks/usePasskey';
import { useCredentialStore } from '@/store/credential';
import WarningIcon from '@/components/Icons/Warning';
import SecureIcon from '@/components/Icons/Secure';
import useConfig from '@/hooks/useConfig';
import useKeystore from '@/hooks/useKeystore';
import { L1KeyStore } from '@soulwallet/sdk';
import api from '@/lib/api';
import { useSettingStore } from '@/store/setting';
import useSdk from '@/hooks/useSdk';
import { useAddressStore } from '@/store/address';
import { useGuardianStore } from '@/store/guardian';
import { defaultGuardianSafePeriod } from '@/config';
import { useSlotStore } from '@/store/slot';

const toHex = (num: any) => {
  let hexStr = num.toString(16);

  if (hexStr.length % 2 === 1) {
    hexStr = '0' + hexStr;
  }

  hexStr = '0x' + hexStr;

  return hexStr;
};

export default function SetPasskeys({ changeStep }: any) {
  const { register } = usePassKey();
  const {
    addCredential,
    credentials,
    changeCredentialName,
    walletName,
    setSelectedCredentialId,
  } = useCredentialStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const toast = useToast();
  const { chainConfig } = useConfig();
  const { calcGuardianHash } = useKeystore();
  const { getGuardiansInfo, setGuardiansInfo, setEditingGuardiansInfo } = useGuardianStore();
  const { saveAddressName } = useSettingStore();
  const { calcWalletAddress } = useSdk();
  const { setSelectedAddress, setAddressList } = useAddressStore();
  const { setSlotInfo } = useSlotStore()

  const createInitialSlotInfo = async () => {
    const keystore = chainConfig.contracts.l1Keystore;
    const initialKeys = await Promise.all(credentials.map((credential: any) => credential.publicKey))

    const guardiansInfo = getGuardiansInfo()
    const initialGuardianHash = guardiansInfo.guardianHash
    const initialGuardianSafePeriod = guardiansInfo.guardianSafePeriod ||  toHex(defaultGuardianSafePeriod);
    const initialKeysAddress = L1KeyStore.initialKeysToAddress(initialKeys);
    const initialKeyHash = L1KeyStore.getKeyHash(initialKeysAddress);
    const slot = L1KeyStore.getSlot(initialKeyHash, initialGuardianHash, initialGuardianSafePeriod);

    const slotInfo = {
      initialKeys,
      initialGuardianHash,
      initialGuardianSafePeriod,
      initialKeysAddress,
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
      initialKeys: initialKeysAddress
    };

    const result = await api.guardian.backupSlot(walletInfo)
    setSlotInfo(slotInfo)
    console.log('createSlotInfo', slotInfo, walletInfo, result)
    // saveAddressName(slotInfo.slot, walletName);
  };

  const createInitialWallet = async () => {
    const newAddress = await calcWalletAddress(0);
    setAddressList([{ address: newAddress, activatedChains: [] }]);
    saveAddressName(newAddress, walletName);
    setEditingGuardiansInfo({});
    setSelectedCredentialId(credentials[0].id)
  };

  const createWallet = async () => {
    try {
      setIsCreating(true);
      const credentialKey = await register(walletName);
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

  const onConfirm = async () => {
    try {
      setIsInitializing(true)
      await createInitialSlotInfo()
      await createInitialWallet()
      setIsInitializing(false)
      changeStep(3)
    } catch (error: any) {
      setIsInitializing(false)
      toast({
        title: error.message,
        status: 'error',
      });
    }
  }

  if (!credentials || !credentials.length) {
    return (
      <FullscreenContainer padding="16px">
        <Box maxW="480px" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
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
            <Heading1>{`Setup passkey for < ${walletName} >`}</Heading1>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="20px">
          <Button onClick={createWallet} _styles={{ width: '320px', marginBottom: '12px' }} disabled={isCreating} loading={isCreating}>
            Setup now
          </Button>
        </Box>
      </FullscreenContainer>
    );
  }

  return (
    <FullscreenContainer padding="16px">
      <Box maxW="480px" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
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
          <Heading1>Welcome, {walletName}!</Heading1>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" marginTop="16px">
          {(!credentials.length || credentials.length === 1) && (
            <Box background="rgba(255, 4, 32, 0.08)" borderRadius="20px" padding="24px 16px 24px 16px" display="flex" alignItems="center" justifyContent="center">
              <Box display="flex" alignItems="center" justifyContent="center" margin="11px" padding="10px" marginRight="16px">
                <WarningIcon />
              </Box>
              <TextBody color="black" textAlign="left" fontWeight="600" fontSize="16px">
                You only have one passkey, If you lose it, you may be locked out of your account.
              </TextBody>
            </Box>
          )}
          {credentials.length > 1 && (
            <Box background="rgba(26, 210, 15, 0.08)" borderRadius="20px" padding="24px 16px 24px 16px" display="flex" alignItems="center" justifyContent="center">
              <Box display="flex" alignItems="center" justifyContent="center" margin="11px" padding="10px" marginRight="16px">
                <SecureIcon />
              </Box>
              <TextBody color="black" textAlign="left" fontWeight="600" fontSize="16px">
                Awesome! Having several passkeys means there's no stress if you happen to lose one.
              </TextBody>
            </Box>
          )}
        </Box>
      </Box>
      <Box margin="48px 0">
        <PassKeyList passKeys={credentials} setPassKeyName={changeCredentialName} />
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="20px">
        <Button onClick={createWallet} _styles={{ width: '320px', marginBottom: '12px', background: '#9648FA' }} _hover={{ background: '#9648FA' }} disabled={isCreating} loading={isCreating}>
          {credentials.length ? 'Add another passkey' : 'Add passkey'}
        </Button>
        <Button disabled={!credentials.length || isInitializing} onClick={onConfirm} _styles={{ width: '320px' }} loading={isInitializing}>
          Continue
        </Button>
      </Box>
    </FullscreenContainer>
  );
}
