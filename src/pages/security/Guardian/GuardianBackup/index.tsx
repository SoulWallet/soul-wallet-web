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
import Backup from '@/components/Guardian/Backup';
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
  const { guardiansInfo, updateGuardiansInfo } = useGuardianStore();
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
    <Backup
      handleEmailBackupGuardians={handleEmailBackupGuardians}
      handleDownloadGuardians={handleDownloadGuardians}
      downloading={downloading}
      sending={sending}
      emailForm={emailForm}
      cancelBackup={cancelBackup}
      confirmButton={
        <RoundButton
          onClick={() => cancelBackup()}
          _styles={{ width: '320px', marginTop: '60px' }}
        >
          Back
        </RoundButton>
      }
    />
  )
}
