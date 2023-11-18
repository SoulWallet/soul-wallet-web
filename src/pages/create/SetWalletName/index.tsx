import React, { useState } from 'react';
import FullscreenContainer from '@/components/FullscreenContainer';
import { Box, useToast } from '@chakra-ui/react';
import Heading1 from '@/components/web/Heading1';
import TextBody from '@/components/web/TextBody';
import Button from '@/components/web/Button';
import TextButton from '@/components/web/TextButton';
import Steps from '@/components/web/Steps';
import usePassKey from '@/hooks/usePasskey';
import { useCredentialStore } from '@/store/credential';
import FormInput from '@/components/web/Form/FormInput';
import useForm from '@/hooks/useForm';
import WalletCard from '@/components/web/WalletCard';
import ArrowLeftIcon from '@/components/Icons/ArrowLeft';
import api from '@/lib/api';
import useTools from '@/hooks/useTools';

const validate = (values: any) => {
  const errors: any = {};
  const { name } = values;

  if (!name) {
    errors.name = 'Invalid Name';
  }

  return errors;
};

export default function SetWalletName({ changeStep }: any) {
  const [loading, setLoading] = useState(false);
  const {clearPreviousData} = useTools();
  const { register } = usePassKey();
  const { addCredential, setWalletName, } = useCredentialStore();
  const toast = useToast();
  const { values, errors, invalid, onChange, onBlur, showErrors } = useForm({
    fields: ['name'],
    validate,
  });

  const handleNext = async () => {
    try {
      clearPreviousData();
      setLoading(true);
      // resetWallet();
      const walletName = values.name || 'Wallet_1';
      setWalletName(walletName)
      const credentialName = walletName;
      const credentialKey = await register(credentialName);
      addCredential(credentialKey);
      setLoading(false);

      changeStep(1)
    } catch (e: any) {
      setLoading(false);
      toast({
        title: e.message,
        status: 'error',
      });
    }
  };

  return (
    <FullscreenContainer>
      <Box width="480px" maxWidth="calc(100vw - 20px)" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box marginBottom="12px" marginRight="24px">
          <Steps
            backgroundColor="#1E1E1E"
            foregroundColor="white"
            count={3}
            activeIndex={0}
            marginTop="24px"
            onStepChange={changeStep}
            showBackButton
          />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Heading1>Create new wallet</Heading1>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginBottom="24px">
          <TextBody color="#1E1E1E" textAlign="center" fontSize="16px">
            Enter a name so that we can create a passkey wallet for you
          </TextBody>
        </Box>
        <FormInput
          label=""
          placeholder="Wallet_1"
          value={values.name}
          onChange={onChange('name')}
          onBlur={onBlur('name')}
          errorMsg={showErrors.name && errors.name}
          _styles={{  width: '320px' }}
          autoFocus={true}
          onEnter={handleNext}
        />
        <Button
          onClick={handleNext}
          _styles={{ width: '320px', marginTop: '12px' }}
          loading={loading}
          disabled={loading}
        >
          Continue with passkey
        </Button>
        <TextBody textAlign="center" marginTop="100px" color="#898989" fontSize="16px" fontWeight="600">Please note: Not all browsers support passkey functionality. For optimal performance, we recommend using Chrome or Safari.</TextBody>
      </Box>
    </FullscreenContainer>
  )
}
