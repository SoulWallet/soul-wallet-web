import { useState } from 'react';
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
  ModalHeader,
} from '@chakra-ui/react';
import TextBody from '@/components/web/TextBody';
import Button from '@/components/web/Button';
import Logo from '@/components/web/Logo';
import usePassKey from '@/hooks/usePasskey';
import storage from '@/lib/storage';
import { PassKeySelect } from '@/components/web/PassKeyList';
import { useCredentialStore } from '@/store/credential';
import { useAddressStore } from '@/store/address';
import { useSearchParams } from 'react-router-dom';

export default function Launch() {
  const { register, authenticate } = usePassKey();
  const { navigate } = useBrowser();
  const toast = useToast();
  const { credentials, clearCredentials } = useCredentialStore();
  const { addressList, clearAddressList } = useAddressStore();
  const [isAuthing, setIsAuthing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const isPopup = searchParams.get('isPopup');

  const login = async () => {
    if (credentials.length) {
      toggleModal();
    } else {
      toast({
        title: 'No account yet',
        status: 'error',
      });
    }
  };

  const auth = async (credential: any) => {
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
      if (isPopup === 'true') {
        // redirect to popup
        navigate({ pathname: '/popup', search: location.href });
      } else {
        navigate('/wallet');
      }
    } catch (error: any) {
      console.log('error', error);
      setIsAuthing(false);
      toast({
        title: error.message,
        status: 'error',
      });
    }
  };

  const resetWallet = () => {
    clearCredentials();
    clearAddressList();
    storage.clear();
  };

  const createWallet = async () => {
    try {
      resetWallet();
      setIsCreating(true);
      await register(true);
      setIsCreating(false);
      navigate({
        pathname: '/create',
        search: location.search,
      });
    } catch (error: any) {
      console.log('error', error);
      setIsCreating(false);
      toast({
        title: error.message,
        status: 'error',
      });
    }
  };

  const onSelectPassKey = async (passKey: any) => {
    toggleModal();
    auth(passKey);
    console.log('onSelectPassKey', passKey);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <Box width="100vw" height="100vh" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
      <Logo direction="column" />
      <Box display="flex" flexDirection="column" alignItems="center" margin="50px 0" paddingBottom="50px">
        <Box display="flex" justifyContent="center" alignItems="center">
          {credentials.length && addressList.length ? (
            <Button
              disabled={isAuthing}
              loading={isAuthing}
              onClick={login}
              _styles={{ width: '282px', borderRadius: '40px', marginRight: '20px' }}
            >
              Login
            </Button>
          ) : (
            <Button
              disabled={isCreating}
              loading={isCreating}
              onClick={createWallet}
              _styles={{ width: '282px', borderRadius: '40px' }}
            >
              Create new wallet
            </Button>
          )}
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
