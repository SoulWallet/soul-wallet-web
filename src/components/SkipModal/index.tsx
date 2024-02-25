import { useState } from 'react';
import { Box, Text, Modal, ModalOverlay, ModalContent, Flex, Image, } from '@chakra-ui/react';
import TextBody from '@/components/new/TextBody';
import Button from '@/components/Button';
import { ethers } from 'ethers';
import WarningIcon from '@/components/Icons/Warning';
import IconChecked from '@/assets/icons/checkbox-checked.svg';
import IconUnchecked from '@/assets/icons/checkbox-unchecked.svg';
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
            <Image display={understood ? 'none' : 'block'} src={IconUnchecked} />
            <Image display={understood ? 'block' : 'none'} src={IconChecked} />
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
