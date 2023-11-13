import { useState } from 'react';
import FullscreenContainer from '@/components/FullscreenContainer';
import { StepActionTypeEn, useStepDispatchContext, CreateStepEn, RecoverStepEn } from '@/context/StepContext';
import useBrowser from '@/hooks/useBrowser';
import { Box, Text, Image, useToast, Grid, GridItem, Flex, Link } from '@chakra-ui/react';
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
import useWallet from '@/hooks/useWallet';
import { Link as RLink } from 'react-router-dom';
import { faqList } from '@/data';

const SignCard = () => {
  const { authenticate } = usePassKey();
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
      // make sure no storage left
      storage.clear();
      setIsAuthing(true);
      const { publicKeys, credential } = await authenticate();
      console.log('credential is', credential);
      if (publicKeys) {
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

  const createWallet = async () => {
    try {
      /* resetWallet();
       * setIsCreating(true);
       * const credentialKey = await register(credentialName);
       * setIsCreating(false); */
      // make sure storage is clear
      storage.clear();
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
      h="640px"
      display="flex"
      alignItems="center"
      justifyContent="space-around"
      flexDirection="column"
      overflow="auto"
      zIndex="2"
      background="rgba(255, 255, 255, 0.90)"
      borderRadius="20px"
      boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
      backdropFilter="blur(12.5px)"
      pos="absolute"
      left="0"
      right="0"
      top="40px"
      m="auto"
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
        <Box display="flex" flexDir={'column'} justifyContent="center" alignItems="center" gap="6" maxWidth="100%">
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
            loadingColor="dark"
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
        <Link to="/recover" as={RLink}>
          Lost your wallet?
        </Link>
      </TextBody>
    </Box>
  );
};

const LaunchFooter = () => {
  return (
    <Flex flexDir={'column'} align={'center'} gap="5" mt="178px" mb="34px">
      <Text>
        If you have any questions, reach out to us at{' '}
        <Link href="mailto:Support@SoulWallet.io" color="#2D5AF6" textDecoration={'underline'}>
          Support@SoulWallet.io
        </Link>
      </Text>
      <Flex align="center" gap="4">
        <Link href={config.socials[0].link}>
          <TwitterIcon />
        </Link>
        <Link href={config.socials[1].link}>
          <TelegramIcon />
        </Link>
        <Link href={config.socials[2].link}>
          <GithubIcon />
        </Link>
      </Flex>
      <Link href={config.homepage} target="_blank" fontWeight={'800'} fontSize="24px">
        SoulWallet.io
      </Link>
    </Flex>
  );
};

const FaqSection = () => {
  return (
    <Box w="880px" mx="auto" mt="145px">
      <Text fontSize={'40px'} fontWeight={'800'} mb={10}>
        FAQs
      </Text>
      <Grid templateColumns={'repeat(2, 1fr)'} rowGap={12} columnGap={10}>
        {faqList.map((item) => (
          <GridItem>
            <Text fontSize={'20px'} fontWeight={'800'} mb="3">
              {item.title}
            </Text>
            <Text fontSize={'16px'} fontWeight={'600'} dangerouslySetInnerHTML={{ __html: item.content }} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default function Launch() {
  return (
    <Box p="10" bg="#bbbcef">
      <Box pos="relative">
        <Image src={homeExampleImage} />
        <SignCard />
      </Box>
      <FaqSection />
      <LaunchFooter />
    </Box>
  );
}
