import { Box, Input, Image } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import LoadingIcon from '@/assets/mobile/loading.gif'
import { css, keyframes } from '@emotion/react'

export default function CreateSuccess({ creating, onNext }: any) {
  if (creating) {
    return (
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100vw"
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
          <Box
            marginTop="18px"
            fontWeight="400"
            fontSize="18px"
            lineHeight="14px"
            marginBottom="14px"
          >
            Setting up wallet...
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="138px" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
      <Box width="120px" height="120px" background="#D9D9D9" borderRadius="120px" marginBottom="30px">
      </Box>
      <Box
        fontWeight="700"
        fontSize="24px"
        lineHeight="14px"
        marginBottom="14px"
      >
        Your account is ready
      </Box>
      <Box width="100%" marginBottom="50px">
        <Box fontSize="16px" lineHeight="24px" fontWeight="400" textAlign="center">
          Thanks for setting up your Soul Wallet account. Start saving from now on!
        </Box>
      </Box>
      <Button onClick={onNext} size="xl" type="blue" minWidth="195px">💰 Start saving</Button>
    </Box>
  );
}
