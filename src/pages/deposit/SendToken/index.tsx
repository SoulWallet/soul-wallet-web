import { Box, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import USDCIcon from '@/assets/mobile/usdc.png'

export default function SelectToken({
  onFinish,
}: any) {
  const innerHeight = window.innerHeight
  const contentHeight = innerHeight - 64

  return (
    <Box width="100%" height={contentHeight} position="relative">
      <Box padding="30px" paddingBottom="144px">
        <Box width="100%" fontSize="30px" fontWeight="700" textAlign="center" lineHeight="36px" marginTop="20px">
          Send USDC token
        </Box>
        <Box
          fontSize="14px"
          fontWeight="500"
          marginTop="18px"
          textAlign="center"
          minHeight="80px"
        >
          Enter an amount of USDC token you would like to save and earn interest. USDC is the only token we support for now. Sending other tokens may cause lost.
        </Box>
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginTop="64px"
        >
          <Box
            background="#F1F1F1"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            padding="30px"
            borderRadius="20px"
            width="143px"
            height="172px"
          >
            <Box
              width="72px"
              height="72px"
              borderRadius="12px"
              marginLeft="6px"
              marginRight="6px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image width="72px" height="72px" src={USDCIcon} className="icon" />
            </Box>
            <Box
              fontWeight="700"
              fontSize="20px"
              marginTop="20px"
            >
              USDC
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        position="fixed"
        bottom="0"
        left="0"
        width="100%"
        background="white"
        paddingTop="20px"
        paddingBottom="36px"
      >
        <Box display="flex" alignItems="center" justifyContent="center" marginBottom="24px">
          <Box width="8px" height="8px" marginLeft="4px" marginRight="4px" borderRadius="8px" background="#D9D9D9" />
          <Box width="8px" height="8px" marginLeft="4px" marginRight="4px" borderRadius="8px" background="#D9D9D9" />
          <Box width="8px" height="8px" marginLeft="4px" marginRight="4px" borderRadius="8px" background="#D9D9D9" />
          <Box width="8px" height="8px" marginLeft="4px" marginRight="4px" borderRadius="8px" background="black" />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box onClick={onFinish} fontWeight="700" fontSize="18px" cursor="pointer">I’ve done with all these steps!</Box>
        </Box>
      </Box>
    </Box>
  );
}
