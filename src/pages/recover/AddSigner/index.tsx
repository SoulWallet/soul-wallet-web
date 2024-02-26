import { useState, useCallback } from 'react';
import {
  Box,
  Text,
  Flex,
  useToast,
  Input,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
} from '@chakra-ui/react';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/Button'
import PlusIcon from '@/components/Icons/Plus';
import ComputerIcon from '@/components/Icons/Computer';
import PasskeySignerIcon from '@/components/Icons/PasskeySigner'
import EOASignerIcon from '@/components/Icons/EOASigner'
import usePassKey from '@/hooks/usePasskey';
import { useTempStore } from '@/store/temp';
import { useSettingStore } from '@/store/setting';
import { useConnect, useDisconnect } from 'wagmi'
import useConfig from '@/hooks/useConfig';
import api from '@/lib/api';
import { L1KeyStore } from '@soulwallet/sdk';
import Icon from '@/components/Icon';
import MinusIcon from '@/assets/icons/minus.svg';
import ConnectWalletModal from '../ConnectWalletModal'
import StepProgress from '../StepProgress'
import { SignHeader } from '@/pages/public/Sign';

export default function AddSigner({ next, back }: any) {
  const [signers, setSigners] = useState<any>([])
  const [isConfirming, setIsConfirming] = useState<any>(false)
  const [isConnectOpen, setIsConnectOpen] = useState<any>(false)
  const toast = useToast();
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const { register } = usePassKey()
  const { updateRecoverInfo } = useTempStore()
  const { chainConfig } = useConfig();
  const { recoverInfo } = useTempStore()
  const { saveRecoverRecordId } = useSettingStore();

  const addCredential = useCallback(async () => {
    try {
      const credential = await register();
      setSigners([...signers, { type: 'passkey', signerId: credential.publicKey, ...credential }])
    } catch (error: any) {
      let message = error.message

      if (message && message.indexOf('The operation either timed out or was not allowed') !== -1) {
        message = 'Useer canceled the operation.'
      }

      toast({
        title: message,
        status: 'error',
      });
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

    if (!hasGuardians) {
      next()
      return
    }

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

      saveRecoverRecordId(slot, recoveryRecordID)
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

  const removeSigner = useCallback((id: any) => {
    setSigners(signers.filter((item: any) => item.signerId !== id))
  }, [signers])

  console.log('signers', signers)

  return (
    <Flex width="100%" align={'center'} justify={'center'} minHeight="100vh" background="#F2F4F7">
      <SignHeader url="/auth" />
      <Box
        padding="20px"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        minHeight="calc(100% - 58px)"
        width="100%"
        paddingTop="60px"
        flexDirection={{ base: 'column', 'md': 'row' }}
      >
        <RoundContainer
          width="1058px"
          maxWidth="100%"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          background="white"
          marginBottom="20px"
        >
          <Box
            width="100%"
            height="100%"
            padding={{ base: '20px', md: '50px' }}
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
              maxWidth={{ base: '100%', 'md': '650px' }}
              marginBottom="20px"
            >
              Sign transactions on the using your preferred method, whether it's through an externally owned account (EOA) such as MetaMask or Ledger, or by creating a passkey.
            </TextBody>
            <Box marginBottom="10px" width="100%">
              {signers.map((signer: any) => {
                if (signer.type === 'eoa') {
                  return (
                    <Box
                      marginBottom="10px"
                      key={signer.signerId}
                      position="relative"
                      maxWidth={{ base: '550px', 'md': '550px' }}
                      width={{ base: 'calc(100% - 30px)', md: '100%' }}
                    >
                      <Box
                        width="100%"
                      >
                        <Input
                          placeholder="Enter ENS or wallet adderss"
                          borderColor="#E4E4E4"
                          value={signer.signerId}
                          readOnly={true}
                        />
                      </Box>
                      <Box
                        onClick={() => removeSigner(signer.signerId)}
                        position="absolute"
                        width="40px"
                        right={{ base: '-40px', md: '-40px' }}
                        top="0"
                        height="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                      >
                        <Icon src={MinusIcon} />
                      </Box>
                    </Box>
                  )
                } else {
                  return (
                    <Box
                      background="white"
                      borderRadius="12px"
                      padding="16px"
                      border="1px solid #E4E4E4"
                      marginBottom="10px"
                      key={signer.signerId}
                      position="relative"
                      maxWidth={{ base: '550px', md: '550px' }}
                      width={{ base: 'calc(100% - 30px)', md: '100%' }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        width="100%"
                      >
                        <Box width="50px" height="50px" background="#efefef" borderRadius="50px" marginRight="16px" display="flex" alignItems="center" justifyContent="center"><ComputerIcon /></Box>
                        <Box>
                          <Text color="rgb(7, 32, 39)" fontSize="18px" fontWeight="800">
                            {signer.name}
                          </Text>
                        </Box>
                      </Box>
                      <Box
                        onClick={() => removeSigner(signer.signerId)}
                        position="absolute"
                        width="40px"
                        right={{ base: '-40px', md: '-40px' }}
                        top="0"
                        height="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                      >
                        <Icon src={MinusIcon} />
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
                    <Box>Add Signer</Box>
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
                type="white"
                marginRight="12px"
                size="lg"
                onClick={back}
              >
                Back
              </Button>
              <Button
                width="80px"
                maxWidth="100%"
                type="black"
                size="lg"
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
      <ConnectWalletModal isOpen={isConnectOpen} connectEOA={addEOA} onClose={() => setIsConnectOpen(false)} />
    </Flex>
  )
}
