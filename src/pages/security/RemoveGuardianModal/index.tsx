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
  ModalBody
} from '@chakra-ui/react'

import Button from '@/components/Button'
import WarningIcon from '@/components/Icons/Warning';
import { useSignerStore } from '@/store/signer'

export default function RemoveGuardianModal({
  isOpen,
  address,
  onClose,
  removeIndex,
  onConfirm
}: any) {
  const confirmLocal = () => {
    onConfirm(removeIndex)
    onClose();
  }

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
                Remove guardian
              </Box>
              <Box
                fontWeight="500"
                fontFamily="Nunito"
                fontSize="14px"
                textAlign="center"
                marginBottom="24px"
              >
                {`Are you sure to remove ${address} as guardian?`}
              </Box>
              <Box>
                <Button
                  width="140px"
                  height="40px"
                  fontSize="16px"
                  type="white"
                  marginRight="16px"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  width="140px"
                  height="40px"
                  fontSize="16px"
                  type="black"
                  onClick={confirmLocal}
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
