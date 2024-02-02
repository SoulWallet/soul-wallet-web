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
  Input,
} from '@chakra-ui/react'
import TextBody from '@/components/new/TextBody'
import Title from '@/components/new/Title'
import ArrowRightIcon from '@/components/Icons/ArrowRight'
import PasskeyIcon from '@/components/Icons/Auth/Passkey'
import QuestionIcon from '@/components/Icons/Auth/Question'
import DownloadIcon from '@/components/Icons/Download'
import Button from '@/components/new/Button'
import TextButton from '@/components/new/TextButton'
import MetamaskIcon from '@/assets/wallets/metamask.png'
import OKXWalletIcon from '@/assets/wallets/okx-wallet.png'
import CoinbaseIcon from '@/assets/wallets/coinbase.png'
import BinanceIcon from '@/assets/wallets/binance.png'
import WalletConnectIcon from '@/assets/wallets/wallet-connect.png'
import XDEFIIcon from '@/assets/wallets/xdefi-wallet.png'
import { useTempStore } from '@/store/temp';
import { useSettingStore } from '@/store/setting';
import useForm from '@/hooks/useForm';
import useKeystore from '@/hooks/useKeystore';
import api from '@/lib/api';
import { ethers } from 'ethers';
import useConfig from '@/hooks/useConfig';
import useTools from '@/hooks/useTools';
import FormInput from '@/components/new/FormInput';

const validate = (values: any) => {
  const errors: any = {};
  const addressKeys = Object.keys(values).filter((key) => key.indexOf('address') === 0);
  const nameKeys = Object.keys(values).filter((key) => key.indexOf('name') === 0);
  const existedAddress = [];

  for (const addressKey of addressKeys) {
    const address = values[addressKey];

    if (address && address.length && !ethers.isAddress(address)) {
      errors[addressKey] = 'Invalid Address';
    } else if (existedAddress.indexOf(address) !== -1) {
      errors[addressKey] = 'Duplicated Address';
    } else if (address && address.length) {
      existedAddress.push(address);
    }
  }

  return errors;
};

export default function BackupGuardianModal({
  isOpen,
  onClose,
  startIntroGuardian,
  startEditGuardian,
}: any) {
  const { calcGuardianHash } = useKeystore();
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);
  const { generateJsonName, downloadJsonFile } = useTools()
  const { chainConfig } = useConfig();
  const toast = useToast();
  const emailForm = useForm({
    fields: ['email'],
    validate,
  });
  const { getAddressName, saveAddressName } = useSettingStore();
  const { getEditingGuardiansInfo, updateEditingGuardiansInfo } = useTempStore();
  const guardiansInfo = getEditingGuardiansInfo();
  const guardianDetails = (guardiansInfo && guardiansInfo.guardianDetails) || {
    guardians: [],
    threshold: 0
  }
  console.log('guardianDetails', guardianDetails)
  const threshold = (guardiansInfo && guardiansInfo.threshold) || guardianDetails.threshold || 0
  const guardianNames = (guardiansInfo && guardiansInfo.guardianDetails && guardiansInfo.guardianDetails.guardians && guardiansInfo.guardianDetails.guardians.map((address: any) => getAddressName(address && address.toLowerCase()))) || []
  const guardianList = guardianDetails.guardians.map((guardian: any, i: number) => {
    return {
      address: guardian,
      name: guardianNames[i]
    }
  })

  const handleDownloadGuardians = async () => {
    try {
      setDownloading(true);
      const keystore = chainConfig.contracts.l1Keystore;
      const guardianAddresses = guardianList.map((item: any) => item.address);
      const guardianNames = guardianList.map((item: any) => item.name);
      const guardianHash = calcGuardianHash(guardianAddresses, threshold);
      const salt = ethers.ZeroHash;

      const guardiansInfo = {
        keystore,
        guardianHash,
        guardianNames,
        guardianDetails: {
          guardians: guardianAddresses,
          threshold,
          salt,
        }
      };

      await downloadJsonFile(guardiansInfo);
      setDownloading(false);
      updateEditingGuardiansInfo({
        requireBackup: false
      })
      toast({
        title: 'Email Backup Success!',
        status: 'success',
      });
    } catch (e: any) {
      setDownloading(false);
      toast({
        title: e.message,
        status: 'error',
      });
    }
  }

  const handleEmailBackupGuardians = async () => {
    try {
      setSending(true);
      const keystore = chainConfig.contracts.l1Keystore;
      const guardianAddresses = guardianList.map((item: any) => item.address);
      const guardianNames = guardianList.map((item: any) => item.name);
      const guardianHash = calcGuardianHash(guardianAddresses, threshold);
      const salt = ethers.ZeroHash;

      const guardiansInfo = {
        keystore,
        guardianHash,
        guardianNames,
        guardianDetails: {
          guardians: guardianAddresses,
          threshold,
          salt,
        }
      };

      const filename = generateJsonName('guardian');
      await api.guardian.emailBackupGuardians({
        email: emailForm.values.email,
        filename,
        ...guardiansInfo
      });
      setSending(false);
      emailForm.clearFields(['email'])
      updateEditingGuardiansInfo({
        requireBackup: false
      })
      toast({
        title: 'Email Backup Success!',
        status: 'success',
      });
    } catch (e: any) {
      setSending(false);
      toast({
        title: e.message,
        status: 'error',
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent width="434px" borderRadius="20px">
        <ModalCloseButton top="14px" />
        <ModalBody overflow="auto" padding="20px 32px" marginTop="40px">
          <Box
            height="100%"
            roundedBottom="20px"
            display="flex"
          >
            <Box width="100%" padding="0 20px">
              <Title fontSize="24px" fontWeight="800" textAlign="center">Backup List</Title>
              <TextBody fontWeight="700" marginBottom="24px" textAlign="center">
                Save your guardians list for easy wallet recovery.
              </TextBody>
              <Box display="flex" marginTop="14px" flexDirection="column">
                <Box width="100%">
                  <Button
                    onClick={handleDownloadGuardians}
                    disabled={downloading}
                    loading={downloading}
                    width="100%"
                    borderRadius="20px"
                    backgroundColor="#6A52EF"
                    borderColor="#6A52EF"
                    _hover={{ backgroundColor: "#6A52EF" }}
                  >
                    <Box marginRight="4px"><DownloadIcon /></Box>
                    Download
                  </Button>
                </Box>
                <Box
                  height="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  marginTop="24px"
                  position="relative"
                >
                  <Box background="#E4E4E4" width="100%" height="1px" />
                  <TextBody
                    textAlign="center"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="absolute"
                    backgroundColor="white"
                    padding="0 20px"
                    color="#CECECE"
                  >
                    Or
                  </TextBody>
                </Box>
                <Box width="100%" marginTop="24px">
                  <FormInput
                    label=""
                    placeholder="Send to Email"
                    value={emailForm.values.email}
                    errorMsg={emailForm.showErrors.email && emailForm.errors.email}
                    onChange={emailForm.onChange('email')}
                    onBlur={emailForm.onBlur('email')}
                    onEnter={handleEmailBackupGuardians}
                    _styles={{
                      width: '100%',
                      height: '48px',
                      borderRadius: '16px',
                      paddingRight: '24px',
                    }}
                  />
                </Box>
                <Box width="100%">
                  <Button
                    width="100%"
                    borderRadius="20px"
                    backgroundColor="black"
                    marginTop="12px"
                    onClick={handleEmailBackupGuardians}
                    disabled={sending || !emailForm.values.email}
                    loading={sending}
                  >
                    Send
                  </Button>
                  <TextButton
                    width="100%"
                    borderRadius="20px"
                    backgroundColor="black"
                    onClick={onClose}
                  >
                    <Box color="#898989">Cancel</Box>
                  </TextButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
