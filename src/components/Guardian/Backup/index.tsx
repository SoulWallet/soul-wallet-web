import React, { Fragment, useState } from 'react';
import { Box, Button, Text, useToast } from '@chakra-ui/react';
import Heading1 from '@/components/web/Heading1';
import Heading3 from '@/components/web/Heading3';
import TextBody from '@/components/web/TextBody';
import RoundButton from '@/components/web/Button';
import DownloadIcon from '@/components/Icons/Download';
import SendIcon from '@/components/Icons/Send';
import IconButton from '@/components/web/IconButton';
import FormInput from '@/components/web/Form/FormInput';

export default function Backup({
  handleEmailBackupGuardians,
  handleDownloadGuardians,
  downloading,
  sending,
  emailForm,
  confirmButton,
  backButton,
  step
}: any) {
  return (
    <Box width="100%" display="flex" alignItems="center" justifyContent="center">
      <Box width="320px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        {step}
        {backButton}
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
          {confirmButton}
        </Box>
      </Box>
    </Box>
  )
}
