import React, { Fragment } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import ArrowRightIcon from '@/components/Icons/ArrowRight';
import Heading1 from '@/components/web/Heading1';
import TextBody from '@/components/web/TextBody';
import RoundButton from '@/components/web/Button';

export default function GuardianIntro({ startManage }: any) {
  return (
    <Fragment>
      <Box background="#D9D9D9" borderRadius="20px" padding="45px" display="flex">
        <Box width="40%" paddingRight="32px">
          <Heading1>Set up guardian</Heading1>
          <TextBody fontSize="18px" marginBottom="20px">To secure future social recovery of your wallet. Set up your guardians now! </TextBody>
          <Box>
            <RoundButton _styles={{ width: '320px', maxWidth: '100%' }} onClick={() => startManage()}>
              Set up now
            </RoundButton>
          </Box>
        </Box>
        <Box width="60%">
          <Box as="video" width="100%" aspectRatio="auto" borderRadius="24px" marginBottom="16px" marginTop="16px" controls>
            <source src="https://static-assets.soulwallet.io/videos/guardians-and-recovery-intro.webm" type="video/webm" />
          </Box>
        </Box>
      </Box>
      <Box padding="40px">
        <Box display="flex" alignItems="center" justifyContent="flex-start" marginBottom="16px">
          <ArrowRightIcon />
          <TextBody fontSize="16px" fontWeight="800" marginLeft="5px">
            What is Soul Wallet guardian?
          </TextBody>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="flex-start" marginBottom="16px">
          <ArrowRightIcon />
          <TextBody fontSize="16px" fontWeight="800" marginLeft="5px">
            What wallet can be set as guardian?
          </TextBody>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="flex-start">
          <ArrowRightIcon />
          <TextBody fontSize="16px" fontWeight="800" marginLeft="5px">
            What is wallet recovery?
          </TextBody>
        </Box>
      </Box>
    </Fragment>
  )
}
