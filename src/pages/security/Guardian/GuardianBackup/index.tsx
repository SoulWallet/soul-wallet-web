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

const validate = (values: any) => {
  const errors: any = {};
  const { email } = values;

  if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  return errors;
};

export default function GuardianBackup({ startManage, cancelBackup }: any) {
  const { setEditingGuardiansInfo } = useGuardianStore();
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast()
  const emailForm = useForm({
    fields: ['email'],
    validate,
  });

  const getGuardiansInfo = async () => {
    /* const keystore = chainConfig.contracts.l1Keystore;
     * const initialKeys = await Promise.all(credentials.map((credential: any) => getCoordinates(credential.publicKey)))

     * const guardianHash = calcGuardianHash(guardians, threshold);
     * const initialGuardianHash = guardianHash;
     * const salt = ethers.ZeroHash;
     * let initialGuardianSafePeriod = L1KeyStore.days * 2;
     * initialGuardianSafePeriod = toHex(initialGuardianSafePeriod as any);
     * const slot = L1KeyStore.getSlot(initialKey, initialGuardianHash, initialGuardianSafePeriod);
     * const slotInitInfo = {
     *   initialKey,
     *   initialGuardianHash,
     *   initialGuardianSafePeriod,
     * };

     * return {
     *   keystore,
     *   slot,
     *   guardianHash: initialGuardianHash,
     *   guardianNames: [],
     *   guardianDetails: {
     *     guardians: [],
     *     threshold: 0,
     *     salt,
     *   },
     * }; */
  };

  const handleBackupGuardians = async () => {
    /* try {
     *   setLoading(true);
     *   const info = await getGuardiansInfo();
     *   const result = await api.guardian.backupGuardians(info);
     *   setSlot(info.slot);
     *   setSlotInitInfo(info.slotInitInfo);
     *   setLoading(false);
     *   setLoaded(true);
     *   toast({
     *     title: 'OnChain Backup Success!',
     *     status: 'success',
     *   });
     *   console.log('handleBackupGuardians', result);
     * } catch (e: any) {
     *   setLoading(false);
     *   toast({
     *     title: e.message,
     *     status: 'error',
     *   });
     * } */
  }

  const handleEmailBackupGuardians = async () => {

  }

  const handleDownloadGuardians = async () => {

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
