import { useState, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import { useNavigate } from 'react-router-dom';
import CheckDeposit from './CheckDeposit'
import MakeTransfer from './MakeTransfer'
import SelectNetwork from './SelectNetwork'
import SendToken from './SendToken'
import { motion } from 'framer-motion';

export default function Deposit() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0)
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)
  const [checked3, setChecked3] = useState(false)
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
