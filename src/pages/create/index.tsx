import React, { useState } from 'react';
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
