import FullscreenContainer from "@/components/FullscreenContainer";
import { StepActionTypeEn, useStepDispatchContext, CreateStepEn, RecoverStepEn } from "@/context/StepContext";
import useBrowser from "@/hooks/useBrowser";
import { Box, Center, Flex, Text, Image } from "@chakra-ui/react";
import CreateWalletIcon from "@/components/Icons/CreateWallet";
import RecoverWalletIcon from "@/components/Icons/RecoverWallet";
import TextBody from "@/components/web/TextBody";
import storage from "@/lib/storage";
import Button from "@/components/web/Button"
import Logo from "@/components/web/Logo";

export default function Launch() {
  const dispatch = useStepDispatchContext();
  const { navigate } = useBrowser();

  const handleJumpToTargetStep = (targetStep: number, to: string) => {
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: targetStep,
    });
    navigate(to)
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Logo direction="column" />
      <Box display="flex" flexDirection="column" alignItems="center" margin="50px 0" paddingBottom="50px">
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button
            onClick={() => {}}
            _styles={{ width: '282px', borderRadius: '40px', marginRight: '20px' }}
          >
            Login
          </Button>
          <Button
            onClick={() => {}}
            _styles={{ width: '282px', borderRadius: '40px' }}
          >
            Create new wallet
          </Button>
        </Box>
        <TextBody color="#898989" marginTop="24px">Soul Wallet will create a smart contract wallet for you using passkeys.</TextBody>
      </Box>
    </Box>
  );
}
