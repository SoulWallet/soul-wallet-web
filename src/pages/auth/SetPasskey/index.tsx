import React, { useState, useCallback } from 'react';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Text,
  Image,
  useToast,
  Grid,
  GridItem,
  Flex,
  Popover,
  PopoverTrigger,
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

export default function SetPasskey() {
  const [added, setAdded] = useState(false)

  const addPasskey = useCallback(() => {
    setAdded(true)
  }, [])

  if (added) {
    return (
      <Box width="100%" minHeight="100vh" background="#F2F4F7">
        <Box height="58px" padding="10px 20px">
          <Link to="/wallet">
            <Image src={IconLogo} h="44px" />
          </Link>
        </Box>
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
                Passkey signer added!
              </Heading>
              <TextBody>Having passkeys as signer makes it easier to sign transactions.</TextBody>
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
                  What is Passkey signer?
                </Heading>
                <TextBody type="t2">
                  Sign transaction with passkey saved on your device. Safer, but twice more expensive on L2!
                </TextBody>
                <TextBody type="t2" color="#797979" marginBottom="18px">
                  *If you're an Apple user, you can even sync your passkey across all devices end to end encrypted via icloud keychain.
                </TextBody>
                <Box display="flex" alignItems="flex-start" justifyContent="center" flexDirection="column" width="100%" mb="4">
                  <Box background="white" borderRadius="16px" padding="16px" width="100%" marginBottom="4px">
                    <Box display="flex" alignItems="center">
                      <Box width="50px" height="50px" background="#efefef" borderRadius="50px" marginRight="16px" display="flex" alignItems="center" justifyContent="center"><ComputerIcon /></Box>
                      <Box>
                        <Text color="rgb(7, 32, 39)" fontSize="18px" fontWeight="800">
                          Chrome on Mac
                        </Text>
                        <Text color="rgb(51, 51, 51)" fontSize="14px">
                          Created on: 12/14/2023 12:12:09
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Button
                  width="275px"
                  maxWidth="100%"
                  theme="light"
                >
                  <Box marginRight="8px"><PlusIcon color="black" /></Box>
                  Add Another Passkey
                </Button>
              </Box>
              <Box>
                <Button
                  width="80px"
                  theme="light"
                  marginRight="18px"
                >
                  Skip
                </Button>
                <Button
                  width="115px"
                  maxWidth="100%"
                  theme="dark"
                  onClick={addPasskey}
                >
                  Continue
                </Button>
              </Box>
            </Box>
          </RoundContainer>
        </Box>
      </Box>
    )
  }

  return (
    <Box width="100%" minHeight="100vh" background="#F2F4F7">
      <Box height="58px" padding="10px 20px">
        <Link to="/wallet">
          <Image src={IconLogo} h="44px" />
        </Link>
      </Box>
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
              Sign with <Box as="span" borderBottom="1px solid black" borderStyle="dotted">passkey</Box>
            </Heading>
            <TextBody fontWeight="600">Turn your own device into hardware wallet! Add passkey now <Box as="span" color="#FF2E79">for free</Box>!</TextBody>
            <Box
              marginBottom="90px"
              background="#F7F7F7"
              padding="24px"
              margin="24px"
              borderRadius="20px"
              width="700px"
              maxWidth="100%"
            >
              <Heading type="h4" marginBottom="18px">
                Why sign with passkey?
              </Heading>
              <Box width="100%" display="flex" marginBottom="18px">
                <Box width="50%">
                  <Title marginBottom="5px">👍🏻 Advantage:</Title>
                  <Box paddingLeft="20px">
                    <TextBody type="t2">
                      Much more secure. Resistant to phishing.
                    </TextBody>
                    <TextBody type="t2">
                      Easier to use. Login and sign faster with your face/touch ID.
                    </TextBody>
                    <TextBody type="t2">
                      Sync end-to-end encrypted across Apple devices via iCloud keychain.
                    </TextBody>
                  </Box>
                </Box>
                <Box width="50%">
                  <Title marginBottom="5px">👍🏻 Disadvantage:</Title>
                  <Box paddingLeft="20px">
                    <TextBody type="t2">
                      {`More expensive. It cost $0.7 more to send an ERC-20 token on L2 comparing sign with EOA ($0.86 vs. $0.16).`}
                    </TextBody>
                    <TextBody type="t2">
                      {`Bound with our website. Your passkey only works with our website (also save you from scam sites).`}
                    </TextBody>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Button
                  width="275px"
                  maxWidth="100%"
                  theme="light"
                >
                  <Box marginRight="8px"><PlusIcon color="black" /></Box>
                  Add Passkey
                </Button>
              </Box>
            </Box>
            <Box>
              <Button
                width="80px"
                theme="light"
                marginRight="18px"
              >
                Skip
              </Button>
              <Button
                width="115px"
                maxWidth="100%"
                theme="dark"
                onClick={addPasskey}
              >
                Continue
              </Button>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </Box>
  )
}
