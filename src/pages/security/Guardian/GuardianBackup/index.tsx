import React, { Fragment, useState } from 'react';
import { Box, Button, Text, useToast } from '@chakra-ui/react';
import ArrowRightIcon from '@/components/Icons/ArrowRight';
import Heading1 from '@/components/web/Heading1';
import Heading3 from '@/components/web/Heading3';
import TextBody from '@/components/web/TextBody';
import RoundButton from '@/components/web/Button';
import DownloadIcon from '@/components/Icons/Download';
import SendIcon from '@/components/Icons/Send';
import BlockBoxIcon from '@/components/Icons/BlockBox';
import IconButton from '@/components/web/IconButton';
import FormInput from '@/components/web/Form/FormInput';
import { validateEmail } from '@/lib/tools';
import { useGuardianStore } from '@/store/guardian';
import useForm from '@/hooks/useForm';
import useTools from '@/hooks/useTools';
import { useAddressStore } from '@/store/address';
import api from '@/lib/api';

const validate = (values: any) => {
  const errors: any = {};
  const { email } = values;

  if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  return errors;
};

export default function GuardianBackup({ startManage, cancelBackup }: any) {
  const { guardiansInfo, setEditingGuardiansInfo } = useGuardianStore();
  const { generateJsonName, downloadJsonFile } = useTools()
  const { selectedAddress } = useAddressStore();
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast()
  const emailForm = useForm({
    fields: ['email'],
    validate,
  });

  const handleBackupGuardians = async () => {
    try {
      setLoading(true);
      await api.guardian.backupGuardians(guardiansInfo);
      setLoading(false);
      toast({
        title: 'OnChain Backup Success!',
        status: 'success',
      });
    } catch (e: any) {
      setLoading(false);
      toast({
        title: e.message,
        status: 'error',
      });
    }
  }

  const handleEmailBackupGuardians = async () => {
    try {
      setSending(true);
      const filename = generateJsonName('guardian');
      await api.guardian.emailBackupGuardians({
        email: emailForm.values.email,
        filename,
        ...guardiansInfo
      });
      setSending(false);
      emailForm.clearFields(['email'])
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

  const handleDownloadGuardians = async () => {
    try {
      setDownloading(true);
      await downloadJsonFile(guardiansInfo);
      setDownloading(false);
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

  return (
    <Fragment>
      <Box background="#D9D9D9" borderRadius="20px" padding="45px" display="flex">
        <Box width="33%" paddingRight="32px">
          <Heading1>Backup guardian file</Heading1>
          <TextBody fontSize="18px" marginBottom="20px">Make sure to save your list of guardians for social recovery. Choose at least one method below to keep this list safe.</TextBody>
        </Box>
        <Box
          width="33%"
          padding="20px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
          borderRight="1px solid #D7D7D7"
        >
          <Heading3>Save by yourself</Heading3>
          <Box marginBottom="0.75em">
            <TextBody textAlign="center">
              If you are saving the list by yourself, make sure to remember where the file is for wallet recovery
            </TextBody>
          </Box>
          <RoundButton
            onClick={handleDownloadGuardians}
            disabled={downloading}
            loading={downloading}
            _styles={{ width: '320px', marginTop: '12px' }}
            LeftIcon={<DownloadIcon />}
          >
            Download to Local
          </RoundButton>
          <TextBody marginTop="12px">Or</TextBody>
          <FormInput
            label=""
            placeholder="Send to Email"
            value={emailForm.values.email}
            errorMsg={emailForm.showErrors.email && emailForm.errors.email}
            onChange={emailForm.onChange('email')}
            onBlur={emailForm.onBlur('email')}
            onEnter={handleEmailBackupGuardians}
            _styles={{ width: '320px', marginTop: '12px' }}
            _inputStyles={{ background: 'white' }}
            RightIcon={
              <IconButton
                onClick={handleEmailBackupGuardians}
                disabled={sending || !emailForm.values.email}
                loading={sending}
              >
                {!emailForm.values.email && <SendIcon opacity="0.4" />}
                {!!emailForm.values.email && <SendIcon color={'#EE3F99'} />}
              </IconButton>
            }
          />
        </Box>
        <Box
          width="33%"
          padding="20px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Heading3>Save with Soul Wallet</Heading3>
          <Box marginBottom="0.75em">
            <TextBody textAlign="center">
              Soul Wallet can store your list encrypted on-chain, but you still need to remember your wallet address for
              recovery.
            </TextBody>
          </Box>
          <RoundButton disabled={loading} loading={loading} _styles={{ width: '320px' }} onClick={handleBackupGuardians}>
            <Box marginRight="8px">
              <BlockBoxIcon />
            </Box>
            Store onchain
          </RoundButton>
        </Box>
      </Box>
      <Box padding="40px">
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <RoundButton _styles={{ width: '320px', background: '#1E1E1E', color: 'white' }} _hover={{ background: '#1E1E1E', color: 'white' }} onClick={() => cancelBackup()}>
            Done
          </RoundButton>
        </Box>
      </Box>
    </Fragment>
  )
}
