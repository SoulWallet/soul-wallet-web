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
  ModalBody
} from '@chakra-ui/react'
import TextBody from '@/components/new/TextBody'
import Title from '@/components/new/Title'
import ArrowRightIcon from '@/components/Icons/ArrowRight'
import ImportIcon from '@/components/Icons/Auth/Import'
import Button from '@/components/new/Button'
import WarningIcon from '@/components/Icons/Warning';

export default function SetSingerModal({ isOpen, onClose }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent background="white" w="360px" borderRadius="16px">
        <ModalBody overflow="auto" padding="24px 32px">
          <Box
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="100%">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                marginTop="10px"
                marginBottom="20px"
              >
                <WarningIcon />
              </Box>
              <Box
                fontWeight="800"
                fontFamily="Nunito"
                fontSize="18px"
                textAlign="center"
                marginBottom="4px"
              >
                Change the default signer
              </Box>
              <Box
                fontWeight="500"
                fontFamily="Nunito"
                fontSize="14px"
                textAlign="center"
                marginBottom="24px"
              >
                {`Are you sure to set <Wallet_1-2023-12-28-11:12:13> as the default signer?`}
              </Box>
              <Box>
                <Button
                  width="140px"
                  height="40px"
                  fontSize="16px"
                  theme="light"
                  marginRight="16px"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  width="140px"
                  height="40px"
                  fontSize="16px"
                  theme="dark"
                  onClick={onClose}
                >
                  Confirm
                </Button>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
