import { useState, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import { useNavigate } from 'react-router-dom';
import CheckDeposit from './CheckDeposit'
import MakeTransfer from './MakeTransfer'
import SelectNetwork from './SelectNetwork'
import SendToken from './SendToken'
import { motion } from 'framer-motion';
import FadeSwitch from '@/components/FadeSwitch';

export default function Deposit() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0)
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)
  const [checked3, setChecked3] = useState(false)
  const innerHeight = window.innerHeight
  const contentHeight = innerHeight - 64

  const onPrev = useCallback(() => {
    console.log('prev')

    if (step > 0) {
      setStep(step - 1)
    }else{
      navigate('/dashboard')
    }
  }, [step])

  const onNext = useCallback(() => {
    console.log('next')
    setStep(step + 1)
  }, [step])

  const isAllChecked = checked1 && checked2 && checked3

  return (
    <Box width="100%" height={innerHeight}>
      <Header
        title="Deposit"
        showBackButton
        onBack={onPrev}
        marginTop="18px"
      />
      <FadeSwitch key={step}>
        {step === 0 &&  <CheckDeposit onPrev={onPrev} onNext={onNext} />}
        {step === 1 && <MakeTransfer onPrev={onPrev} onNext={onNext} />}
        {step === 2 && <SelectNetwork onPrev={onPrev} onNext={onNext} />}
        {step === 3 && <SendToken onPrev={onPrev} onNext={onNext} />}
      </FadeSwitch>
    </Box>
  );
}
