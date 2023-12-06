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
import Heading1 from '@/components/web/Heading1';
import TextBody from '@/components/web/TextBody';
import ArrowRightIcon from '@/components/Icons/ArrowRight';
import Button from '@/components/web/Button';
import TextButton from '@/components/web/TextButton';
import WarningIcon from '@/components/Icons/Warning';
import { useSettingStore } from '@/store/setting';

export default function ConfirmModal({ isOpen, onClose, onSubmit, loading, disabled, getGuardiansDetails }: any) {
  const { guardians, guardianNames, threshold } = getGuardiansDetails()
  const { getAddressName } = useSettingStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW={{base: '90%', md: '500px'}} overflow="auto">
        <Box width="320px" margin="0 auto" padding="20px 0">
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding="20px"
            paddingTop="10px"
          >
            <WarningIcon />
          </Box>
          <Box marginBottom="16px">
            <Box display="flex" alignItems="center" justifyContent="center">
              <Heading1>
                Please note
              </Heading1>
            </Box>
            <Box maxWidth="100%">
              <TextBody fontSize="14px" fontWeight="500" textAlign="center">
                Setting up the wrong guardian address may cause risks and lose your wallet. Please double check before proceeding.
              </TextBody>
            </Box>
          </Box>
          <Box marginBottom="16px" background="rgba(217, 217, 217, 0.32)" borderRadius="20px">
            {guardians.map((address: any, i: number) =>
              <Fragment key={address}>
                <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center" padding="20px">
                  <TextBody fontSize="14px" fontWeight="800">
                    Guardian {i + 1}: {getAddressName(address) || 'no name'}
                  </TextBody>
                  <TextBody fontSize="16px" fontWeight="500" wordBreak="break-all">
                    {address}
                  </TextBody>
                </Box>
                {(i !== guardians.length - 1) && <Box height="1px" width="calc(100% - 40px)" background="#DCDCDC" margin="0 auto" />}
              </Fragment>
            )}
          </Box>
          <Box marginBottom="16px">
            <Box display="flex" alignItems="center" justifyContent="center">
              <TextBody fontSize="12px" fontWeight="500" textAlign="center" color="#EC0000">
                Per your settings, {threshold} of the {guardians.length} guardian’s approve is required for recovery. Please note the risk.
              </TextBody>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="20px">
            <Button disabled={loading || disabled} loading={loading} onClick={onSubmit} _styles={{ width: '320px', marginBottom: '12px' }}>
              Confirm
            </Button>
            <TextButton onClick={onClose} _styles={{ width: '320px', maxWidth: '320px', padding: '0 20px', whiteSpace: 'break-spaces' }}>
              Back to edit
            </TextButton>
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  )
}
