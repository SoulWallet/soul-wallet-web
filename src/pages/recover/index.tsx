import React, { useState, useEffect } from 'react';
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
import FormInput from '@/components/web/Form/FormInput';
import useForm from '@/hooks/useForm';
import WalletCard from '@/components/web/WalletCard';
import ArrowLeftIcon from '@/components/Icons/ArrowLeft';
import api from '@/lib/api';
import SetWalletAddress from './SetWalletAddress'
import SetPasskeys from './SetPasskeys'
import SetGuardians from './SetGuardians'
import SignatureRequest from './SignatureRequest'

export default function Recover() {
  const [step, setStep] = useState(0)
  const { recoveringGuardiansInfo } = useGuardianStore();

  const changeStep = (step: number) => {
    setStep(step)
  }

  useEffect(() => {
    const main = async () => {
      const result = await api.guardian.getRecoverRecord({ recoveryRecordID: '0x7079f804b0a44b81c715f80ca84f4f281604e41d3f11a641d67609af72dd54c4' });
      console.log('guardianSignatures', result);
    }
    // main()

    if (recoveringGuardiansInfo.recoveryRecord) {
      changeStep(3)
    }
  }, [])

  if (step === 0) {
    return <SetWalletAddress changeStep={changeStep} />
  } else if (step === 1) {
    return <SetPasskeys changeStep={changeStep} />
  } else if (step === 2) {
    return <SetGuardians changeStep={changeStep} />
  } else if (step === 3) {
    return (
      <FullscreenContainer>
        <SignatureRequest changeStep={changeStep} />
      </FullscreenContainer>
    )
  }

  return null
}
