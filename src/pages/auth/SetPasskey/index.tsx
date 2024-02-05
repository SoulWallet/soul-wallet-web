import React, { useState, useCallback, useEffect } from 'react';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Text,
  Image,
  Flex,
  useToast,
  Tooltip
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
import RedCheckIcon from '@/components/Icons/RedCheck'
import usePassKey from '@/hooks/usePasskey';
import { useSignerStore } from '@/store/signer';
import { useTempStore } from '@/store/temp';
import { passkeyTooltipText } from '@/config/constants';
import QuestionIcon from '@/components/Icons/Auth/Question'
import { SignHeader } from '@/pages/public/Sign';

export default function SetPasskey() {
  const { createInfo, updateCreateInfo } = useTempStore()
  const [credentials, setCredentials] = useState<any>([])
  const { register } = usePassKey()
  const toast = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const { navigate } = useBrowser();
  console.log('create info', createInfo)

  const createWallet = async () => {
    try {
      setIsCreating(true);
      const credentialKey = await register();
      // addCredential(credentialKey);
      setCredentials([...credentials, credentialKey])
      setIsCreating(false);
    } catch (error: any) {
      console.log('ERR', error)
      console.log('error', error);
      setIsCreating(false);
      toast({
        title: error.message,
        status: 'error',
      });
    }
  }

  const skip = useCallback(() => {
    console.log('skip')
    navigate(`/dashboard`);
  }, [])

  const next = useCallback(() => {
    updateCreateInfo({
      credentials
    })

    navigate(`/dashboard`);
  }, [credentials])

  useEffect(() => {
    /* updateCreateInfo({
     *   credentials
     * }) */
  }, [credentials])

  if (credentials && credentials.length) {
    return (
      <Flex align={'center'} justify={'center'} width="100%" minHeight="100vh" background="#F2F4F7">
        <SignHeader />
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
            minHeight="544px"
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
              <Heading marginBottom="6px" type="h3">
                Passkey signer added!
              </Heading>
              <TextBody fontWeight="600">Passkey is faster to sign in with, easier to use, and much more secure.</TextBody>
              <Box
                marginBottom="90px"
                background="#F7F7F7"
                padding="24px"
                margin="24px"
                borderRadius="20px"
                width="700px"
                maxWidth="100%"
              >
                <Heading type="h4" marginBottom="8px">
                  My passkeys
                </Heading>
                <Flex display="flex" alignItems="flex-start" justifyContent="center" flexDirection="column" width="100%" gap="2">
                  {credentials.map((passKey: any) =>
                    <Box background="white" borderRadius="16px" padding="16px" width="100%" marginBottom="4px">
                      <Box display="flex" alignItems="center">
                        <Box width="50px" height="50px" background="#efefef" borderRadius="50px" marginRight="16px" display="flex" alignItems="center" justifyContent="center"><ComputerIcon /></Box>
                        <Box>
                          <Text color="rgb(7, 32, 39)" fontSize="18px" fontWeight="800">
                            {passKey.name}
                          </Text>
                          <Text color="rgb(51, 51, 51)" fontSize="14px">
                            Created on: 12/14/2023 12:12:09
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Flex>
              </Box>
              <Box width="100%" display="flex" justifyContent="center">
                {createInfo && createInfo.eoaAddress && createInfo.eoaAddress.length && !credentials.length && (
                  <Button
                    width="80px"
                    theme="light"
                    onClick={skip}
                    type="lg"
                    marginRight="18px"
                  >
                    Skip
                  </Button>
                )}
                {!!credentials.length && (
                  <Button
                    maxWidth="100%"
                    padding="0 20px"
                    theme="light"
                    disabled={isCreating}
                    loading={isCreating}
                    onClick={createWallet}
                    type="lg"
                  >
                    <Box marginRight="8px"><PlusIcon color="black" /></Box>
                    Add another Passkey
                  </Button>
                )}
                {!!credentials.length && (
                  <Button
                    width="115px"
                    maxWidth="100%"
                    theme="dark"
                    onClick={next}
                    disabled={isCreating || !credentials.length}
                    marginLeft="18px"
                    type="lg"
                  >
                    Continue
                  </Button>
                )}
              </Box>
            </Box>
          </RoundContainer>
        </Box>
      </Flex>
    )
  }

  return (
    <Flex width="100%" align={'center'} justify={'center'} minHeight="100vh" background="#F2F4F7">
      <SignHeader />
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
          minHeight="544px"
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
            <Heading marginBottom="18px" type="h3">
              Sign with <Tooltip hasArrow bg='brand.black' label={passkeyTooltipText}>
              <Box as="span" borderBottom="1px solid black" borderStyle="dotted">passkey</Box></Tooltip> 
            </Heading>
            <TextBody fontWeight="600">Turn your own device into hardware wallet! Add passkey now <Box as="span" color="#FF2E79">for free</Box>!</TextBody>
            <Box
              marginBottom="90px"
              padding="24px"
              margin="24px"
              borderRadius="20px"
              width="700px"
              maxWidth="100%"
            >
              {/* <Heading type="h4" marginBottom="18px">
                Why sign with passkey?
              </Heading> */}
              <Box width="100%" display="flex" marginBottom="18px">
                <Box
                  width="calc(50% - 10px)"
                  border="1px solid rgba(0, 0, 0, 0.10)"
                  borderRadius="8px"
                  marginRight="20px"
                >
                  <Title
                    height="47px"
                    background="#F7F7F7"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    👍🏻 Advantage
                  </Title>
                  <Box padding="20px 40px">
                    <TextBody type="t2" display="flex" marginBottom="4px">
                      <Box as="span" marginRight="4px"><RedCheckIcon /></Box>
                      Much more secure. Resistant to phishing.
                    </TextBody>
                    <TextBody type="t2" display="flex" marginBottom="4px">
                      <Box as="span" marginRight="4px"><RedCheckIcon /></Box>
                      Login and sign faster
                    </TextBody>
                    <TextBody type="t2" display="flex">
                      <Box as="span" marginRight="4px"><RedCheckIcon /></Box>
                      iCloud keychain supported
                    </TextBody>
                  </Box>
                </Box>
                <Box
                  width="calc(50% - 10px)"
                  border="1px solid rgba(0, 0, 0, 0.10)"
                  borderRadius="8px"
                >
                  <Title
                    height="47px"
                    background="#F7F7F7"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    👎🏻 Disadvantage
                  </Title>
                  <Box padding="20px 40px">
                    <Tooltip hasArrow bg='brand.black' label={`It cost $0.7 more to send an ERC-20 token on L2 comparing sign with EOA ($0.86 vs. $0.16).`}>
                      <Box>
                        <TextBody type="t2" marginBottom="4px" display="flex" alignItems="center">
                          Higher gas fee
                          <Box as="span" marginLeft="5px"><QuestionIcon /></Box>
                        </TextBody>
                      </Box>
                    </Tooltip>
                    <Tooltip hasArrow bg='brand.black' label={`Your passkey only works with our website (also save you from scam sites).`}>
                      <Box>
                        <TextBody type="t2" display="flex" alignItems="center">
                          Bound with our website
                          <Box as="span" marginLeft="5px"><QuestionIcon /></Box>
                        </TextBody>
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
              <Box width="100%" display="flex" justifyContent="center">
                {createInfo && createInfo.eoaAddress && createInfo.eoaAddress.length && (
                  <Button
                    width="80px"
                    theme="light"
                    marginRight="18px"
                    onClick={skip}
                    type="lg"
                  >
                    Skip
                  </Button>
                )}
                {!credentials.length && (
                  <Button
                    maxWidth="100%"
                    padding="0 20px"
                    theme="dark"
                    disabled={isCreating}
                    loading={isCreating}
                    onClick={createWallet}
                    type="lg"
                  >
                    <Box marginRight="8px"><PlusIcon color="white" /></Box>
                    Add Passkey
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </Flex>
  )
}
