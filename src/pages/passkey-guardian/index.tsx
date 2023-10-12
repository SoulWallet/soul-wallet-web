import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/react';
import Header from '@/components/Header';
import Heading1 from '@/components/web/Heading1';
import Heading2 from '@/components/web/Heading2';
import TextBody from '@/components/web/TextBody';
import PassKeyList from '@/components/web/PassKeyList';
import TextButton from '@/components/web/TextButton';
import RoundButton from '@/components/web/Button';
import PlusIcon from '@/components/Icons/Plus';
import SuccessIcon from "@/components/Icons/Success";
import { useCredentialStore } from '@/store/credential';

function SyncPasskeModal({ isOpen, onClose }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#ededed" maxW={'520px'}>
        <ModalHeader
          display={'flex'}
          justifyContent={'center'}
          gap="5"
          fontWeight={'800'}
          textAlign={'center'}
          borderBottom={'1px solid #d7d7d7'}
        >
          Sync with another PC/Mac
        </ModalHeader>
        <ModalCloseButton top="14px" />
        <ModalBody pb="12" px="12">
          <Box
            bg="#ededed"
            h="100%"
            roundedBottom="20px"
            p="6"
          >
            <TextBody>Please open this link on the other computer to continue.</TextBody>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function ManagePasskeyNetworkFeeModal({ isOpen, onClose }: any) {
  const [step, setStep] = useState<number>(0)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#ededed" maxW={'520px'}>
        <ModalHeader
          display={'flex'}
          justifyContent={'center'}
          gap="5"
          fontWeight={'800'}
          textAlign={'center'}
          borderBottom={'1px solid #d7d7d7'}
        >
          Manage Passkey Network Fee
        </ModalHeader>
        <ModalCloseButton top="14px" />
        <ModalBody pb="12" px="12" overflow="scroll">
          <Box
            bg="#ededed"
            h="100%"
            roundedBottom="20px"
            p="6"
          >
            {step === 0 && (
              <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                <TextBody>Estimated fee</TextBody>
                <Heading1 fontSize="32px" marginBottom="0">0.0022 ETH</Heading1>
                <TextBody color="#898989" fontSize="16px">$4.56</TextBody>
                <Box display="block" height="1px" width="100%" margin="10px 0" background="#D7D7D7" />
                <Box display="flex" width="100%" padding="5px 0" alignItems="center" justifyContent="space-between">
                  <TextBody>Pay with:</TextBody>
                  <TextBody color="#EC588D">Account 1</TextBody>
                </Box>
                <Box display="flex" width="100%" padding="5px 0" alignItems="center" justifyContent="space-between">
                  <TextBody>On network:</TextBody>
                  <TextBody color="#EC588D">Arbitrum</TextBody>
                </Box>
                <Box marginTop="40px">
                  <Box display="flex" flexDirection="column" alignItems="center" marginTop="0.75em">
                    <RoundButton _styles={{ width: '320px', background: '#EC588D', color: 'white' }} _hover={{ background: '#EC588D', color: 'white' }} onClick={() => setStep(1)}>
                      Preview payment
                    </RoundButton>
                    <TextButton _styles={{ width: '320px', color: '#E83D26' }} _hover={{ color: '#EC588D' }}>
                      Cancel
                    </TextButton>
                  </Box>
                </Box>
              </Box>
            )}
            {step === 1 && (
              <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                <TextBody>Send</TextBody>
                <Heading1 fontSize="32px" marginBottom="0">1.01 ETH</Heading1>
                <TextBody color="#898989" fontSize="16px">$1,734.56</TextBody>
                <Box display="block" height="1px" width="100%" margin="10px 0" background="#D7D7D7" />
                <Box display="flex" width="100%" padding="5px 0" alignItems="center" justifyContent="space-between">
                  <TextBody>To</TextBody>
                  <TextBody>0x122412345678E25FDa5f8a56B8e267fDaB6dS324</TextBody>
                </Box>
                <Box display="flex" width="100%" padding="5px 0" alignItems="center" justifyContent="space-between">
                  <TextBody>From</TextBody>
                  <TextBody>Account 1 (0x1256...S324)</TextBody>
                </Box>
                <Box display="flex" width="100%" padding="5px 0" alignItems="center" justifyContent="space-between">
                  <TextBody>Network</TextBody>
                  <TextBody>Ethereum</TextBody>
                </Box>
                <Box display="flex" width="100%" padding="5px 0" alignItems="center" justifyContent="space-between">
                  <TextBody>Gas fee</TextBody>
                  <TextBody>0.08 USDC</TextBody>
                </Box>
                <Box display="flex" width="100%" padding="5px 0" alignItems="center" justifyContent="space-between">
                  <TextBody>Total</TextBody>
                  <TextBody>1.08 ETH + 0.08 USDC</TextBody>
                </Box>
                <Box marginTop="40px">
                  <Box display="flex" flexDirection="column" alignItems="center" marginTop="0.75em">
                    <RoundButton _styles={{ width: '320px', background: '#EC588D', color: 'white' }} _hover={{ background: '#EC588D', color: 'white' }} onClick={() => setStep(2)}>
                      Pay
                    </RoundButton>
                    <TextButton _styles={{ width: '320px', color: '#E83D26' }} _hover={{ color: '#EC588D' }}>
                      Cancel
                    </TextButton>
                  </Box>
                </Box>
              </Box>
            )}
            {step === 2 && (
              <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                <Heading1 fontSize="20px">Payment completed!</Heading1>
                <Box marginBottom="12px">
                  <SuccessIcon />
                </Box>
                <TextBody>
                  Editing passkey setting and syncing devices will take effect between 30 minutes to 1 day after payment. You may check the sync status on wallet home page.
                </TextBody>
                <Box marginTop="20px">
                  <Box display="flex" flexDirection="column" alignItems="center" marginTop="0.75em">
                    <RoundButton _styles={{ width: '320px', background: '#1E1E1E', color: 'white', borderRadius: '50px' }} _hover={{ background: '#1E1E1E', color: 'white' }} onClick={() => {}}>
                      Check status
                    </RoundButton>
                    <TextButton _styles={{ width: '320px', color: '#1E1E1E' }}>
                      View transaction
                    </TextButton>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default function PasskeyGuardian() {
  const { credentials, changeCredentialName } = useCredentialStore();
  const [isEditing, setIsEditing] = useState<boolean>();
  const [isManagingNetworkFee, setIsManagingNetworkFee] = useState<boolean>();
  const [isSyncing, setIsSyncing] = useState<boolean>();

  return (
    <Box width="100%" height="100vh">
      <Box height="102px">
        <Header />
      </Box>
      <Box width="100%" height="calc(100% - 102px)">
        <Box padding="32px 39px">
          <Heading1>Passkey and Guardian Settings</Heading1>
          <Box display="flex" width="100%">
            <Heading2 fontSize="18px" color="#EC588D" padding="10px" cursor="pointer">
              Passkey
            </Heading2>
            <Heading2 fontSize="18px" color="#898989" padding="10px" cursor="pointer">
              Guardian
            </Heading2>
            <Box marginLeft="auto">
              <Button
                px="5"
                onClick={() => setIsEditing(true)}
                bg="#1e1e1e"
                _hover={{bg: "#4e4e54"}}
                color="#fff"
                fontWeight={'700'}
                rounded="50px"
                disabled={isEditing}
              >
                Manage Passkey
              </Button>
            </Box>
          </Box>
          <Box background="#D9D9D9" borderRadius="20px" padding="45px" display="flex">
            <Box width="40%" paddingRight="32px">
              <Heading1>My passkeys</Heading1>
              <TextBody fontSize="18px" marginBottom="20px">Adding a passkey allows you to manage your wallet, including access, transactions, and setting guardians from another device. Future accounts will sync automatically.</TextBody>
              <TextBody fontSize="18px" marginBottom="20px">Edit passkey setting and sync devices will take effect between 30 minutes to 1 day.</TextBody>
              <Box>
                <TextButton onClick={() => {}} color="#EC588D" _hover={{ color: '#EC588D' }} padding="0px">
                  <PlusIcon color="#EC588D" />
                  <Text marginLeft="5px">Add a new mobile device</Text>
                </TextButton>
              </Box>
              <Box>
                <TextButton onClick={() =>{}} color="#EC588D" _hover={{ color: '#EC588D' }} padding="0px">
                  <PlusIcon color="#EC588D" />
                  <Text marginLeft="5px">Add a new PC device</Text>
                </TextButton>
              </Box>
              <Box>
                <TextButton onClick={() => {}} color="#EC588D" _hover={{ color: '#EC588D' }} padding="0px">
                  <PlusIcon color="#EC588D" />
                  <Text marginLeft="5px">Add a USB security key </Text>
                </TextButton>
              </Box>
            </Box>
            <Box width="60%">
              <PassKeyList passKeys={credentials} setPassKeyName={changeCredentialName} hideTitle={true} />
            </Box>
          </Box>
        </Box>
        <Box paddingBottom="20px">
          <Box display="flex" flexDirection="column" alignItems="center" marginTop="0.75em">
            <RoundButton _styles={{ width: '320px' }} onClick={() => setIsManagingNetworkFee(true)}>
              Confirm change
            </RoundButton>
            <TextButton _styles={{ width: '320px' }}>
              Cancel
            </TextButton>
          </Box>
        </Box>
      </Box>
      <ManagePasskeyNetworkFeeModal isOpen={isManagingNetworkFee} onClose={() => setIsManagingNetworkFee(false)} />
      <SyncPasskeModal isOpen={isSyncing} onClose={() => setIsSyncing(false)} />
    </Box>
  );
}
