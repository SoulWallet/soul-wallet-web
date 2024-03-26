import React, { useState, useCallback, useEffect } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import InputInviteCode from './InputInviteCode'
import SetupUsername from './SetupUsername'
import SetupPasskey from './SetupPasskey'
import CreateSuccess from './CreateSuccess'
import usePasskey from '@/hooks/usePasskey';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

export default function Create() {
  const { register } = usePasskey();
  const navigate = useNavigate();
  const [step, setStep] = useState(0)
  const [addingPasskey, setAddingPasskey] = useState(false)
  const [invitationCode, setInvitationCode] = useState('')
  const [username, setUsername] = useState('')
  const [credential, setCredential] = useState<any>({})
  const [nameStatus, setNameStatus] = useState(-1);
  const [checkingNameStatus, setCheckingNameStatus] = useState(false)
  const [codeStatus, setCodeStatus] = useState(-1);
  const [checkingCodeStatus, setCheckingCodeStatus] = useState(false)
  const [timer, setTimer] = useState<any>();
  const toast = useToast();

  const debounce = (fn: Function, delay: number) => {
    clearTimeout(timer);
    setTimer(setTimeout(fn, delay))
  }

  const onPrev = useCallback(() => {
    if (step > 1) {
      setStep(step - 1)
    }else{
      navigate('/landing')
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
    try {
      setAddingPasskey(true)
      setCredential(await register(username));
      setStep(3)
    } catch (error: any) {
      toast({
        title: 'Failed to create passkey',
        description: error.message,
        status: 'error',
      })
      setAddingPasskey(false)
    }
  }

  const checkUsername = async() => {
    const res:any = await api.account.nameStatus({
      name: username,
    });
    console.log('name status', res);
    setCheckingNameStatus(false);
    setNameStatus(res.data.status);
  }

  const checkInviteCode = async() => {
    const res:any = await api.invitation.codeStatus({
      code: invitationCode,
    });
    console.log('invite code status', res);
    setCheckingCodeStatus(false);
    setCodeStatus(res.data.status);
  }

  useEffect(()=>{
    if(!username){
      setCheckingNameStatus(false)
      setNameStatus(-1)
      return
    }
    setCheckingNameStatus(true);
    debounce(checkUsername, 1000)
  }, [username])

  useEffect(()=>{
    if(!invitationCode){
      setCheckingCodeStatus(false)
      setCodeStatus(-1)
      return
    }
    setCheckingCodeStatus(true);
    debounce(checkInviteCode, 1000);
  }, [invitationCode])

  const onInviteCodeChange = (val: string) => {
    setCodeStatus(-1);
    setInvitationCode(val);
  }

  const onUsernameChange = (val: string) => {
    setNameStatus(-1);
    setUsername(val);
  }

  const renderStep = () => {
    if (step == 0) {
      return (
        <InputInviteCode checking={checkingCodeStatus} value={invitationCode} onChange={onInviteCodeChange} codeStatus={codeStatus} onNext={onNext} onSkip={onSkip} />
      )
    } else if (step == 1) {
      return (
        <SetupUsername checking={checkingNameStatus} nameStatus={nameStatus} value={username} onChange={onUsernameChange} onNext={onNext} onSkip={onSkip} />
      )
    }
    else if (step == 2) {
      return (
        <SetupPasskey addingPasskey={addingPasskey} onNext={onCreatePasskey} />
      )
    } else if (step == 3) {
      return (
        <CreateSuccess credential={credential} username={username} invitationCode={invitationCode} />
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
