import FullscreenContainer from '@/components/FullscreenContainer';
import { useStepDispatchContext } from '@/context/StepContext';
import { useRef, useState, useEffect } from 'react';
import attentionIcon from '@/assets/icons/attention.svg';
import useWallet from '@/hooks/useWallet';
import { useRecoveryContext } from '@/context/RecoveryContext';
import { Box, Text, useToast } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import Button from '@/components/web/Button';
import Heading1 from '@/components/web/Heading1';
import Heading2 from '@/components/web/Heading2';
import Heading3 from '@/components/web/Heading3';
import TextBody from '@/components/web/TextBody';
import CopyIcon from '@/components/Icons/Copy';
import CheckedIcon from '@/components/Icons/Checked';
import ErrorIcon from '@/components/Icons/Error';
import useTools from '@/hooks/useTools';
import { useGuardianStore } from '@/store/guardian';
import useWalletContext from '@/context/hooks/useWalletContext';
import api from '@/lib/api';
import config from '@/config';
import useBrowser from '@/hooks/useBrowser';
import { copyText, toShortAddress, getNetwork, getStatus, getKeystoreStatus } from '@/lib/tools';
import { useCredentialStore } from '@/store/credential';
import Steps from '@/components/web/Steps';

const getProgressPercent = (startTime: any, endTime: any) => {
  if (startTime && endTime) {
    const ct = Date.now();
    const st = +new Date(startTime);
    const et = +new Date(endTime);
    console.log('getProgressPercent', `${((ct - st) / (et - st)) * 100}%`);

    if (ct > et) {
      return '100%';
    } else if (ct > st && et > ct) {
      return `${((ct - st) / (et - st)) * 100}%`;
    }
  }

  return '0%';
};

const SignatureRequest = ({ changeStep }: any) => {
  const [loaded, setLoaded] = useState(false);
  const [replaced, setReplaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPayButton, setShowPayButton] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('');
  const { generateQrCode } = useTools();
  const { addCredential } = useCredentialStore();
  const {
    updateGuardiansInfo,
    recoveringGuardiansInfo,
    updateRecoveringGuardiansInfo,
    setSlotInfo
  } = useGuardianStore();
  // const { initRecoverWallet } = useWallet();
  const recoveryRecordID = recoveringGuardiansInfo.recoveryRecordID
  let guardianSignatures: any
  let chainRecoveryStatus: any
  let recoverStatus: any

  if (recoveringGuardiansInfo.recoveryRecord) {
    guardianSignatures = recoveringGuardiansInfo.recoveryRecord.guardianSignatures
    chainRecoveryStatus = recoveringGuardiansInfo.recoveryRecord.statusData.chainRecoveryStatus || []
    recoverStatus = recoveringGuardiansInfo.recoveryRecord.status
  }

  const toast = useToast();
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const { navigate } = useBrowser();

  const { cachedGuardians } = useRecoveryContext();
  const dispatch = useStepDispatchContext();

  const doCopy = () => {
    copyText(`${config.officialWebUrl}/recover/${recoveryRecordID}`);
    toast({
      title: 'Copy success!',
      status: 'success',
    });
  };

  const generateQR = async (text: string) => {
    try {
      setImgSrc(await generateQrCode(text));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    generateQR(`${config.officialWebUrl}/recover/${recoveryRecordID}`);
  }, []);

  const handleCopy = async () => {
    let url;

    if (recoverStatus === 1) {
      url = `${config.officialWebUrl}/pay-recover/${recoveryRecordID}`;
    } else {
      url = `${config.officialWebUrl}/recover/${recoveryRecordID}`;
    }

    copyText(url);

    toast({
      title: 'Copy success!',
      status: 'success',
    });
  };

  const handleNext = async () => {
    setShowPayButton(true);
  };

  const handlePay = async () => {
    setShowPayButton(false)
    setShowProgress(true)
    const url = `${config.officialWebUrl}/pay-recover/${recoveryRecordID}`;
    window.open(url, '_blank');
  };

  const replaceWallet = async () => {
    /* for (const credential of recoveringGuardiansInfo.credentials) {
     *   addCredential(credential)
     * }

     * updateGuardiansInfo({
     *   guardianDetails: recoveringGuardiansInfo.guardianDetails,
     *   guardianHash: recoveringGuardiansInfo.guardianHash,
     *   guardianNames: recoveringGuardiansInfo.guardianNames,
     *   keystore: recoveringGuardiansInfo.keystore,
     *   slot: recoveringGuardiansInfo.slot
     * });

     * setSlotInfo({
     *   ...recoveringGuardiansInfo.slotInitInfo,
     *   initialKeys: recoveringGuardiansInfo.credentials,
     *   initalkeysAddress: recoveringGuardiansInfo.initalkeysAddress,
     *   slot: recoveringGuardiansInfo.slot
     * }) */

    navigate('/wallet');
  };

  const openWallet = async () => {
    navigate('/wallet');
  };

  if (!loaded && false) {
    return (
      <Box
        width="400px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        paddingBottom="20px"
      >
        <Box marginTop="32" marginBottom="2em">
          <Text fontSize="xl" textAlign="center" fontWeight={'600'} fontFamily={'Martian'}>
            Loading...
          </Text>
        </Box>
      </Box>
    );
  }

  if (recoverStatus === 4) {
    return (
      <Box
        width="400px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        paddingBottom="20px"
      >
        <Heading1 _styles={{ marginBottom: '20px' }}>Recover wallet success</Heading1>
        <Button disabled={false} onClick={openWallet} _styles={{ width: '100%' }}>
          Open Wallet
        </Button>
      </Box>
    );
  }

  if (recoverStatus === 1 || showPayButton) {
    return (
      <Box
        width="320px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        paddingBottom="20px"
      >
        <Box marginBottom="12px" paddingRight="24px">
          <Steps backgroundColor="#1E1E1E" foregroundColor="white" count={4} activeIndex={3} marginTop="24px" showBackButton />
        </Box>
        <Heading1>Pay recovery fee</Heading1>
        <Box marginBottom="0.75em">
          <TextBody textAlign="center" maxWidth="500px">
            You will be directed to a new tab for payment, please keep this page open for next step.
          </TextBody>
        </Box>
        <Button onClick={handlePay} _styles={{ width: '100%', marginTop: '0.75em' }}>
          Pay fee
        </Button>
      </Box>
    );
  }

  if (recoverStatus > 1 || showProgress) {
    return (
      <Box
        width="400px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        marginBottom="20px"
      >
        <Heading1 _styles={{ marginBottom: '24px' }}>Wallet recovery in progress</Heading1>
        <Box
          marginBottom="0.75em"
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap="0.75em"
        >
          <Box
            display="flex"
            width="100%"
            background="white"
            height="3em"
            borderRadius="1em"
            alignItems="center"
            justifyContent="space-between"
            padding="0 1em"
          >
            <Box fontSize="14px" fontWeight="bold">
              Ethereum Wallet
            </Box>
            {recoverStatus >= 3 && (
              <Box
                fontSize="14px"
                fontWeight="bold"
                color="#1CD20F"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {getKeystoreStatus(recoverStatus)}
                <Text marginLeft="4px">
                  <CheckedIcon />
                </Text>
              </Box>
            )}
            {recoverStatus < 3 && (
              <Box
                fontSize="14px"
                fontWeight="bold"
                color="#848488"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {getKeystoreStatus(recoverStatus)}
              </Box>
            )}
          </Box>
          {chainRecoveryStatus.map((item: any) => (
            <Box
              key={item.chainId}
              display="flex"
              width="100%"
              background="white"
              height="3em"
              borderRadius="1em"
              alignItems="center"
              justifyContent="space-between"
              padding="0 1em"
              position="relative"
              overflow="hidden"
            >
              {item.status === 0 && (
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  width={getProgressPercent(item.startTime, item.expectFinishTime)}
                  height="100%"
                  zIndex="1"
                  background="#1CD20F"
                />
              )}
              <Box fontSize="14px" fontWeight="bold" zIndex="2">
                {getNetwork(Number(item.chainId))} Wallet(s)
              </Box>
              {item.status === 0 && (
                <Box fontSize="14px" fontWeight="bold" color="#848488" zIndex="2">
                  Pending
                </Box>
              )}
              {item.status === 1 && (
                <Box
                  fontSize="14px"
                  fontWeight="bold"
                  color="#1CD20F"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  zIndex="2"
                >
                  Recovered
                  <Text marginLeft="4px">
                    <CheckedIcon />
                  </Text>
                </Box>
              )}
            </Box>
          ))}
        </Box>
        <Button disabled={false} onClick={replaceWallet} _styles={{ width: '320px' }}>
          Open my wallet
        </Button>
      </Box>
    );
  }

  const signatures = (recoveringGuardiansInfo.guardianDetails.guardians || []).map((item: any) => {
    const isValid = (guardianSignatures || []).filter((sig: any) => sig.guardian === item && sig.valid).length === 1;
    return { guardian: item, isValid };
  });
  console.log('recoveringGuardians', signatures);
  return (
    <Box
      width="320px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      paddingBottom="20px"
    >
      <Box marginBottom="12px" paddingRight="24px">
        <Steps backgroundColor="#1E1E1E" foregroundColor="white" count={4} activeIndex={2} marginTop="24px" showBackButton />
      </Box>
      <Heading1>Guardian signature request</Heading1>
      <Box marginBottom="0.75em">
        <TextBody textAlign="center">Share this link with your guardians to sign.</TextBody>
      </Box>
      <Box
        marginBottom="0.75em"
        background="white"
        borderRadius="1em"
        width="100%"
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Text
          fontSize="16px"
          fontWeight="bold"
          marginBottom="0.75em"
          cursor="pointer"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={doCopy}
        >
          Copy to Clickboard
          <Text marginLeft="4px">
            <CopyIcon />
          </Text>
        </Text>
        <Box width="150px" height="150px">
          <Image src={imgSrc} width="150px" height="150px" />
        </Box>
      </Box>
      <Box marginBottom="0.75em">
        <TextBody textAlign="center">
          Waiting for signatures ({recoveringGuardiansInfo.threshold} of {recoveringGuardiansInfo.guardianDetails.guardians.length} complete)
        </TextBody>
      </Box>
      <Box
        marginBottom="0.75em"
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="0.75em"
      >
        {signatures.map((item: any) => (
          <Box
            display="flex"
            width="100%"
            background="white"
            height="3em"
            borderRadius="1em"
            alignItems="center"
            justifyContent="space-between"
            padding="0 1em"
          >
            <Box fontSize="14px" fontWeight="bold">
              {toShortAddress(item.guardian)}
            </Box>
            {item.isValid && (
              <Box
                fontSize="14px"
                fontWeight="bold"
                color="#1CD20F"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                Signed
                <Text marginLeft="4px">
                  <CheckedIcon />
                </Text>
              </Box>
            )}
            {!item.isValid && (
              <Box
                fontSize="14px"
                fontWeight="bold"
                color="#848488"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                Waiting
              </Box>
            )}
          </Box>
        ))}
      </Box>
      <Button disabled={!recoverStatus} onClick={handleNext} _styles={{ width: '320px' }}>
        Next
      </Button>
    </Box>
  );
};

export default SignatureRequest;
