import React, { Fragment } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import ArrowRightIcon from '@/components/Icons/ArrowRight';
import Heading1 from '@/components/web/Heading1';
import TextBody from '@/components/web/TextBody';
import RoundButton from '@/components/web/Button';
import TextButton from '@/components/web/TextButton';

export default function GuardianList() {
  return (
    <Fragment>
      <Box background="#D9D9D9" borderRadius="20px" padding="45px" display="flex">
        <Box width="40%" paddingRight="32px">
          <Heading1>Current guardian</Heading1>
          <TextBody fontSize="18px" marginBottom="20px">Choose trusted friends or use your existing Ethereum wallets as guardians. Learn more</TextBody>
          <Box>
            <TextButton _styles={{ padding: '0', color: '#EC588D' }} _hover={{ color: '#EC588D' }} onClick={() => {}}>
              Learn more
            </TextButton>
          </Box>
        </Box>
        <Box width="60%">
          <Box as="video" width="100%" aspectRatio="auto" borderRadius="24px" marginBottom="16px" marginTop="16px" controls>
            <source src="https://static-assets.soulwallet.io/videos/guardians-and-recovery-intro.webm" type="video/webm" />
          </Box>
        </Box>
      </Box>
      <Box padding="40px">
        <Box display="flex" alignItems="center" justifyContent="center">
          <RoundButton _styles={{ width: '320px', background: '#1E1E1E', color: 'white' }} _hover={{ background: '#1E1E1E', color: 'white' }} onClick={() => {}}>
            Backup current guardian
          </RoundButton>
        </Box>
      </Box>
    </Fragment>
  )
}
