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
import TextButton from '@/components/web/TextButton';
import ArrowLeftIcon from '@/components/Icons/ArrowLeft';
import api from '@/lib/api';

const validate = (values: any) => {
  const errors: any = {};
  const { email } = values;
  /*
   *   if (email && !validateEmail(email)) {
   *     errors.email = 'Please enter a valid email address.';
   *   }
   *  */
  return errors;
};

export default function GuardianBackup({ startManage, cancelBackup }: any) {
  const { guardiansInfo, setEditingGuardiansInfo, updateGuardiansInfo } = useGuardianStore();
  const { generateJsonName, downloadJsonFile } = useTools()
  const { selectedAddress } = useAddressStore();
  const [isDone, setIsDone] = useState(false);
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
      setIsDone(true)
      updateGuardiansInfo({
        requireBackup: false
      })
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

      if (!validateEmail(emailForm.values.email)) {
        toast({
          title: 'Invalid Email!',
          status: 'error',
        });
      }

      const filename = generateJsonName('guardian');
      await api.guardian.emailBackupGuardians({
        email: emailForm.values.email,
        filename,
        ...guardiansInfo
      });
      setSending(false);
      emailForm.clearFields(['email'])
      setIsDone(true)
      updateGuardiansInfo({
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

  const handleDownloadGuardians = async () => {
    try {
      setDownloading(true);
      await downloadJsonFile(guardiansInfo);
      setDownloading(false);
      setIsDone(true)
      updateGuardiansInfo({
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

  return (
    <Box width="100%" display="flex" alignItems="center" justifyContent="center">
      <Box width="320px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Heading1>Backup guardians</Heading1>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" marginBottom="60px">
          <TextBody color="#1E1E1E" textAlign="center" fontSize="14px">
            Save your guardians list for easy wallet recovery.
          </TextBody>
        </Box>
        <Box>
          <RoundButton
            onClick={handleDownloadGuardians}
            disabled={downloading}
            loading={downloading}
            _styles={{ width: '320px', background: '#9648FA' }}
            _hover={{ background: '#9648FA' }}
            LeftIcon={<DownloadIcon />}
          >
            Download
          </RoundButton>
          <TextBody marginTop="8px" textAlign="center" display="flex" alignItems="center" justifyContent="center">Or</TextBody>
          <FormInput
            label=""
            placeholder="Send to Email"
            value={emailForm.values.email}
            errorMsg={emailForm.showErrors.email && emailForm.errors.email}
            onChange={emailForm.onChange('email')}
            onBlur={emailForm.onBlur('email')}
            onEnter={handleEmailBackupGuardians}
            _styles={{ width: '320px', marginTop: '8px' }}
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
          <RoundButton
            onClick={() => cancelBackup()}
            loading={loading}
            _styles={{ width: '320px', marginTop: '60px' }}
          >
            Back
          </RoundButton>
        </Box>
      </Box>
    </Box>
  )
}
