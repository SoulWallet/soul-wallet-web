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
import { useAddressStore } from '@/store/address';
import useBrowser from '@/hooks/useBrowser';
import useConfig from '@/hooks/useConfig';
import useKeystore from '@/hooks/useKeystore';
import { useGuardianStore } from '@/store/guardian';
import { ethers } from 'ethers';
import { L1KeyStore } from '@soulwallet/sdk';
import { toHex } from '@/lib/tools';
import useSdk from '@/hooks/useSdk';
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
  const { navigate } = useBrowser();
  const [loading, setLoading] = useState(false);
  const { register } = usePassKey();
  const { setWalletName, } = useCredentialStore();
  const { clearPreviousData } = useTools();
  const toast = useToast();
  const { values, errors, invalid, onChange, onBlur, showErrors } = useForm({
    fields: ['name'],
    validate,
  });
  const { updateRecoveringGuardiansInfo, recoveringGuardiansInfo, getRecoveringGuardiansInfo } = useGuardianStore();
  const credentials = recoveringGuardiansInfo.credentials || []
  const disabled = loading || invalid;

  const addCredential = async (credential: any) => {
    const credentials = []
    credentials.push(credential)

    updateRecoveringGuardiansInfo({
      credentials
    })
  }

  const handleNext = async () => {
    try {
      // clearPreviousData();
      setLoading(true);
      const walletName = values.name || 'Wallet_1';
      setWalletName(walletName)
      const credentialName = walletName;
      const credentialKey = await register(credentialName);
      addCredential(credentialKey);
      setLoading(false);
      changeStep(2)
    } catch (e: any) {
      setLoading(false);
      toast({
        title: e.message,
        status: 'error',
      });
    }
  };

  const goBack = () => {
    navigate('/launch');
  };

  const onStepChange = () => {

  }

  return (
    <FullscreenContainer>
      <Box width="400px" maxWidth="calc(100vw - 20px)" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box marginBottom="12px" marginRight="24px">
          <Steps
            backgroundColor="#1E1E1E"
            foregroundColor="white"
            count={4}
            activeIndex={1}
            marginTop="24px"
            showBackButton
            onStepChange={changeStep}
          />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Heading1>Name your wallet</Heading1>
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
        >
          Continue
        </Button>
        <TextBody textAlign="center" color="#898989" marginTop="12px">Notice: Some Windows users may need a mobile device to add a passkey.</TextBody>
      </Box>
    </FullscreenContainer>
  )
}
