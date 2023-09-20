import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from "@/context/StepContext";
import WalletCardIcon from "@/components/Icons/WalletCard";
import React from "react";
import WalletCard from "@/components/web/WalletCard";
import Button from "@/components/web/Button";
import TextButton from "@/components/web/TextButton";
import { Box, Text, Image } from "@chakra-ui/react"
import Heading1 from "@/components/web/Heading1";
import Heading2 from "@/components/web/Heading2";
import Heading3 from "@/components/web/Heading3";
import TextBody from "@/components/web/TextBody";
import { useSettingStore } from "@/store/setting";
import Steps from "@/components/web/Steps";

const SetDefaultWallet = () => {
  const dispatch = useStepDispatchContext();
  const { setGlobalShouldInject } = useSettingStore();


  const handleNext = async (setDefault = true) => {
    setGlobalShouldInject(setDefault);

    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: CreateStepEn.Completed,
    });
  };

  return (
    <Box maxWidth="500px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingBottom="20px">
      <WalletCard statusText="SET AS DEFAULT" steps={<Steps backgroundColor="#29510A" foregroundColor="#E2FC89" count={3} activeIndex={2} marginTop="24px" />} />
      <Heading1>Set as default wallet</Heading1>
      <Box marginBottom="2em">
        <TextBody textAlign="center" maxWidth="400px">
          Boost your Ethereum journey by setting Soul Wallet as your primary plugin wallet. You can always easily change this setting.
        </TextBody>
      </Box>
      <Button onClick={() => handleNext(true)} _styles={{ width: '100%', marginTop: '0.75em' }}>
        Yes
      </Button>
      <TextButton onClick={() => handleNext(false)} _styles={{ width: '100%' }}>
        Skip
      </TextButton>
    </Box>
  );
};

export default SetDefaultWallet;
