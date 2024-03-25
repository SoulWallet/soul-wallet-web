import { Box, Image, useDisclosure } from '@chakra-ui/react';
import NextIcon from '@/components/Icons/mobile/Next'
import MetamaskIcon from '@/assets/mobile/metamask.png'
import OKEXIcon from '@/assets/mobile/okex.png'
import CoinbaseIcon from '@/assets/mobile/coinbase.png'
import BinanceIcon from '@/assets/mobile/binance.png'

export default function MakeTransfer({ onNext }: any) {
  return (
    <Box width="100%" height="100%" position="relative">
      <Box padding="30px">
        <Box width="100%" fontSize="30px" fontWeight="700" textAlign="center" lineHeight="36px" marginTop="20px">
          Make a transfer
        </Box>
        <Box
          fontSize="14px"
          fontWeight="500"
          marginTop="18px"
          textAlign="center"
        >
          {`Find the “Send” or “Transfer button” in your wallet or exchange account. And paste the address you copied from last step.`}
        </Box>
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginTop="62px"
          gap="6"
          transition="0.6s all ease"
        >
          <Box
            width="48px"
            height="48px"
            borderRadius="12px"
            transition="0.6s all ease"
            border="1px solid rgba(0, 0, 0, 0.10)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image width="32px" src={MetamaskIcon} className="icon" />
          </Box>
          <Box
            width="48px"
            height="48px"
            borderRadius="12px"
            transition="0.6s all ease"
            border="1px solid rgba(0, 0, 0, 0.10)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image width="32px" src={OKEXIcon} className="icon" />
          </Box>
          <Box
            width="48px"
            height="48px"
            borderRadius="12px"
            transition="0.6s all ease"
            border="1px solid rgba(0, 0, 0, 0.10)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image width="32px" src={CoinbaseIcon} className="icon" />
          </Box>
          <Box
            width="48px"
            height="48px"
            borderRadius="12px"
            transition="0.6s all ease"
            border="1px solid rgba(0, 0, 0, 0.10)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image width="32px" src={BinanceIcon} className="icon" />
          </Box>
          <Box
            width="48px"
            height="48px"
            borderRadius="12px"
            marginLeft="6px"
            marginRight="6px"
            transition="0.6s all ease"
            border="1px solid rgba(0, 0, 0, 0.10)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {`...`}
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
          <Box width="8px" height="8px" marginLeft="4px" marginRight="4px" borderRadius="8px" background="black" />
          <Box width="8px" height="8px" marginLeft="4px" marginRight="4px" borderRadius="8px" background="#D9D9D9" />
          <Box width="8px" height="8px" marginLeft="4px" marginRight="4px" borderRadius="8px" background="#D9D9D9" />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box fontWeight="700" fontSize="18px" cursor="pointer" onClick={onNext}>What’s next</Box>
          <Box><NextIcon /></Box>
        </Box>
      </Box>
    </Box>
  );
}
