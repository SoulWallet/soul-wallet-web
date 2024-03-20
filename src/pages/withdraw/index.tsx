import React, { useState, useCallback, useEffect } from 'react';
import { Box, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import useWallet from '@/hooks/useWallet';
import usePasskey from '@/hooks/usePasskey';
import { useNavigate } from 'react-router-dom';
import InputAmount from './InputAmount'
import Review from './Review'
import WithdrawSuccess from './WithdrawSuccess'

export default function Withdraw() {
  const { createWallet } = useWallet();
  const { register } = usePasskey();
  const navigate = useNavigate();
  const [step, setStep] = useState(0)
  const [invitationCode, setInvitationCode] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [credential, setCredential] = useState<any>({})
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onPrev = useCallback(() => {
    console.log('prev', step)

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

  const onChange = () => {

  }

  if (step == 0) {
    return (
      <InputAmount onPrev={onPrev} onChange={onChange} onNext={onNext} />
    )
  } else if (step == 1) {
    return (
      <Review onPrev={onPrev} onChange={onChange} onNext={onNext} />
    )
  } else if (step == 2) {
    return (
      <WithdrawSuccess />
    )
  }

  return (
    <InputAmount onPrev={onPrev} onChange={onChange} onNext={onNext} />
  );
}
