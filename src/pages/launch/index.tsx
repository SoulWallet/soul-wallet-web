import { useState } from 'react'
import FullscreenContainer from '@/components/FullscreenContainer';
import { StepActionTypeEn, useStepDispatchContext, CreateStepEn, RecoverStepEn } from '@/context/StepContext';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Text,
  Image,
  useToast,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  ModalHeader
} from '@chakra-ui/react';
import CreateWalletIcon from '@/components/Icons/CreateWallet';
import RecoverWalletIcon from '@/components/Icons/RecoverWallet';
import TextBody from '@/components/web/TextBody';
import storage from '@/lib/storage';
import Button from '@/components/web/Button';
import Logo from '@/components/web/Logo';
import usePassKey from '@/hooks/usePasskey';
import { PassKeySelect } from '@/components/web/PassKeyList';
import { useCredentialStore } from '@/store/credential';

export default function Launch() {
  const { register, authenticate } = usePassKey();
  const { navigate } = useBrowser();
  const toast = useToast();
  const { credentials } = useCredentialStore();
  const [isAuthing, setIsAuthing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const login = async (credential) => {
    if (credentials.length) {
      toggleModal()
    } else {
      toast({
        title: 'No account yet',
        status: 'error',
      });
    }
  }

  const auth = async (credential) => {
    try {
      setIsAuthing(true);
      const credentialId = credential.id;
      const challenge = btoa('1234567890');
      await authenticate(credentialId, challenge);
      setIsAuthing(false);
      toast({
        title: `${credential.name} logged in`,
        status: 'success',
      });
    } catch (error: any) {
      console.log('error', error.message);
      setIsAuthing(false);
      toast({
        title: error.message,
        status: 'error',
      });
    }
  }

  const createWallet = async () => {
    try {
      setIsCreating(true);
      await register();
      setIsCreating(false);
      navigate('create');
    } catch (error: any) {
      console.log('error', error.message);
      setIsCreating(false);
      toast({
        title: error.message,
        status: 'error',
      });
    }
  }

  const onSelectPassKey = async (passKey) => {
    toggleModal()
    auth(passKey)
    console.log('onSelectPassKey', passKey)
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <Box width="100vw" height="100vh" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
      <Logo direction="column" />
      <Box display="flex" flexDirection="column" alignItems="center" margin="50px 0" paddingBottom="50px">
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button disabled={isAuthing} loading={isAuthing} onClick={login} _styles={{ width: '282px', borderRadius: '40px', marginRight: '20px' }}>
            Login
          </Button>
          <Button disabled={isCreating} loading={isCreating} onClick={createWallet} _styles={{ width: '282px', borderRadius: '40px' }}>
            Create new wallet
          </Button>
        </Box>
        <TextBody color="#898989" marginTop="24px">
          Soul Wallet will create a smart contract wallet for you using passkeys.
        </TextBody>
        <Modal isOpen={isModalOpen} onClose={toggleModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Sellect PassKey</ModalHeader>
            <ModalCloseButton />
            <ModalBody overflow="scroll">
              <PassKeySelect passKeys={credentials} onSelect={onSelectPassKey} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
