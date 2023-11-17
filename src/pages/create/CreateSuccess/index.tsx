import React, { useState } from 'react';
import FullscreenContainer from '@/components/FullscreenContainer';
import { Box, Text, useToast } from '@chakra-ui/react';
import Heading1 from '@/components/web/Heading1';
import TextBody from '@/components/web/TextBody';
import Button from '@/components/web/Button';
import useBrowser from '@/hooks/useBrowser';
import CheckedIcon from '@/components/Icons/Checked';
import api from '@/lib/api';

const validate = (values: any) => {
  const errors: any = {};
  const { name } = values;

  if (!name) {
    errors.name = 'Invalid Name';
  }

  return errors;
};

export default function SetWalletName({ changeStep }: any) {
  const { navigate } = useBrowser();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleNext = async () => {
    navigate('/wallet');
  };

  return (
    <FullscreenContainer>
      <Box width="480px" maxWidth="calc(100vw - 20px)" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Heading1>🎉 Wallet is ready!</Heading1>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginBottom="40px">
          <TextBody color="#1E1E1E" textAlign="center" fontSize="16px">
            Navigate Ethereum with security and simplicity.
          </TextBody>
        </Box>
        <Box background="white" borderRadius="20px" padding="16px 32px" marginBottom="40px">
          <Box marginBottom="16px" display="flex">
            <Box width="20px" marginRight="10px"><CheckedIcon /></Box>
            <TextBody fontWeight="600">
              Soul Wallet is in <TextBody fontWeight="800" display="inline">public alpha test on testnet</TextBody> and still under development. Participate at your own risk.
            </TextBody>
          </Box>
          <Box marginBottom="16px" display="flex">
            <Box width="20px" marginRight="10px"><CheckedIcon /></Box>
            <TextBody fontWeight="600">
              Our early version might not be perfect and we can't cover any losses. But together we are heading west!
            </TextBody>
          </Box>
          <Box display="flex">
            <Box width="20px" marginRight="10px"><CheckedIcon /></Box>
            <TextBody fontWeight="600">
              Join us in exploring new features! We'd love to hear your thoughts and feedback.
            </TextBody>
          </Box>
        </Box>
        <Button
          onClick={handleNext}
          _styles={{ width: '320px', marginTop: '12px' }}
          loading={loading}
          disabled={loading}
        >
          See my wallet
        </Button>
        <Box>
          <TextBody width="320px" textAlign="center" marginTop="10px" fontSize="12px" fontWeight="600">
            By continuing, you agree to accept our <Text fontWeight="800" as="a" cursor="pointer">Public Alpha Testing Disclaimer</Text>
          </TextBody>
        </Box>
      </Box>
    </FullscreenContainer>
  )
}
