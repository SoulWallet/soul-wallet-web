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

export default function SetPasskeys({ changeStep }: any) {
  const { register } = usePassKey();
  const {
    addCredential,
    credentials,
    changeCredentialName,
    walletName,
  } = useCredentialStore();
  const [isCreating, setIsCreating] = useState(false);
  const toast = useToast();

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
    changeStep(2)
  }

  return (
    <FullscreenContainer>
      <Box width="480px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box marginBottom="12px">
          <Steps
            backgroundColor="#1E1E1E"
            foregroundColor="white"
            count={3}
            activeIndex={1}
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
        <Button disabled={!credentials.length} onClick={onConfirm} _styles={{ width: '320px' }}>
          Continue
        </Button>
      </Box>
    </FullscreenContainer>
  );
}
