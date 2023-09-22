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

export default function Create() {
  const { register } = usePassKey();
  const { credentials, changeCredentialName } = useCredentialStore();
  const [isCreating, setIsCreating] = useState(false);
  const toast = useToast();

  const onStepChange = (i: number) => {
    if (i == 0) {
      // setPassKeys([{}]);
    }
  };

  const setPassKeyName = ({ id, name }) => {
    changeCredentialName(id, name);
  };
  console.log('credentials', credentials)

  const createWallet = async () => {
    try {
      setIsCreating(true);
      await register();
      setIsCreating(false);
      // navigate('create');
    } catch (error: any) {
      console.log('error', error.message);
      setIsCreating(false);
      toast({
        title: error.message,
        status: 'error',
      });
    }
  }

  if (credentials.length > 1) {
    return (
      <FullscreenContainer>
        <Box width="480px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Box marginBottom="12px" marginRight="24px">
            <Steps
              backgroundColor="#1E1E1E"
              foregroundColor="white"
              count={3}
              activeIndex={2}
              marginTop="24px"
              onStepChange={onStepChange}
              showBackButton
            />
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            <Heading1>Great, you have multiple passkeys!</Heading1>
          </Box>
        </Box>
        <Box margin="48px 0">
          <PassKeyList passKeys={credentials} setPassKeyName={setPassKeyName} />
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="20px">
          <Button onClick={() => {}} _styles={{ width: '282px', borderRadius: '40px' }}>
            Confirm
          </Button>
          <TextButton onClick={createWallet}  disabled={isCreating} loading={isCreating}>Add another passkey</TextButton>
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
            count={3}
            activeIndex={1}
            marginTop="24px"
            onStepChange={onStepChange}
          />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Heading1 marginBottom="0">Welcome, </Heading1>
          <Heading1 textAlign="center">you have successfully created a passkey!</Heading1>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <TextBody color="#1E1E1E">
            Next, try signing in with your passkey on a different device! One passkey won’t be backed up. If you lose
            it, you may be locked out of your account.
          </TextBody>
        </Box>
      </Box>
      <Box margin="48px 0">
        <PassKeyList passKeys={credentials} setPassKeyName={setPassKeyName} />
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="20px">
        <Button onClick={createWallet} _styles={{ width: '282px', borderRadius: '40px' }} disabled={isCreating} loading={isCreating}>
          {isCreating ? 'Adding another passkey' : 'Add another passkey'}
        </Button>
        <TextButton onClick={() => {}}>Skip for now</TextButton>
      </Box>
    </FullscreenContainer>
  );
}
