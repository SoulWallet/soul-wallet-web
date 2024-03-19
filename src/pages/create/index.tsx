import React, { useState, useCallback, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import InputInviteCode from './InputInviteCode'
import SetupEmail from './SetupEmail'
import SetupUsername from './SetupUsername'
import SetupPasskey from './SetupPasskey'
import CreateSuccess from './CreateSuccess'
import useWallet from '@/hooks/useWallet';
import usePasskey from '@/hooks/usePasskey';
import { useNavigate } from 'react-router-dom';

export default function Create() {
  const { createWallet } = useWallet();
  const { register } = usePasskey();
  const navigate = useNavigate();
  const [step, setStep] = useState(0)
  const [invitationCode, setInvitationCode] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [credential, setCredential] = useState<any>({})
  const onPrev = useCallback(() => {
    console.log('prev')

    if (step > 1) {
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
    await createWallet(credential, username, invitationCode || 'HIQ-LAY-M6J');
    navigate('/dashboard')
  }

  const renderStep = () => {
    if (step == 0) {
      return (
        <InputInviteCode value={invitationCode} onChange={setInvitationCode} onNext={onNext} onSkip={onSkip} />
      )
    } else if (step == 1) {
      return (
        <SetupUsername value={username} onChange={setUsername} onNext={onNext} onSkip={onSkip} />
      )
    } else if (step == 2) {
      return (
        <SetupEmail onNext={onNext} onSkip={onNext} />
      )
    } else if (step == 3) {
      return (
        <SetupPasskey onNext={onCreatePasskey} />
      )
    } else if (step == 4) {
      return (
        <CreateSuccess onNext={onCreateWallet} />
      )
    }
  }

  return (
    <Box width="100%" height="100%">
      <Header
        title="Create account"
        showBackButton
        onBack={onPrev}
        marginTop="18px"
      />
      {renderStep()}
    </Box>
  );
}
