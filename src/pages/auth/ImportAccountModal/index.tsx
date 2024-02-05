import React, {
  useState,
  useRef,
  useImperativeHandle,
  useCallback,
  useEffect,
  Fragment
} from 'react'
import {
  Box,
  Text,
  Image,
  useToast,
  Select,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input
} from '@chakra-ui/react'
import TextBody from '@/components/new/TextBody'
import useBrowser from '@/hooks/useBrowser';
import Title from '@/components/new/Title'
import ArrowRightIcon from '@/components/Icons/ArrowRight'
import ImportIcon from '@/components/Icons/Auth/Import'
import BackIcon from '@/components/Icons/Back'
import Button from '@/components/Button'
import { ethers } from 'ethers';

export default function ImportAccountModal({ isOpen, onClose, importWallet, isImporting, openSelectAccount }: any) {
  const [address, setAddress] = useState('')
  const { navigate } = useBrowser();

  const onAddressChange = useCallback((e: any) => {
    const address = e.target.value
    console.log('address', address)
    setAddress(address)
  }, [])

  const goToRecover = useCallback(() => {
    navigate(`/recover`);
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent background="white" maxW="840px" borderRadius="20px">
        <ModalHeader
          display="flex"
          justifyContent="flex-start"
          gap="5"
          fontWeight="800"
          textAlign="center"
          padding="20px 32px"
        >
          Import account
        </ModalHeader>
        <Box>
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            fontWeight="800"
            padding="0 32px"
            cursor="pointer"
            gap="8px"
            onClick={() => { onClose(); openSelectAccount(); }}
          >
            <Box as="span"><BackIcon /></Box>
            <Box>Back to select wallet</Box>
          </Box>
        </Box>
        <ModalCloseButton top="14px" />
        <ModalBody overflow="auto" padding="20px 32px">
          <Box
            background="white"
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="100%">
              <Box width="100%" display="flex" marginBottom="30px">
                <Input height="44px" borderRadius="12px" value={address} onChange={onAddressChange} />
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="10px">
                <Box fontSize="14px" fontWeight="400" display="flex" alignItems="center">
                  Forgot address? Try <Box fontSize="14px" color="#FF2E79" fontWeight="700" marginLeft="6px" cursor="pointer" onClick={goToRecover}>Social Recovery</Box>
                </Box>
                <Box>
                  <Button
                    type="black"
                    color="white"
                    padding="0 20px"
                    disabled={!ethers.isAddress(address) || isImporting}
                    onClick={() => importWallet(address)}
                    loading={isImporting}
                    size="xl"
                  >
                    Go to my wallet
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
