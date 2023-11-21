import React, { useState } from 'react';
import FullscreenContainer from '@/components/FullscreenContainer';
import { Box, useToast } from '@chakra-ui/react';
import Heading1 from '@/components/web/Heading1';
import TextBody from '@/components/web/TextBody';
import Button from '@/components/web/Button';
import TextButton from '@/components/web/TextButton';
import Steps from '@/components/web/Steps';
import PassKeyList from '@/components/web/PassKeyList';
import usePassKey from '@/hooks/usePasskey';
import { useCredentialStore } from '@/store/credential';
import useBrowser from '@/hooks/useBrowser';
import useConfig from '@/hooks/useConfig';
import useKeystore from '@/hooks/useKeystore';
import { useGuardianStore } from '@/store/guardian';
import { ethers } from 'ethers';
import { L1KeyStore } from '@soulwallet/sdk';
import { toHex } from '@/lib/tools';
import useSdk from '@/hooks/useSdk';
import { useAddressStore } from '@/store/address';
import FormInput from '@/components/web/Form/FormInput';
import useForm from '@/hooks/useForm';
import WalletCard from '@/components/web/WalletCard';
import ArrowLeftIcon from '@/components/Icons/ArrowLeft';
import api from '@/lib/api';

const validate = (values: any) => {
  const errors: any = {};
  const { address } = values;

  if (!ethers.isAddress(address)) {
    errors.address = 'Invalid Address';
  }

  return errors;
};

export default function Recover({ changeStep }: any) {
  const { navigate } = useBrowser();
  const [loading, setLoading] = useState(false);
  const { getActiveGuardianHash } = useKeystore();
  const toast = useToast();
  const { values, errors, invalid, onChange, onBlur, showErrors } = useForm({
    fields: ['address'],
    validate,
  });
  const { updateRecoveringGuardiansInfo } = useGuardianStore();
  const disabled = loading || invalid;

  const handleNext = async () => {
    if (disabled) return;

    try {
      setLoading(true);
      const walletAddress = values.address
      const res1 = await api.guardian.getSlotInfo({ walletAddress });
      if (!res1.data) {
        setLoading(false);
        toast({
          title: 'No wallet found!',
          status: 'error',
        });
        return
      }
      const slotInitInfo = res1.data.slotInitInfo
      const initialKeysAddress = res1.data.initialKeys
      const slot = L1KeyStore.getSlot(slotInitInfo.initialKeyHash, slotInitInfo.initialGuardianHash, slotInitInfo.initialGuardianSafePeriod);
      const activeGuardianInfo = await getActiveGuardianHash(slotInitInfo)
      let activeGuardianHash

      if (activeGuardianInfo.pendingGuardianHash !== activeGuardianInfo.activeGuardianHash && activeGuardianInfo.guardianActivateAt && activeGuardianInfo.guardianActivateAt * 1000 < Date.now()) {
        activeGuardianHash = activeGuardianInfo.pendingGuardianHash
      } else {
        activeGuardianHash = activeGuardianInfo.activeGuardianHash
      }

      const res2 = await api.guardian.getGuardianDetails({ guardianHash: activeGuardianHash });
      const data = res2.data;

      if (!data) {
        setLoading(false);
        /* toast({
         *   title: 'No guardians found!',
         *   status: 'error',
         * }); */
        console.log('No guardians found!')

        updateRecoveringGuardiansInfo({
          slot,
          slotInitInfo,
          activeGuardianInfo,
          initialKeysAddress
        })
        changeStep(1)
      } else {
        const guardianDetails = data.guardianDetails;
        const guardianNames = data.guardianNames;
        console.log('getGuardianDetails', res2)

        updateRecoveringGuardiansInfo({
          slot,
          slotInitInfo,
          activeGuardianInfo,
          guardianDetails,
          initialKeysAddress,
          guardianHash: activeGuardianHash,
          guardianNames,
        })
        setLoading(false);
        changeStep(1)
      }
    } catch (e: any) {
      setLoading(false);
      toast({
        title: e.message,
        status: 'error',
      });
    }
  };

  const goBack = () => {
    navigate('/launch');
  };

  const onStepChange = () => {

  }

  return (
    <FullscreenContainer>
      <Box width="400px" maxWidth="calc(100vw - 20px)" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box marginBottom="12px" marginRight="24px">
          <Steps
            backgroundColor="#1E1E1E"
            foregroundColor="white"
            count={4}
            activeIndex={0}
            marginTop="24px"
            showBackButton
            onStepChange={changeStep}
          />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Heading1>Recover wallet</Heading1>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" width="320px" marginBottom="20px">
          <TextBody color="#1E1E1E" fontSize="16px" textAlign="center">
            Enter the address you want to recover.(Recommend activated wallet.)
          </TextBody>
        </Box>
        <FormInput
          label=""
          placeholder="Enter wallet address"
          value={values.address}
          onChange={onChange('address')}
          onBlur={onBlur('address')}
          errorMsg={showErrors.address && errors.address}
          _styles={{  w: '460px', maxW: "98%",  }}
          autoFocus={true}
          onEnter={handleNext}
        />
        <Button
          onClick={handleNext}
          _styles={{ width: '320px', marginTop: '12px' }}
          loading={loading}
        >
          Continue
        </Button>
      </Box>
    </FullscreenContainer>
  )
}
