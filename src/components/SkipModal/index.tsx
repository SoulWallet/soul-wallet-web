import React, { useState, useEffect, useRef, Fragment,} from 'react';
import FullscreenContainer from '@/components/FullscreenContainer';
import { Box, Text, useToast, Modal, ModalOverlay, ModalContent, Flex, Image, } from '@chakra-ui/react';
import Heading1 from '@/components/web/Heading1';
import TextBody from '@/components/web/TextBody';
// import Button from '@/components/web/Button';
import Button from '@/components/Button';
import TextButton from '@/components/web/TextButton';
import Steps from '@/components/web/Steps';
import useConfig from '@/hooks/useConfig';
import useKeystore from '@/hooks/useKeystore';
import { useGuardianStore } from '@/store/guardian';
import { useSlotStore } from '@/store/slot';
import { ethers } from 'ethers';
import WarningIcon from '@/components/Icons/Warning';
import GreySection from '@/components/GreySection'
import api from '@/lib/api';
import useForm from '@/hooks/useForm';
import { nextRandomId } from '@/lib/tools';
import IconChecked from '@/assets/icons/checkbox-checked.svg';
import IconUnchecked from '@/assets/icons/checkbox-unchecked.svg';
import GuardianModal from '@/pages/security/Guardian/GuardianModal';
import useTools from '@/hooks/useTools';
import Backup from '@/components/Guardian/Backup';
import Edit from '@/components/Guardian/Edit';
import DoubleCheckModal from '@/components/Guardian/Confirm';
import { useSettingStore } from '@/store/setting';
import useWallet from '@/hooks/useWallet';
import { defaultGuardianSafePeriod } from '@/config';
import { useTempStore } from '@/store/temp';

export default function SkipModal({ isOpen, onClose }: any) {
  const { createWallet } = useWallet();
  const { updateCreateInfo } = useTempStore();
  const [understood, setUnderstood] = useState(false);
  const [creating, setCreating] = useState(false);

  const doSkip = async () => {
    console.log('skipSetupGuardian')
    setCreating(true);
    // generate wallet address
    const noGuardian = {
      initialGuardianHash: ethers.ZeroHash,
      initialGuardianSafePeriod: defaultGuardianSafePeriod,
    };
    updateCreateInfo(noGuardian);
    await createWallet(noGuardian);
    setCreating(false);

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        maxW={{ base: '360px', md: '440px' }}
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        padding="30px"
        overflow="auto"
      >
        <Box width="320px">
          <Box width="100%" display="flex" alignItems="center" justifyContent="center" padding="20px" paddingTop="10px">
            <WarningIcon />
          </Box>
          <Box marginBottom="16px">
            <Box display="flex" alignItems="center" justifyContent="flex-start">
              <TextBody fontSize="16px" fontWeight="800">
                What if I don’t set up guardians now?
              </TextBody>
            </Box>
            <Box maxWidth="100%">
              <TextBody fontSize="14px" fontWeight="500">
                Guardians are required to recover your wallet. You will need to pay a network fee when setting up your
                guardians after wallet creation.
              </TextBody>
            </Box>
          </Box>
          <Box marginBottom="6">
            <Box display="flex" alignItems="center" justifyContent="flex-start">
              <TextBody fontSize="16px" fontWeight="800">
                Can I change my guardians in the future?
              </TextBody>
            </Box>
            <Box maxWidth="100%">
              <TextBody fontSize="14px" fontWeight="500">
                Yes. You can always setup or edit your guardians in your wallet. (Network fee will occur.)
              </TextBody>
            </Box>
          </Box>
          <Flex align={'center'} gap="1" cursor="pointer" onClick={() => setUnderstood(prev => !prev)}>
            <Image src={understood ? IconChecked : IconUnchecked} />
            <Text fontSize={"14px"} fontWeight={"500"}>
              I understand, do it anyway!
            </Text>
          </Flex>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="6">
            <Button mb="5" disabled={!understood} loading={creating} onClick={doSkip} w="100%" fontWeight={"700"} fontSize={"18px"} height="48px" rounded="full">
              Confirm
            </Button>
            <Text fontSize={'18px'} fontWeight={'700'} onClick={onClose} cursor={'pointer'}>
              Back
            </Text>
            {/* <Button  _styles={{ width: '320px', marginBottom: '12px' }}>
                Set up now
                </Button>
                <TextButton loading={skipping} disabled={skipping} onClick={doSkip} _styles={{ width: '320px', maxWidth: '320px', padding: '0 20px', whiteSpace: 'break-spaces' }}>
                {skipping ? 'Skipping...' : 'I understand the risks, skip for now'}
                </TextButton> */}
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
}
