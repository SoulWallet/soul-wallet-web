import React, { useState, useCallback, useEffect } from 'react';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Text,
  Image,
  Flex,
  useToast,
  Input,
  Menu,
  MenuList,
  MenuButton,
  MenuItem
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import IconLogo from '@/assets/logo-all-v3.svg';
import IntroImg from '@/assets/Intro.jpg';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import Title from '@/components/new/Title'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/new/Button'
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
import EditGuardianModal from '@/pages/security_new/EditGuardianModal';
import StepProgress from '../StepProgress'

export default function AddSigner({ next }: any) {
  const [isPrivate, setIsPrivate] = useState(true)
  const [isEditGuardianOpen, setIsEditGuardianOpen] = useState<any>(false);

  const closeEditGuardianModal = useCallback(() => {
    setIsEditGuardianOpen(false)
  }, [])

  const onEditGuardianConfirm = useCallback((addresses: any, names: any, threshold: any) => {
    setIsEditGuardianOpen(false)
    setIsEditing(true)
  }, [])

  if (isPrivate) {
    return (
      <Box width="100%" minHeight="100vh" background="#F2F4F7">
        <Box height="58px" padding="10px 20px">
          <Link to="/dashboard">
            <Image src={IconLogo} h="44px" />
          </Link>
        </Box>
        <Box
          padding="20px"
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          minHeight="calc(100% - 58px)"
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
              padding="50px"
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              flexDirection="column"
            >
              <Heading marginBottom="18px" type="h4" fontSize="24px" fontWeight="700">
                Step 3/4: Guardian signature request
              </Heading>
              <TextBody
                fontWeight="800"
                maxWidth="650px"
                marginBottom="10px"
                fontSize="18px"
              >
                Your guardians are private
              </TextBody>
              <Box fontSize="16px" fontWeight="500">
                Please upload the guardians file you saved during setup or enter Ethereum wallets addresses you set as guardians. Once recovered, your guardians will be public on chain.
              </Box>
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                marginTop="20px"
              >
                <Button
                  width="275px"
                  maxWidth="100%"
                  onClick={next}
                >
                  Upload guardians file
                </Button>
                <Box padding="10px">Or</Box>
                <Button
                  width="320px"
                  maxWidth="100%"
                  onClick={() => setIsEditGuardianOpen(true)}
                  theme="light"
                >
                  Enter guardians info manually
                </Button>
              </Box>
              <Box width="100%" display="flex" alignItems="center" justifyContent="center" marginTop="100px">
                <Button
                  width="80px"
                  theme="light"
                  marginRight="18px"
                  type="mid"
                  onClick={() => {}}
                >
                  Back
                </Button>
                <Button
                  width="80px"
                  maxWidth="100%"
                  theme="dark"
                  type="mid"
                  onClick={next}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </RoundContainer>
          <StepProgress activeIndex={2} />
        </Box>
        <EditGuardianModal
          isOpen={isEditGuardianOpen}
          onClose={closeEditGuardianModal}
          setIsEditGuardianOpen={setIsEditGuardianOpen}
          onConfirm={onEditGuardianConfirm}
        />
      </Box>
    )
  }

  return (
    <Box width="100%" minHeight="100vh" background="#F2F4F7">
      <Box height="58px" padding="10px 20px">
        <Link to="/dashboard">
          <Image src={IconLogo} h="44px" />
        </Link>
      </Box>
      <Box
        padding="20px"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        minHeight="calc(100% - 58px)"
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
            padding="50px"
            display="flex"
            alignItems="flex-start"
            justifyContent="center"
            flexDirection="column"
          >
            <Heading marginBottom="18px" type="h4" fontSize="24px" fontWeight="700">
              Step 3/4: Guardian signature request
            </Heading>
            <TextBody
              fontWeight="600"
              maxWidth="650px"
              marginBottom="20px"
            >
              Share this link with your guardians to sign:
            </TextBody>
            <Box marginBottom="10px" background="#F9F9F9" borderRadius="12px" padding="12px" fontSize="18px" fontWeight="700">
              https://alpha.soulwallet.io/recovery-0xAAAA12345678E25FDa5f8a56B8e267fDaB6dS123
            </Box>
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Button
                width="275px"
                maxWidth="100%"
                onClick={next}
              >
                Share link with guardians
              </Button>
            </Box>
            <Box width="100%" marginTop="40px" marginBottom="40px">
              <Box width="100%" height="1px" background="rgba(0, 0, 0, 0.10)" />
            </Box>
            <Box
              width="100%"
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-start"
              flexWrap="wrap"
            >
              <Box
                border="1px solid rgba(0, 0, 0, 0.10)"
                borderRadius="12px"
                padding="14px"
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                minWidth="400px"
                marginRight="20px"
                marginBottom="14px"
              >
                <Box
                  width="32px"
                  height="32px"
                  background="#D9D9D9"
                  borderRadius="32px"
                  marginRight="10px"
                />
                <Box fontSize="14px" fontWeight="700" fontFamily="Nunito">Helloworld.eth (0xAAA......dS123)</Box>
                <Box fontSize="14px" fontWeight="700" fontFamily="Nunito" color="#848488" marginLeft="auto">Waiting</Box>
              </Box>
              <Box
                border="1px solid rgba(0, 0, 0, 0.10)"
                borderRadius="12px"
                padding="14px"
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                minWidth="400px"
                marginRight="20px"
                marginBottom="14px"
              >
                <Box
                  width="32px"
                  height="32px"
                  background="#D9D9D9"
                  borderRadius="32px"
                  marginRight="10px"
                />
                <Box fontSize="14px" fontWeight="700" fontFamily="Nunito">Helloworld.eth (0xAAA......dS123)</Box>
                <Box fontSize="14px" fontWeight="700" fontFamily="Nunito" color="#848488" marginLeft="auto">Waiting</Box>
              </Box>
              <Box
                border="1px solid rgba(0, 0, 0, 0.10)"
                borderRadius="12px"
                padding="14px"
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                minWidth="400px"
                marginRight="20px"
                marginBottom="14px"
              >
                <Box
                  width="32px"
                  height="32px"
                  background="#D9D9D9"
                  borderRadius="32px"
                  marginRight="10px"
                />
                <Box fontSize="14px" fontWeight="700" fontFamily="Nunito">Helloworld.eth (0xAAA......dS123)</Box>
                <Box fontSize="14px" fontWeight="700" fontFamily="Nunito" color="#848488" marginLeft="auto">Waiting</Box>
              </Box>
              <Box
                border="1px solid rgba(0, 0, 0, 0.10)"
                borderRadius="12px"
                padding="14px"
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                minWidth="400px"
                marginRight="20px"
                marginBottom="14px"
              >
                <Box
                  width="32px"
                  height="32px"
                  background="#D9D9D9"
                  borderRadius="32px"
                  marginRight="10px"
                />
                <Box fontSize="14px" fontWeight="700" fontFamily="Nunito">Helloworld.eth (0xAAA......dS123)</Box>
                <Box fontSize="14px" fontWeight="700" fontFamily="Nunito" color="#848488" marginLeft="auto">Waiting</Box>
              </Box>
            </Box>
          </Box>
        </RoundContainer>
        <StepProgress activeIndex={2} />
      </Box>
    </Box>
  )
}
