import React, { useState, useCallback, useEffect } from 'react';
import { Box, Image, Checkbox } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import Button from '@/components/mobile/Button'
import ScanIcon from '@/components/Icons/mobile/Scan'
import NextIcon from '@/components/Icons/mobile/Next'
import useWallet from '@/hooks/useWallet';
import usePasskey from '@/hooks/usePasskey';
import { useNavigate } from 'react-router-dom';
import USDCIcon from '@/assets/mobile/usdc.png'
import USDCGreyIcon from '@/assets/mobile/usdc_grey.png'
import CheckDeposit from './CheckDeposit'
import MakeTransfer from './MakeTransfer'
import SelectNetwork from './SelectNetwork'
import SendToken from './SendToken'

export default function Deposit() {
  const { createWallet } = useWallet();
  const { register } = usePasskey();
  const navigate = useNavigate();
  const [step, setStep] = useState(0)
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)
  const [checked3, setChecked3] = useState(false)
  const [invitationCode, setInvitationCode] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [credential, setCredential] = useState<any>({})
  const onPrev = useCallback(() => {
    console.log('prev')

    if (step > 0) {
      setStep(step - 1)
    }
  }, [step])

  const onNext = useCallback(() => {
    console.log('next')
    setStep(step + 1)
  }, [step])

  const onSkip = useCallback(() => {
    console.log('skip')
  }, [])

  const onCreatePasskey = async() => {
    setCredential(await register(username));
    setStep(4)
  }

  const onCreateWallet = async () => {
    await createWallet(credential, username, '12Y-1QE-3L8' || invitationCode);
    navigate('/dashboard')
  }

  const isAllChecked = checked1 && checked2 && checked3

  if (step == 0) {
    return (
      <CheckDeposit onPrev={onPrev} onNext={onNext} />
    );
  } else if (step == 1) {
    return (
      <MakeTransfer onPrev={onPrev} onNext={onNext} />
    );
  } else if (step == 2) {
    return (
      <SelectNetwork onPrev={onPrev} onNext={onNext} />
    );
  } else if (step == 3) {
    return (
      <SendToken onPrev={onPrev} onNext={onNext} />
    );
  }

  return (
    <Box width="100%" height="100%">
      <Header
        title="Deposit"
        showBackButton
        onBack={onPrev}
        marginTop="18px"
      />

    </Box>
  );
}
