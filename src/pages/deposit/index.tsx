import { useState, useCallback, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import { useNavigate } from 'react-router-dom';
import CheckDeposit from './CheckDeposit'
import MakeTransfer from './MakeTransfer'
import SelectNetwork from './SelectNetwork'
import SendToken from './SendToken'
import FadeSwitch from '@/components/FadeSwitch';
import { useHistoryStore } from '@/store/history';

export default function Deposit() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0)
  const { historyList } = useHistoryStore();
  const innerHeight = window.innerHeight

  const onFinish = () => {
    if(historyList.length){
      navigate('/dashboard')
    }else{
      navigate('/intro')
    }
  }

  const onPrev = useCallback(() => {
    console.log('prev')

    if (step > 0) {
      setStep(step - 1)
    }else{
     onFinish()
    }
  }, [step])

  const onNext = useCallback(() => {
    console.log('next')
    setStep(step + 1)
  }, [step])

  return (
    <Box width="100%" height={innerHeight} overflow="hidden">
      <Header
        title="Deposit"
        showBackButton
        onBack={onPrev}
      />
      <FadeSwitch key={step}>
        {step === 0 && <CheckDeposit onPrev={onPrev} onNext={onNext} />}
        {step === 1 && <MakeTransfer onPrev={onPrev} onNext={onNext} />}
        {step === 2 && <SelectNetwork onPrev={onPrev} onNext={onNext} />}
        {step === 3 && <SendToken onFinish={onFinish} />}
      </FadeSwitch>
    </Box>
  );
}
