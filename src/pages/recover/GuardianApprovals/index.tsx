import { useState, useCallback } from 'react';
import {
  Box,
  useToast,
  Input,
} from '@chakra-ui/react';
import RoundContainer from '@/components/new/RoundContainer'
import Heading from '@/components/new/Heading'
import TextBody from '@/components/new/TextBody'
import Button from '@/components/Button'
import { useTempStore } from '@/store/temp';
import CopyIcon from '@/components/Icons/Copy';
import OpenScanIcon from '@/components/Icons/OpenScan';
import { toShortAddress } from '@/lib/tools';
import useTools from '@/hooks/useTools';
import useConfig from '@/hooks/useConfig';
import useKeystore from '@/hooks/useKeystore';
import { L1KeyStore } from '@soulwallet/sdk';
import api from '@/lib/api';
import UploadIcon from '@/components/Icons/Upload'
import UploadedIcon from '@/components/Icons/Uploaded'
import { ethers } from 'ethers';
import StepProgress from '../StepProgress'
import AddGuardianModal from '../AddGuardianModal'
import AddressIcon from '@/components/AddressIcon';
import { useSettingStore } from '@/store/setting';
import { SignHeader } from '@/pages/public/Sign';

export default function AddSigner({ next, back }: any) {
  const { recoverInfo, updateRecoverInfo, getRecoverInfo } = useTempStore()
  const { recoveryRecordID, guardianDetails, recoveryRecord, signers } = recoverInfo
  const hasGuardians = !!guardianDetails
  const hasRecord = recoveryRecord && recoveryRecordID
  const guardianSignatures = hasRecord ? recoveryRecord.guardianSignatures : []
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [isConfirming, setIsConfirming] = useState<any>(false)
  const { getJsonFromFile, doCopy, } = useTools();
  const { chainConfig } = useConfig();
  const { calcGuardianHash } = useKeystore();
  const [isAddGuardianOpen, setIsAddGuardianOpen] = useState<any>(false);
  const { saveRecoverRecordId } = useSettingStore();
  const guardianSignUrl = `${location.origin}/public/sign/${recoveryRecordID}`

  const onAddGuardianConfirm = useCallback((addresses: any, names: any, threshold: any) => {
    console.log('onAddGuardianConfirm', addresses, names, threshold)
    const guardians = addresses
    const guardianNames = names
    const guardianDetails = {
      guardians,
      threshold,
      salt: ethers.ZeroHash
    }
    const guardianHash = calcGuardianHash(guardians, threshold);

    updateRecoverInfo({
      guardianDetails,
      guardianNames,
      guardianHash,
    });

    setIsAddGuardianOpen(false)
    handleNext()
  }, [])

  const openScan = (address: string) => {
    window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank')
  }

  const handleFileChange = async (event: any) => {
    try {
      setUploading(true);
      const file = event && event.target.files && event.target.files[0];

      if (!file) {
        setUploading(false);
        return;
      }

      const data: any = await getJsonFromFile(file);
      const guardianDetails = data.guardianDetails
      const guardianNames = data.guardianNames
      const guardians = guardianDetails.guardians
      const threshold = guardianDetails.threshold
      const guardianHash = calcGuardianHash(guardians, threshold);

      updateRecoverInfo({
        guardianDetails,
        guardianNames,
        guardianHash,
      });

      setUploading(false);
      setUploaded(true);
    } catch (e: any) {
      setUploading(false);
      toast({
        title: e.message,
        status: 'error',
      });
    }
  };

  const handleNext = useCallback(async () => {
    try {
      setIsConfirming(true)
      const keystore = chainConfig.contracts.l1Keystore;
      const initialKeys = signers.map((signer: any) => signer.signerId)
      const newOwners = L1KeyStore.initialKeysToAddress(initialKeys);
      const recoverInfo = getRecoverInfo()
      const slot = recoverInfo.slot
      const slotInitInfo = recoverInfo.slotInitInfo
      const guardianDetails = recoverInfo.guardianDetails

      const params = {
        guardianDetails,
        slot,
        slotInitInfo,
        keystore,
        newOwners
      }

      console.log('createRecoverRecord', params);

      const res = await api.guardian.createRecoverRecord(params)
      const recoveryRecordID = res.data.recoveryRecordID
      const res2 = await api.guardian.getRecoverRecord({ recoveryRecordID })
      const recoveryRecord = res2.data

      updateRecoverInfo({
        recoveryRecordID,
        recoveryRecord,
      });

      saveRecoverRecordId(slot, recoveryRecordID)
      setIsConfirming(false)
    } catch (error: any) {
      setIsConfirming(false)
      toast({
        title: error.message,
        status: 'error',
      });
    }
  }, [])

  const signatures = hasRecord ? (guardianDetails.guardians || []).map((item: any) => {
    const isValid = (guardianSignatures || []).filter((sig: any) => sig.guardian === item && sig.valid).length === 1;
    return { guardian: item, isValid };
  }) : [];

  console.log('signatures', signatures)

  if (!hasRecord) {
    return (
      <Box width="100%" minHeight="100vh" background="#F2F4F7">
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
                Step 3/4: Guardian signature request
              </Heading>
              <TextBody
                fontWeight="800"
                maxWidth="650px"
                marginBottom="10px"
                fontSize="18px"
              >
                Your guardians are private
              </TextBody>
              <Box fontSize="16px" fontWeight="500">
                Please upload the guardians file you saved during setup or enter Ethereum wallets addresses you set as guardians. Once recovered, your guardians will be public on chain.
              </Box>
              <Box
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                marginTop="20px"
                flexDirection={{ base: 'column', md: 'row' }}
              >
                <Button
                  width={{ base: '100%', md: '275px' }}
                  maxWidth="100%"
                  position="relative"
                  background={uploaded ? '#7F56D9' : 'black'}
                  borderColor={uploaded ? '#7F56D9' : 'black'}
                  onClick={handleFileChange as any}
                  disabled={uploading}
                  skipSignCheck
                  size="xl"
                >
                  <Box marginRight="4px">
                    {uploaded ? <UploadedIcon /> : <UploadIcon />}
                  </Box>
                  {uploaded ? "Uploaded" : "Upload guardians file"}
                  <Input
                    type="file"
                    id="file"
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    background="red"
                    opacity="0"
                    cursor="pointer"
                    onChange={handleFileChange}
                  />
                </Button>
                <Box padding="10px">Or</Box>
                <Button
                  width={{ base: '100%', md: '320px' }}
                  skipSignCheck
                  size="xl"
                  maxWidth="100%"
                  onClick={() => setIsAddGuardianOpen(true)}
                  type="white"
                >
                  Enter guardians info manually
                </Button>
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
                  width="80px"
                  maxWidth="100%"
                  type="black"
                  size="lg"
                  onClick={handleNext}
                  loading={isConfirming}
                  disabled={!hasGuardians || isConfirming}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </RoundContainer>
          <StepProgress activeIndex={2} />
        </Box>
        <AddGuardianModal
          isOpen={isAddGuardianOpen}
          onClose={() => setIsAddGuardianOpen(false)}
          onConfirm={onAddGuardianConfirm}
          setIsEditGuardianOpen={setIsAddGuardianOpen}
        // onBack={() => setIsAddGuardianOpen(false)}
          canGoBack={true}
        />
      </Box>
    )
  }

  return (
    <Box width="100%" minHeight="100vh" background="#F2F4F7">
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
              Step 3/4: Guardian signature request
            </Heading>
            <TextBody
              fontWeight="600"
              maxWidth="635px"
              marginBottom="20px"
            >
              Share this link with your guardians to sign:
            </TextBody>
            <Box            wordBreak={"break-all"} marginBottom="10px" background="#F9F9F9" borderRadius="12px" padding="12px" fontSize="18px" fontWeight="700">
              {guardianSignUrl}
            </Box>
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
            >
              <Button
                width="275px"
                maxWidth="100%"
                onClick={() => doCopy(guardianSignUrl)}
                size="xl"
              >
                Share link with guardians
              </Button>
            </Box>
            <Box width="100%" marginTop="40px" marginBottom="40px">
              <Box width="100%" height="1px" background="rgba(0, 0, 0, 0.10)" />
            </Box>
            <Box
              color="black"
              fontFamily="Nunito"
              fontSize="18px"
              fontWeight="800"
              marginBottom="16px"
            >
              {(!!signatures && !!signatures.length && signatures.filter((item: any) => !item.isValid).length) || 0} more guardians approval needed
            </Box>
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-start"
              flexWrap="wrap"
              width={{ base: '100%', md: '100%' }}
            >
              {signatures.map((item: any, index: number) => {
                return (
                  <Box
                    key={index}
                    border="1px solid rgba(0, 0, 0, 0.10)"
                    borderRadius="12px"
                    padding="14px"
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                    minWidth={{ base: '0', md: '400px' }}
                    marginRight={{ base: '0', md: '20px' }}
                    marginBottom="14px"
                    gap="8px"
                    width={{ base: '100%', md: 'auto' }}
                  >
                    <AddressIcon address={item.guardian} width={32} />
                    <Box fontSize="14px" fontWeight="700" fontFamily="Nunito" display="flex">
                      <Box>{toShortAddress(item.guardian)}</Box>
                      <Box height="100%" display="flex" alignItems="center" justifyContent="center" padding="0 10px">
                        <Box cursor="pointer" marginRight="4px" onClick={() => doCopy(item.guardian)}><CopyIcon color="#898989" /></Box>
                        <Box cursor="pointer" onClick={() => openScan(item.guardian)}><OpenScanIcon /></Box>
                      </Box>
                    </Box>
                    {item.isValid && (
                      <Box fontSize="14px" fontWeight="700" fontFamily="Nunito" color="#1CD20F" marginLeft="auto">Signed</Box>
                    )}
                    {!item.isValid && (
                      <Box
                        fontSize="14px"
                        fontWeight="700"
                        fontFamily="Nunito"
                        color="#848488"
                        marginLeft={{ base: '0', md: 'auto' }}
                      >
                        Waiting
                      </Box>
                    )}
                  </Box>
                )
              })}
            </Box>
          </Box>
        </RoundContainer>
        <StepProgress activeIndex={2} />
      </Box>
    </Box>
  )
}
