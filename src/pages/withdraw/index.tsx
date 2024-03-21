import React, { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import useWallet from '@/hooks/useWallet';
import { useNavigate } from 'react-router-dom';
import InputAmount from './InputAmount';
import Review from './Review';
import WithdrawSuccess from './WithdrawSuccess';

export default function Withdraw() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const toast = useToast();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [sendTo, setSendTo] = useState('');
  const { withdrawAssets } = useWallet();
  const [isTransfering, setIsTransfering] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const onPrev = useCallback(() => {
    console.log('prev', step);
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigate('/dashboard');
    }
  }, [step]);

  const onWithdraw = async () => {
    if (!withdrawAmount || !sendTo) {
      toast({
        title: 'Please confirm your params',
        status: 'error',
      });
      return;
    }

    setIsTransfering(true);
    await withdrawAssets(withdrawAmount, sendTo);
    setIsTransfering(false);
    setIsCompleted(true);
  };

  const onNext = useCallback(() => {
    console.log('next');
    setStep(step + 1);
  }, [step]);

  if (step == 0) {
    return (
      <InputAmount
        withdrawAmount={withdrawAmount}
        onWithdrawAmountChange={setWithdrawAmount}
        sendTo={sendTo}
        onSendToChange={setSendTo}
        onPrev={onPrev}
        onNext={onNext}
      />
    );
  } else if (step == 1) {
    return (
      <Review
        isTransfering={isTransfering}
        isCompleted={isCompleted}
        withdrawAmount={withdrawAmount}
        onPrev={onPrev}
        sendTo={sendTo}
        onWithdraw={onWithdraw}
      />
    );
  }
}
