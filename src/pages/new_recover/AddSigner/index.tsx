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
import StepProgress from '../StepProgress'

export default function AddSigner({ next }: any) {
  const [signerList, setSignerList] = useState<any>([])
  const toast = useToast();
  const { navigate } = useBrowser();

  const back = useCallback(() => {
    navigate(`/auth`);
  }, [])

  const addSigner = useCallback((type: any) => {
    setSignerList([...signerList, { type }])
  }, [signerList])

  console.log('signerList', signerList)
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
              Step 2/4: Add Signer
            </Heading>
            <TextBody
              fontWeight="600"
              maxWidth="650px"
              marginBottom="20px"
            >
              Sign transactions on the using your preferred method, whether it's through an externally owned account (EOA) such as MetaMask or Ledger, or by creating a passkey.
            </TextBody>
            <Box marginBottom="10px">
              {signerList.map((signer: any) => {
                if (signer.type === 'eoa') {
                  return (
                    <Box marginBottom="10px">
                      <Box width="550px">
                        <Input placeholder="Enter ENS or wallet adderss" borderColor="#E4E4E4" />
                      </Box>
                    </Box>
                  )
                } else {
                  return (
                    <Box background="white" borderRadius="12px" padding="16px" width="100%" border="1px solid #E4E4E4" marginBottom="10px">
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
                  )
                }
              })}
            </Box>
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Menu>
                <MenuButton
                  width="275px"
                  maxWidth="100%"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border="1px solid #E4E4E4"
                    borderRadius="50px"
                    height="36px"
                    width="200px"
                    fontWeight="bold"
                    fontSize="14px"
                    fontFamily="Nunito"
                  >
                    <Box marginRight="8px"><PlusIcon color="black" /></Box>
                    <Box>Add Passkey</Box>
                  </Box>
                </MenuButton>
                <MenuList padding="0">
                  <MenuItem
                    fontSize="14px"
                    fontFamily="Nunito"
                    fontWeight="600"
                    onClick={() => addSigner('eoa')}
                    borderBottom="1px solid #D0D5DD"
                    height="48px"
                  >
                    <Box
                      width="24px"
                      height="24px"
                      background="#D9D9D9"
                      borderRadius="24px"
                      marginRight="10px"
                    />
                    <Box>EOA Wallet</Box>
                  </MenuItem>
                  <MenuItem
                    fontSize="14px"
                    fontFamily="Nunito"
                    fontWeight="600"
                    onClick={() => addSigner('passkey')}
                    height="48px"
                  >
                    <Box
                      width="24px"
                      height="24px"
                      background="#D9D9D9"
                      borderRadius="24px"
                      marginRight="10px"
                    />
                    <Box>Passkey</Box>
                  </MenuItem>
                </MenuList>
              </Menu>

              {/* <Button
                  width="275px"
                  maxWidth="100%"
                  theme="light"
                  >
                  <Box marginRight="8px"><PlusIcon color="black" /></Box>
                  Add Passkey
                  </Button> */}
            </Box>
            <Box width="100%" display="flex" alignItems="center" justifyContent="center" marginTop="100px">
              <Button
                width="80px"
                theme="light"
                marginRight="18px"
                type="mid"
                onClick={back}
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
        <StepProgress activeIndex={1} />
      </Box>
    </Box>
  )
}
