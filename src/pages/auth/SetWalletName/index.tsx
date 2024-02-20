import { useState, useCallback } from 'react';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Flex,
  useToast,
  Input
} from '@chakra-ui/react';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/Button'
import { useSignerStore } from '@/store/signer';
import { useTempStore } from '@/store/temp';
import { SignHeader } from '@/pages/public/Sign';

export default function SetWalletName({ updateWalletName, back }: any) {
  const [name, setName] = useState('')
  const {
    credentials,
  } = useSignerStore();
  console.log('create', credentials)

  const onNameChange = useCallback((e: any) => {
    const name = e.target.value
    console.log('name', name)
    setName(name)
  }, [])

  const onKeyDown = useCallback((event: any) => {
    console.log('onKeyDown', event)
    if (event.keyCode === 13) {
      updateWalletName(name)
    }
  }, [name])

  return (
    <Flex align={'center'} justify={'center'} width="100%" minHeight="100vh" background="#F2F4F7">
      <SignHeader />
      <Box
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="calc(100% - 58px)"
        flexDirection="column"
        width="100%"
      >
        <RoundContainer
          width="1058px"
          maxWidth="100%"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          background="white"
        >
          <Box
            width="100%"
            height="100%"
            padding={{ base: '20px', md: '84px' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Heading
              type="h3"
              fontSize={{ base: "24px", lg: "32px" }}
              textAlign={{ base: "left", lg: "center" }}
              width="100%"
              marginBottom="10px"
            >
              Pick a name for your wallet
            </Heading>
            <TextBody fontWeight="600">You’ve got a default wallet name, you can also make it your own.</TextBody>
            <Box
              background="white"
              height="100%"
              width="100%"
              roundedBottom="20px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              padding={{ base: '30px 0', md: '30px' }}
            >
              <Box
                width="100%"
                maxWidth="548px"
                display="flex"
                marginBottom="10px"
                flexDirection="column"
              >
                <Input
                  height="44px"
                  borderRadius="12px"
                  placeholder="Enter wallet name"
                  value={name}
                  onChange={onNameChange}
                  onKeyDown={onKeyDown}
                />
              </Box>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" width="100%">
              <Box>
                <Button
                  type="white"
                  // color="white"
                  padding="0 20px"
                  marginRight="16px"
                  onClick={back}
                  size="xl"
                >
                  Back
                </Button>
                <Button
                  type="black"
                  color="white"
                  padding="0 20px"
                  disabled={!name}
                  onClick={() => updateWalletName(name)}
                  size="xl"
                >
                  Continue
                </Button>
              </Box>
            </Box>
          </Box>
        </RoundContainer>
      </Box>
    </Flex>
  )
}
