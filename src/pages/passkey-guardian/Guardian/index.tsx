import React, { useState, useEffect, Fragment } from 'react';
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
import TextButton from '@/components/web/TextButton';
import RoundButton from '@/components/web/Button';
import PlusIcon from '@/components/Icons/Plus';
import SuccessIcon from "@/components/Icons/Success";
import GuardianIntro from './GuardianIntro'
import GuardianList from './GuardianList'
import GuardianForm from './GuardianForm'

function GuardianEditor() {
  return (
    <Fragment>
      <Box background="#D9D9D9" borderRadius="20px" padding="45px" display="flex">
        <Box width="40%" paddingRight="32px">
          <Heading1>Current guardian</Heading1>
          <TextBody fontSize="18px" marginBottom="20px">Choose trusted friends or use your existing Ethereum wallets as guardians. Learn more</TextBody>
          <Box>
            <TextButton _styles={{ padding: '0', color: '#EC588D' }} _hover={{ color: '#EC588D' }} onClick={() => {}}>
              Learn more
            </TextButton>
          </Box>
        </Box>
        <Box width="60%">
        </Box>
      </Box>
      <Box padding="40px">
        <Box display="flex" alignItems="center" justifyContent="center">
          <RoundButton _styles={{ width: '320px', background: '#1E1E1E', color: 'white' }} _hover={{ background: '#1E1E1E', color: 'white' }} onClick={() => {}}>
            Backup current guardian
          </RoundButton>
        </Box>
      </Box>
    </Fragment>
  )
}

export default function Guardian({ setActiveSection }: any) {
  const [isEditing, setIsEditing] = useState<boolean>();
  const [isManaging, setIsManaging] = useState<boolean>();
  const [isManagingNetworkFee, setIsManagingNetworkFee] = useState<boolean>();
  const [isSyncing, setIsSyncing] = useState<boolean>();

  const startManage = () => {
    setIsManaging(true)
    setIsEditing(false)
  }

  const startEdit = () => {
    setIsManaging(false)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsManaging(true)
    setIsEditing(false)
  }

  return (
    <Box width="100%" height="100vh">
      <Box height="102px">
        <Header />
      </Box>
      <Box width="100%" height="calc(100% - 102px)">
        <Box padding="32px 39px">
          <Heading1>Passkey and Guardian Settings</Heading1>
          <Box display="flex" width="100%">
            <Heading2 fontSize="18px" color="#898989" padding="10px" cursor="pointer" onClick={() => setActiveSection('passkey')}>
              Passkey
            </Heading2>
            <Heading2 fontSize="18px" color="#EC588D" padding="10px" cursor="pointer" onClick={() => setActiveSection('guardian')}>
              Guardian
            </Heading2>
            {(isManaging || isEditing) && (
              <Box marginLeft="auto">
                <Button
                  px="5"
                  onClick={() => startEdit()}
                  bg="#1e1e1e"
                  _hover={{bg: "#4e4e54"}}
                  color="#fff"
                  fontWeight={'700'}
                  rounded="50px"
                  disabled={isEditing}
                >
                  Edit Guardians
                </Button>
              </Box>
            )}
          </Box>
          {(!isManaging && !isEditing) && <GuardianIntro startManage={startManage} />}
          {(isManaging && !isEditing) && <GuardianList />}
          {(!isManaging && isEditing) && <GuardianForm cancelEdit={cancelEdit} />}
        </Box>
      </Box>
    </Box>
  );
}
