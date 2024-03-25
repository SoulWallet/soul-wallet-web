import { Box, Input } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import FadeId from '@/components/Icons/mobile/FaceId'

export default function SepupPasskey({ addingPasskey, onNext, onSkip }: any) {
  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="138px" display="flex" alignItems="center" justifyContent="center" flexDirection="column">
      <Box marginBottom="74px">
        <FadeId />
      </Box>
      <Box
        fontWeight="700"
        fontSize="24px"
        lineHeight="14px"
        marginBottom="14px"
      >
        Set up passkey
      </Box>
      <Box width="100%" marginBottom="50px">
        <Box fontSize="16px" lineHeight="24px" fontWeight="400" textAlign="center">
          Passkeys are like passwords but better. They’re better because they aren’t created insecurely by humans and because they use public key cryptography to create much more secure experiences.
        </Box>
      </Box>
      <Button disabled={!!addingPasskey} size="xl" type="blue" onClick={onNext} minWidth="195px">Continue</Button>
    </Box>
  );
}
