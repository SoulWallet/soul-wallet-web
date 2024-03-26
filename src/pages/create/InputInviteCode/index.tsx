import { Box, Input, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react';
import Button from '@/components/mobile/Button'
import InputLoading from '@/components/InputLoading';

export default function InputInviteCode({value, onChange, codeStatus, checking, onNext}: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const disabled = !value || codeStatus !== 0

  console.log('code status', codeStatus);
  const innerHeight = window.innerHeight
  const marginHeight = innerHeight - 428
  console.log('innerHeight', innerHeight)

  return (
    <Box width="100%" height="100%" padding="30px" paddingTop="138px">
      <Box
        fontWeight="700"
        fontSize="24px"
        lineHeight="14px"
        marginBottom="20px"
      >
        Invite code
      </Box>
      <Box width="100%" marginBottom="74px">
        <Input value={value} spellCheck={false} onChange={e => onChange(e.target.value)} fontSize="32px" lineHeight="24px" padding="0" fontWeight="700" placeholder="Enter or paste here" borderRadius="0" border="none" outline="none" _focusVisible={{ border: 'none', boxShadow: 'none' }} />
        <Box marginTop="10px" width="100%" height="1px" background="rgba(73, 126, 130, 0.2)" />
        <Box mt="1" h="32px" overflow={"hidden"}>
          {checking ? <InputLoading /> : <>
            {codeStatus === -1 && <Box fontSize="14px" lineHeight="24px" fontWeight="600" onClick={onOpen}>What if I don’t have one?</Box>}
            {codeStatus === 0 && (
              <Box fontSize="14px" lineHeight="24px" fontWeight="600" color="#0CB700">
                Looks great! Let’s go
              </Box>
            )}
            {(codeStatus === 1 || codeStatus === 2) && (
              <Box fontSize="14px" lineHeight="24px" fontWeight="700" color="#E83D26">
                {codeStatus === 1 ? 'This code has been expired or used. Please try another.' : 'Invalid code, please try another'}
              </Box>
            )}
          </>
          }
        </Box>
      </Box>
      <Button disabled={disabled} size="xl" type="blue" width="100%" onClick={onNext}>Continue</Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        blockScrollOnMount={true}
      >
        <ModalOverlay height="100vh" />
        <ModalContent
          borderRadius={{
            sm: '20px 20px 0 0',
            md: '20px',
          }}
          maxW={{
            sm: '100vw',
            md: '430px'
          }}
          marginTop={{
            sm: `${marginHeight}px`,
            md: 'calc(50vh - 125px)'
          }}
          height="428px"
          overflow="auto"
          mb="0"
        >
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <Box
              background="#D9D9D9"
              height="120px"
              width="120px"
              borderRadius="120px"
              marginBottom="30px"
            />
            <Box fontSize="24px" fontWeight="700" marginBottom="14px">
              Thanks for your interest
            </Box>
            <Box
              fontSize="16px"
              textAlign="center"
              marginBottom="40px"
            >
              We are currently under internal testing. Please be patient and join our Telegram group. We’ll send out more invitations very soon. Thanks again for your patience.
            </Box>
            <Box width="100%">
              <Button size="xl" type="blue" width="100%">Follow Soul Wallet on X</Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
