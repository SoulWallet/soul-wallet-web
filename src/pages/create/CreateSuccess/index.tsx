import { Box, Input, Image, useToast } from '@chakra-ui/react';
import Button from '@/components/mobile/Button';
import LoadingIcon from '@/assets/mobile/loading.gif';
import { useEffect, useRef, useState } from 'react';
import useWallet from '@/hooks/useWallet';
import { useNavigate } from 'react-router-dom';

export default function CreateSuccess({ credential, username, invitationCode }: any) {
  const { getActivateOp, signAndSend, initWallet } = useWallet();
  const userOpRef = useRef<any>();
  const initialKeysRef = useRef<any>();
  const creatingRef = useRef(false);
  const navigate = useNavigate();
  const toast = useToast();

  const prepareAction = async () => {
    if (!initialKeysRef.current) {
      const { initialKeys: _initialKeys } = await initWallet(credential, username, invitationCode);
      initialKeysRef.current = _initialKeys;
      const _userOp = await getActivateOp(_initialKeys);
      userOpRef.current = _userOp;
    } else {
      const _userOp = await getActivateOp(initialKeysRef.current);
      userOpRef.current = _userOp;
    }
  };

  useEffect(() => {
    prepareAction();
   
    const interval = setInterval(() => {
      if(creatingRef.current){
        return
      }
      prepareAction();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const onCreate = async () => {
    if (userOpRef.current) {
      try {
        creatingRef.current = true;
        await signAndSend(userOpRef.current);
        navigate('/dashboard');
      } catch (error: any) {
        toast({
          title: 'Failed to create wallet',
          description: error.message,
          status: 'error',
        });
        creatingRef.current = false;
      }
    } else {
      setTimeout(() => {
        onCreate();
      }, 1000);
    }
  };

  if (creatingRef.current) {
    return (
      <Box
        position="fixed"
        top="0"
        left="calc(50% - 215px)"
        width="430px"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        background="linear-gradient(180deg, #F5F6FA 0%, #EEF2FB 100%)"
      >
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Box>
            <Image width="80px" height="60px" src={LoadingIcon} />
          </Box>
          <Box marginTop="18px" fontWeight="400" fontSize="18px" lineHeight="14px" marginBottom="14px">
            Setting up wallet...
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      height="100%"
      padding="30px"
      paddingTop="138px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box width="120px" height="120px" background="#D9D9D9" borderRadius="120px" marginBottom="30px"></Box>
      <Box fontWeight="700" fontSize="24px" lineHeight="14px" marginBottom="14px">
        Your account is ready
      </Box>
      <Box width="100%" marginBottom="50px">
        <Box fontSize="16px" lineHeight="24px" fontWeight="400" textAlign="center">
          Thanks for setting up your Soul Wallet account. Start saving from now on!
        </Box>
      </Box>
      <Button onClick={onCreate} size="xl" type="blue" minWidth="195px">
        💰 Start saving
      </Button>
    </Box>
  );
}
