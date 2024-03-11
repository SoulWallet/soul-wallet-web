import React, { useState, useCallback, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import InputInviteCode from './InputInviteCode'
import SetupEmail from './SetupEmail'
import SetupUsername from './SetupUsername'
import SetupPasskey from './SetupPasskey'
import CreateSuccess from './CreateSuccess'

export default function Create() {
  const [step, setStep] = useState(0)

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

  const renderStep = () => {
    if (step == 0) {
      return (
        <InputInviteCode onNext={onNext} onSkip={onSkip} />
      )
    } else if (step == 1) {
      return (
        <SetupUsername onNext={onNext} onSkip={onSkip} />
      )
    } else if (step == 2) {
      return (
        <SetupEmail onNext={onNext} onSkip={onSkip} />
      )
    } else if (step == 3) {
      return (
        <SetupPasskey onNext={onNext} />
      )
    } else if (step == 4) {
      return (
        <CreateSuccess onNext={onNext} />
      )
    }
  }

  return (
    <Box width="100%" height="100%">
      <Header
        title="Create account"
        showBackButton
        onBack={onPrev}
      />
      {renderStep()}
    </Box>
  );
}
