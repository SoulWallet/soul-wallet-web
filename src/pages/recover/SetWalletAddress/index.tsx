import { useState } from 'react';
import useBrowser from '@/hooks/useBrowser';
import {
  Box,
  Flex,
  useToast
} from '@chakra-ui/react';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/Button'
import { useTempStore } from '@/store/temp';
import useForm from '@/hooks/useForm';
import FormInput from '@/components/new/FormInput'
import { ethers } from 'ethers';
import api from '@/lib/api';
import useKeystore from '@/hooks/useKeystore';
import StepProgress from '../StepProgress'
import { SignHeader } from '@/pages/public/Sign';

const validate = (values: any) => {
  const errors: any = {};
  const { address } = values;

  let trimedAddress = address ? address.trim() : '';
  if (trimedAddress.includes(':')) {
    trimedAddress = trimedAddress.split(':')[1];
  }

  if (!ethers.isAddress(trimedAddress)) {
    errors.address = 'Invalid Address';
  }

  return errors;
};

export default function SetWalletAddress({ next, back }: any) {
  const toast = useToast();
  const { navigate } = useBrowser();
  const { updateRecoverInfo } = useTempStore()
  const [loading, setLoading] = useState(false);
  const { values, errors, invalid, onChange, onBlur, showErrors } = useForm({
    fields: ['address'],
    validate,
  });
  const { getActiveGuardianHash } = useKeystore();
  const disabled = loading || invalid;

  const handleNext = async () => {
    if (disabled) return;

    try {
      setLoading(true);
      let walletAddress = values.address;
      if(walletAddress.includes(':')) {
        walletAddress = walletAddress.split(':')[1]
      }
      const res1 = await api.guardian.getSlotInfo({ walletAddress });
      if (!res1.data) {
        setLoading(false);
        toast({
          title: 'No wallet found!',
          status: 'error',
        });
        return
      }

      const info = res1.data
      const {
        initialKeys,
        keystore,
        slot,
        slotInitInfo,
        walletAddresses
      } = info

      const initialKeysAddress = initialKeys
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
        console.log('No guardians found!')

        updateRecoverInfo({
          slot,
          slotInitInfo,
          activeGuardianInfo,
          initialKeysAddress,
          walletAddresses
        })
      } else {
        const guardianDetails = data.guardianDetails;
        const guardianNames = data.guardianNames;

        updateRecoverInfo({
          slot,
          slotInitInfo,
          activeGuardianInfo,
          guardianDetails,
          initialKeysAddress,
          guardianHash: activeGuardianHash,
          guardianNames,
          walletAddresses
        })
      }

      setLoading(false);
      next()
    } catch (e: any) {
      setLoading(false);
      toast({
        title: e.message,
        status: 'error',
      });
    }
  };

  return (
    <Flex align={'center'} justify={'center'} width="100%" minHeight="100vh" background="#F2F4F7">
      <SignHeader url="/auth" />
      <Box
        padding="20px"
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        minHeight="calc(100% - 58px)"
        width="100%"
        paddingTop="60px"
        flexDirection={{ base: 'column', 'md': 'row' }}
      >
        <RoundContainer
          width="1058px"
          maxWidth="100%"
          maxHeight="100%"
          display="flex"
          padding="0"
          overflow="hidden"
          background="white"
          marginBottom="20px"
        >
          <Box
            width="100%"
            height="100%"
            padding={{ base: '20px', md: '50px' }}
            display="flex"
            alignItems="flex-start"
            justifyContent="center"
            flexDirection="column"
          >
            <Heading marginBottom="18px" type="h4" fontSize="24px" fontWeight="700">
              Step 1/4: Wallet address
            </Heading>
            <TextBody
              fontWeight="600"
              maxWidth="550px"
              marginBottom="20px"
            >
              Enter any one of your wallet address on any chains, we'll be able to recover them all.
            </TextBody>
            <Box width="550px" maxWidth="100%">
              <FormInput
                label=""
                placeholder="Enter ENS or wallet adderss"
                value={values.address}
                onChange={onChange('address')}
                onBlur={onBlur('address')}
                errorMsg={showErrors.address && errors.address}
                _styles={{  w: '100%'  }}
                autoFocus={true}
                onEnter={handleNext}
              />
            </Box>
            <Box width="100%" display="flex" alignItems="center" justifyContent="center" marginTop="100px">
              <Button
                width="80px"
                type="white"
                marginRight="12px"
                size="lg"
                onClick={back}
              >
                Back
              </Button>
              <Button
                minWidth="80px"
                type="black"
                size="lg"
                onClick={handleNext}
                disabled={disabled}
                loading={loading}
              >
                Next
              </Button>
            </Box>
          </Box>
        </RoundContainer>
        <StepProgress activeIndex={0} />
      </Box>
    </Flex>
  )
}
