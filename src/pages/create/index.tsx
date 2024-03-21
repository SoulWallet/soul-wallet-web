import React, { useState, useCallback, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import InputInviteCode from './InputInviteCode'
// import SetupEmail from './SetupEmail'
import SetupUsername from './SetupUsername'
import SetupPasskey from './SetupPasskey'
import CreateSuccess from './CreateSuccess'
import useWallet from '@/hooks/useWallet';
import usePasskey from '@/hooks/usePasskey';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

export default function Create() {
  const { createWallet } = useWallet();
  const { register } = usePasskey();
  const navigate = useNavigate();
  const [step, setStep] = useState(0)
  const [creating, setCreating] = useState(false)
  const [addingPasskey, setAddingPasskey] = useState(false)
  const [invitationCode, setInvitationCode] = useState('')
  const [username, setUsername] = useState('')
  const [credential, setCredential] = useState<any>({})
  const [nameStatus, setNameStatus] = useState(-1);
  const [codeStatus, setCodeStatus] = useState(-1);
  const onPrev = useCallback(() => {
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
    try {
      setAddingPasskey(true)
      setCredential(await register(username));
      setStep(3)
    } catch (error: any) {
      setAddingPasskey(false)
    }
  }

  const onCreateWallet = async () => {
    try {
      console.log('onCreateWallet')
      setCreating(true)
      await createWallet(credential, username, invitationCode);
      navigate('/intro')
    } catch (error: any) {
      setCreating(false)
      console.error('onCreateWallet failed', error)
    }
  }

  const checkUsername = async() => {
    const res:any = await api.account.nameStatus({
      name: username,
    });
    console.log('name status', res);
    setNameStatus(res.data.status);
  }

  const checkInviteCode = async() => {
    const res:any = await api.invitation.codeStatus({
      code: invitationCode,
    });
    console.log('invite code status', res);
    setCodeStatus(res.data.status);
  }

  useEffect(()=>{
    if(!username){
      return
    }
    checkUsername();
  }, [username])

  useEffect(()=>{
    if(!invitationCode){
      return
    }
    checkInviteCode();
  }, [invitationCode])

  const renderStep = () => {
    if (step == 0) {
      return (
        <InputInviteCode value={invitationCode} onChange={setInvitationCode} codeStatus={codeStatus} onNext={onNext} onSkip={onSkip} />
      )
    } else if (step == 1) {
      return (
        <SetupUsername nameStatus={nameStatus} value={username} onChange={setUsername} onNext={onNext} onSkip={onSkip} />
      )
    }
    else if (step == 2) {
      return (
        <SetupPasskey addingPasskey={addingPasskey} onNext={onCreatePasskey} />
      )
    } else if (step == 3) {
      return (
        <CreateSuccess creating={creating} onNext={onCreateWallet} />
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
