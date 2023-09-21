import React, { ReactNode, useMemo, useState, useRef } from 'react';
import FullscreenContainer from '@/components/FullscreenContainer';
import { Box } from '@chakra-ui/react';
import Heading1 from '@/components/web/Heading1';
import TextBody from '@/components/web/TextBody';
import Button from '@/components/web/Button';
import TextButton from '@/components/web/TextButton';
import Steps from '@/components/web/Steps';
import PassKeyList from '@/components/web/PassKeyList';

export default function Create() {
  const [passKeys, setPassKeys] = useState([{}]);

  const onStepChange = (i: number) => {
    if (i == 0) {
      setPassKeys([{}]);
    }
  };

  const addPassKey = () => {
    setPassKeys([{}, {}]);
  };

  if (passKeys.length > 1) {
    return (
      <FullscreenContainer>
        <Box width="480px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Box marginBottom="12px" marginRight="24px">
            <Steps
              backgroundColor="#1E1E1E"
              foregroundColor="white"
              count={3}
              activeIndex={1}
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
          <PassKeyList passKeys={passKeys} />
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="20px">
          <Button onClick={() => {}} _styles={{ width: '282px', borderRadius: '40px' }}>
            Confirm
          </Button>
          <TextButton onClick={() => {}}>Add another passkey</TextButton>
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
        <PassKeyList passKeys={passKeys} />
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="20px">
        <Button onClick={addPassKey} _styles={{ width: '282px', borderRadius: '40px' }}>
          Add another passkey
        </Button>
        <TextButton onClick={() => {}}>Skip for now</TextButton>
      </Box>
    </FullscreenContainer>
  );
}
