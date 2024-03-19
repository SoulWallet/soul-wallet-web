import React, { useState, useCallback, useEffect } from 'react';
import { Box, Image, Checkbox } from '@chakra-ui/react';
import Header from '@/components/mobile/Header'
import Button from '@/components/mobile/Button'
import ScanIcon from '@/components/Icons/mobile/Scan'
import useWallet from '@/hooks/useWallet';
import usePasskey from '@/hooks/usePasskey';
import { useNavigate } from 'react-router-dom';
import USDCIcon from '@/assets/mobile/usdc.png'
import USDCGreyIcon from '@/assets/mobile/usdc_grey.png'

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
    await createWallet(credential, username, '12Y-1QE-3L8' || invitationCode);
    navigate('/dashboard')
  }

  if (step == 0) {
    return (
      <Box width="100%" height="100%">
        <Header
          title="Deposit"
          showBackButton
          onBack={onPrev}
          marginTop="18px"
        />
        <Box padding="30px">
          <Box width="100%" fontSize="30px" fontWeight="700" textAlign="center" lineHeight="36px">
            Prior to deposit, please verify
          </Box>
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="space-around"
            marginTop="20px"
            marginBottom="20px"
          >
            <Box>
              <Image src={USDCGreyIcon} className="icon" />
            </Box>
            <Box>
              <Image src={USDCGreyIcon} className="icon" />
            </Box>
            <Box>
              <Image src={USDCGreyIcon} className="icon" />
            </Box>
          </Box>
          <Box>
            <Box>
              <Box marginBottom="4px">
                <Checkbox defaultChecked>I'm gonna send USDC, not other assets</Checkbox>
              </Box>
            </Box>
            <Box marginBottom="4px">
              <Checkbox defaultChecked={false} alignItems="flex-start">The network is Arbitrum, not any other chain</Checkbox>
            </Box>
            <Box marginBottom="4px">
              <Checkbox defaultChecked={false} alignItems="flex-start">After deposit, my fund will auto-saved into AAVE protocol</Checkbox>
            </Box>
          </Box>
          <Box
            width="100%"
            borderTop="1px solid rgba(0, 0, 0, 0.1)"
            padding="36px 0"
            marginTop="30px"
          >
            <Box fontWeight="700" background="#F1F1F1" borderRadius="12px" padding="15px 16px">0xcea21s19hjka28379xsd2xxasd1212111</Box>
            <Box width="100%" display="flex" alignItems="center" justifyContent="space-between" marginTop="17px">
              <Box width="calc(100% - 50px)">
                <Button size="xl" type="blue" width="100%">Copy address</Button>
              </Box>
              <Box><ScanIcon /></Box>
            </Box>
            <Box fontSize="12px" fontWeight="700" color="#5E5E5E" marginTop="26px">
              This is your Soul Wallet address on Arbitrum network to transfer assets directly into your account and save into protocol. You can always copy it on homepage.
            </Box>
          </Box>
        </Box>
      </Box>
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
