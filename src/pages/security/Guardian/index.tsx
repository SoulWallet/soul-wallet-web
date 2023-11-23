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
import api from '@/lib/api';
import { L1KeyStore } from '@soulwallet/sdk';
import { useAddressStore } from '@/store/address';
import useKeystore from '@/hooks/useKeystore';
import { useGuardianStore } from '@/store/guardian';
import GuardianIntro from './GuardianIntro'
import GuardianList from './GuardianList'
import GuardianForm from './GuardianForm'
import GuardianBackup from './GuardianBackup'

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
  const { getActiveGuardianHash } = useKeystore();
  const [status, setStatus] = useState<string>('intro');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { guardiansInfo, updateGuardiansInfo, editingGuardiansInfo,  slotInfo, } = useGuardianStore();

  const isPending = editingGuardiansInfo && !!editingGuardiansInfo.guardianDetails && editingGuardiansInfo.guardianHash !== guardiansInfo.guardianHash

  const startManage = () => {
    setStatus('managing')
  }

  const startBackup = () => {
    setStatus('backuping')
  }

  const startIntro = () => {
    setStatus('intro')
  }

  const startEdit = () => {
    setStatus('editing')
  }

  const cancelEdit = () => {
    setStatus('managing')
  }

  const cancelBackup = () => {
    setStatus('managing')
  }

  console.log('guardiansInfo', guardiansInfo)

  const getGuardianInfo = async () => {
    try {
      const activeGuardianInfo = await getActiveGuardianHash(slotInfo)
      let activeGuardianHash

      if (activeGuardianInfo.pendingGuardianHash !== activeGuardianInfo.activeGuardianHash && activeGuardianInfo.guardianActivateAt && activeGuardianInfo.guardianActivateAt * 1000 < Date.now()) {
        activeGuardianHash = activeGuardianInfo.pendingGuardianHash
      } else {
        activeGuardianHash = activeGuardianInfo.activeGuardianHash
      }

      const res2 = await api.guardian.getGuardianDetails({ guardianHash: activeGuardianHash });
      const data = res2.data;
      const guardianDetails = data.guardianDetails;

      const guardiansInfo: any = {
        guardianHash: activeGuardianHash,
        guardianDetails,
      };

      if (editingGuardiansInfo.guardianHash === guardiansInfo.guardianHash) {
        guardiansInfo.guardianNames = editingGuardiansInfo.guardianNames
      }

      updateGuardiansInfo({
        ...guardiansInfo
      })

      const hasGuardians = guardiansInfo.guardianDetails && guardiansInfo.guardianDetails.guardians && !!guardiansInfo.guardianDetails.guardians.length

      if (hasGuardians) {
        startManage()
      } else {
        startEdit()
      }

      setIsLoaded(true)
    } catch (error) {
      setIsLoaded(true)
    }
  }

  useEffect(() => {
    if (guardiansInfo.requireBackup) {
      startBackup()
      setIsLoaded(true)
    } else {
      getGuardianInfo()
    }
  }, [])

  if (!isLoaded) {
    return (
      <Box width="100%" height="100vh">
        <Box height="102px">
          <Header />
        </Box>
        <Box width="100%" height="calc(100% - 102px)">
          <Box padding="32px 39px">
            <Heading1>Passkey and Guardian Settings</Heading1>
            <Box display="flex" width="100%">
              <Heading2 fontSize="18px" color="#EC588D" padding="10px" cursor="pointer" onClick={() => setActiveSection('guardian')}>
                Guardian
              </Heading2>
              <Heading2 fontSize="18px" color="#898989" padding="10px" cursor="pointer" onClick={() => setActiveSection('passkey')}>
                Passkey
              </Heading2>
            </Box>
            <Heading1 textAlign="center">Loading...</Heading1>
          </Box>
        </Box>
      </Box>
    )
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
            <Heading2 fontSize="18px" color="#EC588D" padding="10px" cursor="pointer" onClick={() => setActiveSection('guardian')}>
              Guardian
            </Heading2>
            <Heading2 fontSize="18px" color="#898989" padding="10px" cursor="pointer" onClick={() => setActiveSection('passkey')}>
              Passkey
            </Heading2>
            {(status === 'managing') && (
              <Box marginLeft="auto">
                {isPending && (
                  <Button
                    px="5"
                    onClick={() => startBackup()}
                    bg="#1e1e1e"
                    _hover={{bg: "#4e4e54"}}
                    color="#fff"
                    fontWeight={'700'}
                    rounded="50px"
                    disabled={(status as any) === 'editing'}
                    marginRight="14px"
                    fontSize={{ base: '12px', md: '16px' }}
                  >
                    Backup Current Guardians
                  </Button>
                )}
                <Button
                  px="5"
                  onClick={() => startEdit()}
                  bg="#1e1e1e"
                  _hover={{bg: "#4e4e54"}}
                  color="#fff"
                  fontWeight={'700'}
                  rounded="50px"
                  disabled={(status as any) === 'editing'}
                  fontSize={{ base: '12px', md: '16px' }}
                >
                  Edit Guardians
                </Button>
              </Box>
            )}
          </Box>
          {status === 'intro' && <GuardianIntro startManage={startManage} startEdit={startEdit} />}
          {status === 'managing' && <GuardianList startBackup={startBackup} />}
          {status === 'editing' && <GuardianForm cancelEdit={cancelEdit} startBackup={startBackup} />}
          {status === 'backuping' && <GuardianBackup cancelBackup={cancelBackup} />}
        </Box>
      </Box>
    </Box>
  );
}
