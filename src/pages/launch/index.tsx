import { useState } from 'react'
import FullscreenContainer from '@/components/FullscreenContainer';
import { StepActionTypeEn, useStepDispatchContext, CreateStepEn, RecoverStepEn } from '@/context/StepContext';
import useBrowser from '@/hooks/useBrowser';
import { Box, Center, Flex, Text, Image, useToast } from '@chakra-ui/react';
import CreateWalletIcon from '@/components/Icons/CreateWallet';
import RecoverWalletIcon from '@/components/Icons/RecoverWallet';
import TextBody from '@/components/web/TextBody';
import storage from '@/lib/storage';
import Button from '@/components/web/Button';
import Logo from '@/components/web/Logo';
import usePassKey from '@/hooks/usePasskey';
import { useCredentialStore } from '@/store/credential';

export default function Launch() {
  const { register, authenticate, login } = usePassKey();
  const { navigate } = useBrowser();
  const toast = useToast();
  const { credentials } = useCredentialStore();
  const [isAuthing, setIsAuthing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const auth = async () => {
    if (credentials.length) {
      try {
        setIsAuthing(true);
        const credentialIds = credentials.map((credential: any) => credentials.id);
        const challenge = btoa('1234567890');
        await login(credentialIds, challenge);
        setIsAuthing(false);
      } catch (error: any) {
        console.log('error', error.message);
        setIsAuthing(false);
        toast({
          title: error.message,
          status: 'error',
        });
      }
      // navigate('create');
    } else {
      toast({
        title: 'No account yet',
        status: 'error',
      });
    }
  }

  const createWallet = async () => {
    try {
      setIsCreating(true);
      await register();
      setIsCreating(false);
      navigate('create');
    } catch (error: any) {
      console.log('error', error.message);
      setIsCreating(false);
      toast({
        title: error.message,
        status: 'error',
      });
    }
  }

  return (
    <Box width="100vw" height="100vh" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
      <Logo direction="column" />
      <Box display="flex" flexDirection="column" alignItems="center" margin="50px 0" paddingBottom="50px">
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button disabled={isAuthing} loading={isAuthing} onClick={auth} _styles={{ width: '282px', borderRadius: '40px', marginRight: '20px' }}>
            Login
          </Button>
          <Button disabled={isCreating} loading={isCreating} onClick={createWallet} _styles={{ width: '282px', borderRadius: '40px' }}>
            Create new wallet
          </Button>
        </Box>
        <TextBody color="#898989" marginTop="24px">
          Soul Wallet will create a smart contract wallet for you using passkeys.
        </TextBody>
      </Box>
    </Box>
  );
}
