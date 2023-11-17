import { useEffect, useState } from 'react';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Text,
  Image,
  useToast,
  Grid,
  GridItem,
  Flex,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@chakra-ui/react';
import api from '@/lib/api';
import TextBody from '@/components/web/TextBody';
import Button from '@/components/web/Button';
import Logo from '@/components/web/Logo';
import usePassKey from '@/hooks/usePasskey';
import storage from '@/lib/storage';
import { useSearchParams } from 'react-router-dom';
import bgGradientImage from '@/assets/bg-gradient.jpeg';
import homeExampleImage from '@/assets/home-example.png';
import TwitterIcon from '@/components/Icons/Social/Twitter';
import TelegramIcon from '@/components/Icons/Social/Telegram';
import GithubIcon from '@/components/Icons/Social/Github';
import config from '@/config';
import packageJson from '../../../package.json';
import useWallet from '@/hooks/useWallet';
import { Link as RLink } from 'react-router-dom';
import { faqList, featureList } from '@/data';
import { useCredentialStore } from '@/store/credential';
import { useAddressStore } from '@/store/address';

const SignCard = () => {
  const { authenticate } = usePassKey();
  const { navigate } = useBrowser();
  const toast = useToast();
  const { retrieveForNewDevice } = useWallet();
  const [isAuthing, setIsAuthing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [searchParams] = useSearchParams();
  const isPopup = searchParams.get('isPopup');

  const login = async () => {
    try {
      setIsAuthing(true);
      const { publicKey, credential } = await authenticate();
      console.log('credential is', credential);
      if (publicKey) {
        const slotInitInfo = (
          await api.guardian.getSlotInfo({
            key: publicKey,
          })
        ).data;
        // if (credentials.length) {
        //   setSelectedAddress(addressList[0].address);
        //   setSelectedCredentialId(credential.credentialId);
        // } else {
        // if no info on this device, init it
        // let slotInitInfo;
        // let publicKey;
        // const res = (
        //   await api.guardian.getSlotInfo({
        //     key: publicKeys['0'],
        //   })
        // ).data;

        // if (res) {
        //   slotInitInfo = res;
        //   publicKey = publicKeys['0'];
        // } else {
        //   const res2 = (
        //     await api.guardian.getSlotInfo({
        //       key: publicKeys['1'],
        //     })
        //   ).data;
        //   slotInitInfo = res2;
        //   publicKey = publicKeys['1'];
        // }

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
        showError();
      }
      setIsAuthing(false);
    } catch (error: any) {
      showError();
      setIsAuthing(false);
    }
  };

  const showError = () => {
    toast({
      title: 'Login error',
      status: 'error',
      description: `wallet doesn't exist, please try to create a new one`,
      duration: 3000,
    });
  };

  const createWallet = async () => {
    try {
      /* resetWallet();
       * setIsCreating(true);
       * const credentialKey = await register(credentialName);
       * setIsCreating(false); */
      // make sure storage is clear
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
      width="400px"
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
      mx="auto"
    >
      <Box textAlign={'center'}>
        <Logo direction="column" />
        <Text mt="2" fontWeight={'600'} fontSize={'12px'} fontFamily={'Martian'}>
          Alpha Test {packageJson.version}
        </Text>
      </Box>
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
        <Box display="flex" flexDir={'column'} justifyContent="center" alignItems="center" gap="3" maxWidth="100%">
          <Popover trigger="hover">
            <PopoverTrigger>
              <Button
                disabled={isAuthing}
                loading={isAuthing}
                onClick={login}
                border={'1px solid #898989'}
                pos={'relative'}
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
            </PopoverTrigger>
            {/* <PopoverContent>123</PopoverContent> */}
          </Popover>

          <Button
            disabled={isCreating}
            loading={isCreating}
            onClick={createWallet}
            bg="auto"
            bgGradient={'linear-gradient(180deg, #FF2B9D 0%, #FF9BBF 100%)'}
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
        <Link href="mailto:support@SoulWallet.io" color="#2D5AF6" textDecoration={'underline'}>
          support@SoulWallet.io
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
    <Box w={{ base: 'auto', lg: '880px' }} mx="auto" mt="145px">
      <Text fontSize={'40px'} fontWeight={'800'} mb={10}>
        FAQs
      </Text>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }} rowGap={12} columnGap={10}>
        {faqList.map((item, idx) => (
          <GridItem key={idx}>
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

const FeaturesSection = () => {
  return (
    <Flex mt="-10" gap="9" justify={'center'} flexDir={{ base: 'column', lg: 'row' }}>
      {featureList.map((item, idx: number) => (
        <Flex
          flexDir={'column'}
          align={'center'}
          justify={'center'}
          mt={{ base: '0', lg: idx === 1 || idx === 2 ? '144px' : '0' }}
          py="70px"
          px="48px"
          flexGrow={0}
          flexShrink={0}
          flexBasis="auto"
          w="320px"
          h="320px"
          bg="#F5EBF7"
          rounded="full"
          textAlign={'center'}
          key={idx}
        >
          <Image src={item.icon} mb="2" w="16" />
          <Text fontSize={'24px'} fontWeight={'800'} mb="2" dangerouslySetInnerHTML={{ __html: item.title }} />
          <Text fontSize={'16px'} fontWeight={'600'}>
            {item.content}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

const Banner = () => {
  return (
    <Box bgImage={homeExampleImage} bgPos={'center'} pt="12" bgRepeat={'no-repeat'} bgSize={'contain'}>
      <SignCard />
      <FeaturesSection />
    </Box>
  );
};

export default function Launch() {
  return (
    <Box p="10" bgImage={bgGradientImage} bgSize={'cover'}>
      <Banner />
      <FaqSection />
      <LaunchFooter />
    </Box>
  );
}
