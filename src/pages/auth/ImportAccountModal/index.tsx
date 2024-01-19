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
import Title from '@/components/new/Title'
import ArrowRightIcon from '@/components/Icons/ArrowRight'
import ImportIcon from '@/components/Icons/Auth/Import'
import Button from '@/components/new/Button'

export default function ImportAccountModal({ isOpen, onClose }: any) {
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
                <Input height="44px" borderRadius="12px" />
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="10px">
                <Box fontSize="14px" fontWeight="400" display="flex" alignItems="center">
                  Forgot address? Try <Box fontSize="14px" color="#FF2E79" fontWeight="700" marginLeft="6px" cursor="pointer">Social Recovery</Box>
                </Box>
                <Button
                  theme="dark"
                  color="white"
                  padding="0 20px"
                >
                  Go to my wallet
                </Button>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}