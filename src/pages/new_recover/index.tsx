import React, { useState, useCallback, useEffect } from 'react';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Text,
  Image,
  Flex,
  useToast
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import IconLogo from '@/assets/logo-all-v3.svg';
import IntroImg from '@/assets/Intro.jpg';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import Title from '@/components/new/Title'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/Button'
import PlusIcon from '@/components/Icons/Plus';
import ComputerIcon from '@/components/Icons/Computer';
import TwitterIcon from '@/components/Icons/Social/Twitter'
import TelegramIcon from '@/components/Icons/Social/Telegram'
import GithubIcon from '@/components/Icons/Social/Github'
import PasskeyIcon from '@/components/Icons/Intro/Passkey'
import AccountIcon from '@/components/Icons/Intro/Account'
import TransferIcon from '@/components/Icons/Intro/Transfer'
import TokenIcon from '@/components/Icons/Intro/Token'
import usePassKey from '@/hooks/usePasskey';
import { useSignerStore } from '@/store/signer';
import { useTempStore } from '@/store/temp';
import RecoverWalletIcon from '@/assets/icons/recover-wallet.svg'
import SetWalletAddress from './SetWalletAddress'
import AddSigner from './AddSigner'
import api from '@/lib/api';
import GuardianApprovals from './GuardianApprovals'
import PayRecoveryFee from './PayRecoveryFee'
import RecoverProgress from './RecoverProgress'
import { SignHeader } from '../public/Sign';

export default function Recover() {
  const [step, setStep] = useState(0)
  const toast = useToast();
  const { navigate } = useBrowser();
  const { recoverInfo, updateRecoverInfo } = useTempStore()
  const { recoveryRecordID, recoveryRecord } = recoverInfo

  const back = useCallback(() => {
    console.log('step', step)
    if (step === 0) {
      navigate(`/auth`);
    } else {
      setStep(step - 1)
    }
  }, [step])

  const next = useCallback(() => {
    setStep(step + 1)
  }, [step])
  console.log('recoveryRecordID', recoveryRecordID)

  useEffect(() => {
    if (recoveryRecordID) {
      const interval = setInterval(async () => {
        try {
          console.log('recoveryRecordID', recoveryRecordID)
          const res2 = await api.guardian.getRecoverRecord({ recoveryRecordID })
          const recoveryRecord = res2.data

          updateRecoverInfo({
            recoveryRecord,
            enabled: false,
          });

          const status = recoveryRecord.status

          if (status == 0) {
            setStep(3)
          } else if (status == 1) {
            setStep(4)
          } else if (status >= 2) {
            setStep(5)
          }
        } catch (error: any) {
          console.log('error', error.message)
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [recoveryRecordID])

  useEffect(() => {
    if (recoveryRecordID) {
      const status = recoveryRecord.status

      if (status == 0) {
        setStep(3)
      } else if (status == 1) {
        setStep(4)
      } else if (status >= 2) {
        setStep(5)
      }
    }
  }, [])

  if (step === 1) {
    return (
      <SetWalletAddress next={next} back={back} />
    )
  }

  if (step === 2) {
    return (
      <AddSigner next={next} back={back}  />
    )
  }

  if (step === 3) {
    return (
      <GuardianApprovals next={next} back={back}  />
    )
  }

  if (step === 4) {
    return (
      <PayRecoveryFee next={next}  />
    )
  }

  if (step > 4) {
    return (
      <RecoverProgress />
    )
  }

  return (
    <Flex align={'center'} justify={'center'} width="100%" minHeight="100vh" background="#F2F4F7">
      <SignHeader url="/auth" />
      <Box
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="calc(100% - 58px)"
        flexDirection="column"
      >
        <RoundContainer
          width="1058px"
          maxWidth="100%"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          background="white"
        >
          <Box
            width="100%"
            height="100%"
            padding="84px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Box
              width="120px"
              height="120px"
              borderRadius="120px"
              background="#D9D9D9"
              marginBottom="20px"
            >
              <Image src={RecoverWalletIcon} />
            </Box>
            <Heading marginBottom="18px" type="h3">
              Recover my wallet
            </Heading>
            <TextBody
              fontWeight="600"
              maxWidth="550px"
              textAlign="center"
              marginBottom="20px"
            >
              We understand it must be annoying to lose wallet. No worries, we got you covered! Just simply recovery your wallet within <Box as="span" fontWeight="bold">4 steps</Box>.
            </TextBody>
            <Box>
              <Button
                width="80px"
                type="white"
                marginRight="18px"
                onClick={back}
                size="xl"
              >
                Back
              </Button>
              <Button
                width="135px"
                maxWidth="100%"
                type="black"
                onClick={next}
                size="xl"
              >
                Get started
              </Button>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </Flex>
  )
}
