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
import PasskeySignerIcon from '@/components/Icons/PasskeySigner'
import EOASignerIcon from '@/components/Icons/EOASigner'
import usePassKey from '@/hooks/usePasskey';
import { useSignerStore } from '@/store/signer';
import { useTempStore } from '@/store/temp';
import { useAccount, useConnect, useReconnect, useDisconnect } from 'wagmi'
import useConfig from '@/hooks/useConfig';
import api from '@/lib/api';
import { L1KeyStore } from '@soulwallet/sdk';
import ConnectWalletModal from '../ConnectWalletModal'
import StepProgress from '../StepProgress'

export default function AddSigner({ next }: any) {
  const [signers, setSigners] = useState<any>([])
  const [credentials, setCredentials] = useState<any>([])
  const [isCreating, setIsCreating] = useState<any>(false)
  const [isConfirming, setIsConfirming] = useState<any>(false)
  const [isConnectOpen, setIsConnectOpen] = useState<any>(false)
  const [eoas, setEoas] = useState<any>([])
  const toast = useToast();
  const { connect, connectAsync } = useConnect()
  const { disconnect, disconnectAsync } = useDisconnect()
  const { register } = usePassKey()
  const { navigate } = useBrowser();
  const { updateRecoverInfo } = useTempStore()
  const { chainConfig } = useConfig();
  const { recoverInfo } = useTempStore()

  const back = useCallback(() => {
    navigate(`/auth`);
  }, [])

  const addCredential = useCallback(async () => {
    try {
      const credential = await register();
      setSigners([...signers, { type: 'passkey', signerId: credential.publicKey, ...credential }])
    } catch (error: any) {

    }
  }, [signers])

  const addEOA = useCallback(async (connector: any) => {
    try {
      await disconnectAsync()
      const { accounts } = await connectAsync({ connector });
      const eoa = accounts[0]
      setSigners([...signers, { type: 'eoa', signerId: eoa }])
      setIsConnectOpen(false)
    } catch (error: any) {
      toast({
        title: error.message,
        status: 'error',
      });
    }
  }, [signers])

  const handleNext = async () => {
    updateRecoverInfo({
      signers
    })

    const hasGuardians = recoverInfo.guardianDetails && recoverInfo.guardianDetails.guardians && !!recoverInfo.guardianDetails.guardians.length

    try {
      setIsConfirming(true)
      const keystore = chainConfig.contracts.l1Keystore;
      const initialKeys = signers.map((signer: any) => signer.signerId)
      const newOwners = L1KeyStore.initialKeysToAddress(initialKeys)
      const slot = recoverInfo.slot
      const slotInitInfo = recoverInfo.slotInitInfo
      const guardianDetails = recoverInfo.guardianDetails

      const params = {
        guardianDetails,
        slot,
        slotInitInfo,
        keystore,
        newOwners
      }

      const res1 = await api.guardian.createRecoverRecord(params)
      const recoveryRecordID = res1.data.recoveryRecordID
      const res2 = await api.guardian.getRecoverRecord({ recoveryRecordID })
      const recoveryRecord = res2.data

      updateRecoverInfo({
        recoveryRecordID,
        recoveryRecord,
        enabled: false,
      });

      setIsConfirming(false)
      next()
    } catch (error: any) {
      setIsConfirming(false);
      toast({
        title: error.message,
        status: 'error',
      });
    }
  };

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
              {signers.map((signer: any) => {
                if (signer.type === 'eoa') {
                  return (
                    <Box marginBottom="10px" key={signer.signerId}>
                      <Box width="550px">
                        <Input placeholder="Enter ENS or wallet adderss" borderColor="#E4E4E4" value={signer.signerId} readOnly={true} />
                      </Box>
                    </Box>
                  )
                } else {
                  return (
                    <Box background="white" borderRadius="12px" padding="16px" width="100%" border="1px solid #E4E4E4" marginBottom="10px" key={signer.signerId}>
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
                    onClick={() => setIsConnectOpen(true)}
                    borderBottom="1px solid #D0D5DD"
                    height="48px"
                  >
                    <Box
                      width="24px"
                      height="24px"
                      borderRadius="24px"
                      marginRight="10px"
                    >
                      <EOASignerIcon />
                    </Box>
                    <Box>EOA Wallet</Box>
                  </MenuItem>
                  <MenuItem
                    fontSize="14px"
                    fontFamily="Nunito"
                    fontWeight="600"
                    onClick={() => addCredential()}
                    height="48px"
                  >
                    <Box
                      width="24px"
                      height="24px"
                      borderRadius="24px"
                      marginRight="10px"
                    >
                      <PasskeySignerIcon />
                    </Box>
                    <Box>Passkey</Box>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
            <Box width="100%" display="flex" alignItems="center" justifyContent="center" marginTop="100px">
              <Button
                width="80px"
                theme="light"
                marginRight="12px"
                type="lg"
                onClick={back}
              >
                Back
              </Button>
              <Button
                width="80px"
                maxWidth="100%"
                theme="dark"
                type="lg"
                onClick={handleNext}
                disabled={isConfirming || !signers || !signers.length}
                loading={isConfirming}
              >
                Next
              </Button>
            </Box>
          </Box>
        </RoundContainer>
        <StepProgress activeIndex={1} />
      </Box>
      <ConnectWalletModal isOpen={isConnectOpen} addEOA={addEOA} onClose={() => setIsConnectOpen(false)} />
    </Box>
  )
}
