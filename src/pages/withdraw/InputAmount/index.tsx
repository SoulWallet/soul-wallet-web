import { Box, Input } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import Header from '@/components/mobile/Header'
import { useBalanceStore } from '@/store/balance';
import { toFixed } from '@/lib/tools';


export default function InputAmount({ onPrev, onNext,
withdrawAmount, onWithdrawAmountChange, sendTo, onSendToChange 
}: any) {
  const { totalUsdValue, } = useBalanceStore();
  const disabled = !withdrawAmount || withdrawAmount <= 0 || withdrawAmount > totalUsdValue || !sendTo

  return (
    <Box width="100%" height="100%">
      <Header
        title="Transfer"
        showBackButton
        onBack={onPrev}
      />
      <Box padding="30px" minHeight="calc(100vh - 62px)">
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
              value={withdrawAmount}
              onChange={e => onWithdrawAmountChange(e.target.value)}
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
            Available: {toFixed(totalUsdValue, 2)} USDC
          </Box>
          <Box
            background="rgba(225, 220, 252, 0.80)"
            color="#6A52EF"
            spellCheck={false}
            fontSize="14px"
            borderRadius="48px"
            padding="2px 12px"
            fontWeight="800"
            marginLeft="10px"
            onClick={()=> onWithdrawAmountChange(Number(totalUsdValue))}
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
              value={sendTo}
              spellCheck={false}
              onChange={e => onSendToChange(e.target.value)}
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
