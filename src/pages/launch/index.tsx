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
import api from '@/lib/api';
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
import config from '@/config';
import { Link } from 'react-router-dom';
import useWallet from '@/hooks/useWallet';

export default function Launch() {
  const { register, authenticate } = usePassKey();
  const { navigate } = useBrowser();
  const toast = useToast();
  const { retrieveForNewDevice } = useWallet();
  const { clearCredentials } = useCredentialStore();
  const { clearAddressList } = useAddressStore();
  const [isAuthing, setIsAuthing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchParams] = useSearchParams();
  const isPopup = searchParams.get('isPopup');

  const login = async () => {
    try {
      setIsAuthing(true);
      const { publicKeys, credential } = await authenticate();
      console.log('credential is', credential);
      if (publicKeys) {
        localStorage.clear();
        // if (credentials.length) {
        //   setSelectedAddress(addressList[0].address);
        //   setSelectedCredentialId(credential.credentialId);
        // } else {
        // if no info on this device, init it
        let slotInitInfo;
        let publicKey;
        const res = (
          await api.guardian.getSlotInfo({
            key: publicKeys['0'],
          })
        ).data;

        if (res) {
          slotInitInfo = res;
          publicKey = publicKeys['0'];
        } else {
          const res2 = (
            await api.guardian.getSlotInfo({
              key: publicKeys['1'],
            })
          ).data;
          slotInitInfo = res2;
          publicKey = publicKeys['1'];
        }

        console.log('slot init info', slotInitInfo, publicKey);

        await retrieveForNewDevice(slotInitInfo, { ...credential, publicKey });

        toast({
          title: 'Logged in',
          status: 'success',
        });
        if (isPopup === 'true') {
          // redirect to popup
          navigate({ pathname: '/popup', search: location.href });
        } else {
          navigate('/wallet');
        }
      } else {
        // failed to login
        toast({
          title: 'Failed to login',
          status: 'error',
        });
      }
      setIsAuthing(false);
    } catch (error: any) {
      console.log('error', error);
      setIsAuthing(false);
    }
  };

  const resetWallet = () => {
    clearCredentials();
    clearAddressList();
    storage.clear();
  };

  const createWallet = async () => {
    try {
      /* resetWallet();
       * setIsCreating(true);
       * const credentialName = `Passkey_1`;
       * const credentialKey = await register(credentialName);
       * setIsCreating(false); */
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

  return (
    <Box
      width={{
        base: '100%',
        lg: '100vw',
      }}
      height="100vh"
      padding="20px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundImage={`url(${bgGradientImage})`}
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      overflow="auto"
    >
      <Box
        display="flex"
        justifyContent="center"
        position="relative"
        flexDirection={{
          base: 'column',
          lg: 'row',
        }}
        height="calc(100% - 80px)"
      >
        <Box>
          <Box
            padding="40px 0"
            backgroundColor="rgba(255, 255, 255, 0.35)"
            maxWidth={{
              base: 'calc(100vw - 40px)',
              lg: '400px',
            }}
            width={{
              base: '360px',
              lg: '400px',
            }}
            minHeight="calc(100% - 5px)"
            maxHeight="100%"
            display="flex"
            alignItems="center"
            justifyContent="space-around"
            flexDirection="column"
            overflow="auto"
            marginRight="-10px"
            zIndex="2"
            background="rgba(255, 255, 255, 0.2)"
            borderRadius="16px"
            boxShadow="0 4px 30px rgba(0, 0, 0, 0.25)"
            backdropFilter="blur(4px)"
          >
            <Logo direction="column" />
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              margin="50px 0"
              width={{
                base: '230px',
                lg: '320px',
              }}
            >
              <Box
                display="flex"
                flexDir={'column'}
                justifyContent="center"
                alignItems="center"
                gap="6"
                maxWidth="100%"
              >
                <Button
                  disabled={isAuthing}
                  loading={isAuthing}
                  onClick={login}
                  _styles={{
                    width: '282px',
                    borderRadius: '40px',
                    background: 'white',
                    color: 'black',
                    maxWidth: '100%',
                  }}
                  _hover={{
                    width: '282px',
                    borderRadius: '40px',
                    background: 'white',
                    color: 'black',
                  }}
                >
                  Login with passkey
                </Button>
                <Button
                  disabled={isCreating}
                  loading={isCreating}
                  onClick={createWallet}
                  _styles={{ width: '282px', borderRadius: '40px', maxWidth: '100%' }}
                >
                  Create new wallet
                </Button>
              </Box>
              <TextBody color="#1E1E1E" marginTop="24px" fontSize="16px" textAlign="center">
                Soul Wallet will create a smart contract wallet for you using passkey.
              </TextBody>
            </Box>
            <TextBody color="#000000" fontWeight="800" fontSize="20px" textAlign="center">
              <Link to="/recover">Lost your wallet?</Link>
            </TextBody>
          </Box>
        </Box>
        <Box
          height="100%"
          display={{
            base: 'none',
            lg: 'block',
          }}
        >
          <Image src={homeExampleImage} aspectRatio="1021 / 728" height="100%" />
        </Box>
        <Box
          position={{
            base: 'unset',
            lg: 'absolute',
          }}
          right="10px"
          bottom="-34px"
          display="flex"
          justifyContent={{
            base: 'center',
            lg: 'flex-end',
          }}
          padding={{
            base: '10px',
            lg: '0',
          }}
        >
          <Box as="a" margin="0 5px" cursor="pointer" target="_blank" href={config.socials[0].link}>
            <TwitterIcon />
          </Box>
          <Box as="a" margin="0 5px" cursor="pointer" target="_blank" href={config.socials[1].link}>
            <TelegramIcon />
          </Box>
          <Box as="a" margin="0 5px" cursor="pointer" target="_blank" href={config.socials[2].link}>
            <GithubIcon />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
