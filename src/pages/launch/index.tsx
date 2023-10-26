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
  ModalHeader
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
import bgGradientImage from '@/assets/bg-gradient.png';
import homeExampleImage from '@/assets/home-example.png';
import TwitterIcon from '@/components/Icons/Social/Twitter';
import TelegramIcon from '@/components/Icons/Social/Telegram';
import GithubIcon from '@/components/Icons/Social/Github';
import config from '@/config'
import { Link } from 'react-router-dom';

export default function Launch() {
  const { register, authenticate } = usePassKey();
  const { navigate } = useBrowser();
  const toast = useToast();
  const { addCredential, credentials, clearCredentials } = useCredentialStore();
  const { addressList, clearAddressList, setSelectedAddress } = useAddressStore();
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
      const credentialName = `Passkey 1`;
      const credentialKey = await register(credentialName);
      addCredential(credentialKey)
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
    setSelectedAddress(addressList[0].address)
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      backgroundImage={`url(${bgGradientImage})`}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      overflow="scroll"
      position="relative"
    >
      <Box width="100%">
        <Box display="flex" justifyContent="flex-end">
          <Box>
            <Box
              padding="40px 0"
              backgroundColor="rgba(255, 255, 255, 0.35)"
              width="400px"
              minHeight="calc(100% - 5px)"
              display="flex"
              alignItems="center"
              justifyContent="space-around"
              flexDirection="column"
              overflow="scroll"
              marginRight="-10px"
              zIndex="2"

              background="rgba(255, 255, 255, 0.2)"
              borderRadius="16px"
              boxShadow="0 4px 30px rgba(0, 0, 0, 0.25)"
              backdropFilter="blur(4px)"
            >
              <Logo direction="column" />
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" margin="50px 0" width="320px">
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
                <TextBody color="#1E1E1E" marginTop="24px" fontSize="16px" textAlign="center">
                  Soul Wallet will create a smart contract wallet for you using passkey.
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
              <TextBody color="#000000" fontWeight="800" fontSize="20px" textAlign="center">
                <Link to="/recover">Lost your wallet?</Link>
              </TextBody>
            </Box>
          </Box>
          <Box minHeight="100%">
            <Image src={homeExampleImage} marginLeft="auto" height="100%" />
          </Box>
        </Box>
        <Box width="100%" display="flex" justifyContent="flex-end" padding="10px">
          <Box as="a" margin="0 5px" cursor="pointer" target="_blank" href={config.socials[0].link}><TwitterIcon /></Box>
          <Box as="a" margin="0 5px" cursor="pointer" target="_blank" href={config.socials[1].link}><TelegramIcon /></Box>
          <Box as="a" margin="0 5px" cursor="pointer" target="_blank" href={config.socials[2].link}><GithubIcon /></Box>
        </Box>
      </Box>
    </Box>
  );
}
