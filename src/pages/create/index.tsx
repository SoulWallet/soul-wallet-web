import React, { useState } from 'react';
import FullscreenContainer from '@/components/FullscreenContainer';
import { Box, useToast } from '@chakra-ui/react';
import Heading1 from '@/components/web/Heading1';
import TextBody from '@/components/web/TextBody';
import Button from '@/components/web/Button';
import TextButton from '@/components/web/TextButton';
import Steps from '@/components/web/Steps';
import useBrowser from '@/hooks/useBrowser';
import SetWalletName from './SetWalletName'
import SetPasskeys from './SetPasskeys'
import SetGuardians from './SetGuardians'
import CreateSuccess from './CreateSuccess'

export default function Create() {
  const [step, setStep] = useState(0);
  const { navigate } = useBrowser();

  const changeStep = (i: number) => {
    console.log('changeStep', i)

    if (i === -1) {
      navigate('/launch');
    } else {
      setStep(i)
    }
  };

  if (step === 0) {
    return (<SetWalletName changeStep={changeStep} />)
  } else if (step === 1) {
    return (<SetPasskeys changeStep={changeStep} />)
  } else if (step === 2) {
    return (<SetGuardians changeStep={changeStep} />)
  } else {
    return (<CreateSuccess />)
  }
}
