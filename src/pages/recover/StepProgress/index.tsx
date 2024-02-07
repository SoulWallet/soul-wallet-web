import {
  Box,
  Text,
  Image,
  Flex,
  useToast,
  Input
} from '@chakra-ui/react';
import StepInactiveIcon from '@/components/Icons/StepInactive'
import StepActiveIcon from '@/components/Icons/StepActive'
import StepCheckedIcon from '@/components/Icons/StepChecked'

const stepNames = [
  'Wallet address',
  'Add signer',
  'Guardian signature request',
  'Pay recovery fee'
]

export default function StepProgress({ activeIndex }: any) {
  const index = activeIndex || 0

  return (
    <Box color="black" background="white" borderRadius="20px" padding="24px" marginLeft="34px">
      <Box fontSize="16px" fontWeight="800" marginBottom="20px">Recovery process ({index + 1}/4)</Box>
      <Box>
        {stepNames.map((name: string, i: number) =>
          <Box key={i} fontSize="14px" fontWeight={i <= index ? 800 : 400} marginBottom="10px" display="flex" alignItems="center">
            <Box>
              {i < index && <StepCheckedIcon />}
              {i === index && <StepActiveIcon />}
              {i > index && <StepInactiveIcon />}
            </Box>
            <Box>Step {i + 1}: {stepNames[i]}</Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
