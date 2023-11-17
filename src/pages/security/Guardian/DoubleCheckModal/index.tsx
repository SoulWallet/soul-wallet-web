import React, { useState, useRef, useImperativeHandle, useCallback, useEffect, Fragment } from 'react';
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
} from '@chakra-ui/react';
import TextBody from '@/components/web/TextBody';
import ArrowRightIcon from '@/components/Icons/ArrowRight';
import Button from '@/components/web/Button';
import TextButton from '@/components/web/TextButton';

export default function DoubleCheckModal({ isOpen, onClose, onSubmit }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#ededed" maxW={'750px'}>
        <ModalHeader
          display={'flex'}
          justifyContent={'center'}
          gap="5"
          fontWeight={'800'}
          textAlign={'center'}
          borderBottom={'1px solid #d7d7d7'}
        >
          Edit Guardian
        </ModalHeader>
        <ModalCloseButton top="14px" />
        <ModalBody px="20px" overflow="scroll">
          <Box
            bg="#ededed"
            h="100%"
            roundedBottom="20px"
            p="6"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Box width="320px">
              <TextBody marginBottom="20px" textAlign="center" fontSize="20px" fontWeight="800">
                Are you sure you want to update your guardians list?
              </TextBody>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
              <Button _styles={{ width: '320px', background: '#9648FA', color: 'white' }} _hover={{ background: '#9648FA', color: 'white' }} onClick={onSubmit}>
                Confirm
              </Button>
              <TextButton _styles={{ width: '320px' }} onClick={onClose}>
                Cancel
              </TextButton>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}