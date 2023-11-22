import React, { Fragment } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import ArrowRightIcon from '@/components/Icons/ArrowRight';
import Heading1 from '@/components/web/Heading1';
import TextBody from '@/components/web/TextBody';
import RoundButton from '@/components/web/Button';
import { useGuardianStore } from '@/store/guardian';
import GreySection from '@/components/GreySection'

export default function GuardianIntro({ startManage, startEdit }: any) {
  const { guardiansInfo } = useGuardianStore();
  const hasGuardians = guardiansInfo.guardianDetails && guardiansInfo.guardianDetails.guardians && !!guardiansInfo.guardianDetails.guardians.length

  const setup = () => {
    if (hasGuardians) {
      startManage()
    } else {
      startEdit()
    }
  }

  return (
    <Fragment>
      <GreySection
        padding={{ base: '16px', md: '16px 45px' }}
        leftPart={
          <Fragment>
            <Heading1>Set up guardian</Heading1>
            <TextBody fontSize="18px" marginBottom="20px">To secure future social recovery of your wallet. Set up your guardians now! </TextBody>
            <Box>
              <RoundButton _styles={{ width: '320px', maxWidth: '100%' }} onClick={() => setup()}>
                Set up now
              </RoundButton>
            </Box>
          </Fragment>
        }
        rightPart={
          <Box
            as="video"
            width="760px"
            aspectRatio="auto"
            borderRadius="24px"
            controls
          >
            <source src="https://static-assets.soulwallet.io/videos/guardians-and-recovery-intro.webm" type="video/webm" />
          </Box>
        }
      />
      <Box padding={{ base: '0px', md: '40px' }} paddingTop="40px">
        <Box marginBottom="16px">
          <Box display="flex" alignItems="center" justifyContent="flex-start">
            {/* <ArrowRightIcon /> */}
            <TextBody fontSize="16px" fontWeight="800">
              What is Soul Wallet guardian?
            </TextBody>
          </Box>
          <Box maxWidth="560px">
            <TextBody fontSize="14px" fontWeight="700">
              Guardians are Ethereum wallet addresses that assist you in recovering your wallet if needed. Soul Wallet replaces recovery phrases with guardian-signature social recovery, improving security and usability.
            </TextBody>
          </Box>
        </Box>
        <Box marginBottom="16px">
          <Box display="flex" alignItems="center" justifyContent="flex-start">
            <TextBody fontSize="16px" fontWeight="800">
              Who can be my guardians?
            </TextBody>
          </Box>
          <Box maxWidth="560px">
            <TextBody fontSize="14px" fontWeight="700">
              Choose trusted friends or use your existing Ethereum wallets as guardians. You can setup using regular Ethereum wallets (e.g MetaMask, Ledger, Coinbase Wallet, etc) and other Soul Wallets as your guardians. If choosing a Soul Wallet as your guardian, ensure it's activated on Ethereum for social recovery.
            </TextBody>
          </Box>
        </Box>
        <Box>
          <Box display="flex" alignItems="center" justifyContent="flex-start">
            <TextBody fontSize="16px" fontWeight="800">
              What is wallet recovery?
            </TextBody>
          </Box>
          <Box maxWidth="560px">
            <TextBody fontSize="14px" fontWeight="700">
              If your Soul Wallet is lost or stolen, social recovery helps you easily retrieve wallets with guardian signatures. The guardian list will be stored in an Ethereum-based keystore contract.
            </TextBody>
          </Box>
        </Box>
      </Box>
    </Fragment>
  )
}
