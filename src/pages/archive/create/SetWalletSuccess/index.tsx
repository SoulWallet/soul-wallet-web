import { createPortal } from 'react-dom'
import useBrowser from "@/hooks/useBrowser";
import {EnHandleMode} from '@/lib/type'
import Button from "@/components/web/Button";
import TextButton from "@/components/web/TextButton";
import { Box, Text } from "@chakra-ui/react"
import {Image} from "@chakra-ui/react";

import {motion} from 'framer-motion'
import animationData from './particle.json';
import Heading1 from "@/components/web/Heading1";
import Heading2 from "@/components/web/Heading2";
import Heading3 from "@/components/web/Heading3";
import TextBody from "@/components/web/TextBody";
import LogoIcon from "@/assets/logo-v3.svg";
import CurveArrowIcon from "@/components/Icons/CurveArrow";
import BrowserPinIcon from "@/assets/pinIcon.png";
import BackgroundImage from "@/assets/success-background.png";
import PluginIcon from "@/components/Icons/Plugin";
import PinIcon from "@/components/Icons/Pin";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData
}

interface IStepCompletion {
  mode: EnHandleMode;
}

const SetWalletSuccess = ({ mode }: IStepCompletion) => {
  const { navigate } = useBrowser();

  if (mode === EnHandleMode.Create) {
    return (
      <Box maxWidth="500px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" position="relative" paddingBottom="20px">
        <Heading1>Congratulations!</Heading1>
        <Box marginBottom="2em">
          <TextBody maxWidth="400px" textAlign="center">
            You're now ready to navigate Ethereum with security and simplicity thanks to your new Soul Wallet.
          </TextBody>
        </Box>
        <Button onClick={() => {
          navigate(`activate`)
        }} _styles={{ width: '100%', marginTop: '0.75em' }}>
          Activate Wallet
        </Button>
        {createPortal(
          <Box
            width="100hv"
            height="100wv"
          >
            <Image
              width="100%"
              src={BackgroundImage}
            />
          </Box>, (document.getElementById('animation-portal')) as any
        )}
      </Box>
    )
  }

  return null
};

export default SetWalletSuccess;
