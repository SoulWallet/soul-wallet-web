import { Box, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import Header from '@/components/mobile/Header'
import BN from 'bignumber.js'
import { useBalanceStore } from '@/store/balance';

const getFontSize = (value: any) => {
  const length = value ? String(value).length : 0

  if (length > 9) {
    return '40px'
  } else if (length > 5) {
    return '60px'
  }

  return '100px'
}

export default function InputAmount({ onPrev, onChange, value, onNext }: any) {
  const { getTokenBalance, totalUsdValue, } = useBalanceStore();
  // const ausdcBalance = getTokenBalance(import.meta.env.VITE_TOKEN_AUSDC)?.tokenBalanceFormatted;
  // const usdcBalance = getTokenBalance(import.meta.env.VITE_TOKEN_USDC)?.tokenBalanceFormatted;
  const disabled = !value
  const fontSize = getFontSize(value)

  return (
    <Box width="100%" height="100%">
      <Header
        title="Transfer"
        showBackButton
        onBack={onPrev}
        marginTop="18px"
      />
      <Box padding="30px" minHeight="100vh">
        <Box marginTop="46px">
          <Box
            fontSize="24px"
            fontWeight="700"
          >
            Amount
          </Box>
          <Box
            borderBottom="1px solid rgba(73, 126, 130, 0.2)"
            padding="10px 0"
            display="flex"
            alignItems="center"
          >
            <Input
              value={value}
              onChange={e => onChange(e.target.value)}
              fontSize="32px"
              lineHeight="100%"
              padding="0"
              fontWeight="700"
              placeholder="0"
              borderRadius="0"
              border="none"
              outline="none"
              _focusVisible={{ border: 'none', boxShadow: 'none' }}
            />
            <Box
              fontSize="32px"
              fontWeight="700"
              color="rgba(0, 0, 0, 0.2)"
            >
              USDC
            </Box>
          </Box>
        </Box>
        {/* <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            marginTop="5px"
            >
            <Box
            fontWeight="700"
            fontSize="14px"
            color="#E83D26"
            >
            Exceed the available balance
            </Box>
            </Box> */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          marginTop="5px"
        >
          <Box
            fontWeight="600"
            fontSize="14px"
          >
            Available: {totalUsdValue} USDC
          </Box>
          <Box
            background="rgba(225, 220, 252, 0.80)"
            color="#6A52EF"
            fontSize="14px"
            borderRadius="48px"
            padding="2px 12px"
            fontWeight="800"
            marginLeft="10px"
            onClick={()=> onChange(totalUsdValue)}
          >
            MAX
          </Box>
        </Box>
        <Box marginTop="60px">
          <Box
            fontSize="24px"
            fontWeight="700"
          >
            To
          </Box>
          <Box
            borderBottom="1px solid rgba(73, 126, 130, 0.2)"
            padding="10px 0"
            display="flex"
            alignItems="center"
          >
            <Input
              value={''}
              onChange={() => {}}
              fontSize="18px"
              lineHeight="100%"
              padding="0"
              fontWeight="700"
              placeholder="Enter wallet address or ENS"
              borderRadius="0"
              border="none"
              outline="none"
              _focusVisible={{ border: 'none', boxShadow: 'none' }}
            />
          </Box>
        </Box>
        {/* <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            marginTop="5px"
            >
            <Box
            fontWeight="700"
            fontSize="14px"
            color="#E83D26"
            >
            Please enter a valid Arbitrum address
            </Box>
            </Box> */}
        <Box
          marginTop="40px"
          width="100%"
        >
          <Button disabled={disabled} size="xl" type="blue" width="100%" onClick={onNext}>Continue</Button>
        </Box>
      </Box>
    </Box>
  );
}
