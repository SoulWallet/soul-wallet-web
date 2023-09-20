import { useEffect, useState } from "react";
import useKeyring from "@/hooks/useKeyring";
import { CreateStepEn, RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@/context/StepContext";
import WalletCard from "@/components/web/WalletCard";
import { Box, useToast } from "@chakra-ui/react"
import PasswordStrengthBar from "@/components/web/PasswordStrengthBar";
import Button from "@/components/web/Button";
import FormInput from "@/components/web/Form/FormInput";
import useForm from "@/hooks/useForm";
import Heading1 from "@/components/web/Heading1";
import Heading2 from "@/components/web/Heading2";
import Heading3 from "@/components/web/Heading3";
import TextBody from "@/components/web/TextBody";
import useWalletContext from "@/context/hooks/useWalletContext";
import { useGuardianStore } from "@/store/guardian";
import { ethers } from "ethers";
import useConfig from "@/hooks/useConfig";
import api from "@/lib/api";
import Steps from "@/components/web/Steps";
import PasswordForm from "@/components/web/PasswordForm";

export default function SetPassword({ onStepChange }: any) {
  const dispatch = useStepDispatchContext();
  const keystore = useKeyring();
  const { getAccount } = useWalletContext()
  const { setNewKey, setRecoverRecordId, recoveringGuardians, recoveringThreshold, recoveringSlot, recoveringSlotInitInfo, newKey } = useGuardianStore();
  const toast = useToast()
  const { chainConfig } = useConfig();
  const [loading, setLoaing] = useState(false)

  const createRecoverRecord = async (newKey: any) => {
    const keystore = chainConfig.contracts.l1Keystore

    const params = {
      guardianDetails: {
        guardians: recoveringGuardians,
        threshold: recoveringThreshold,
        salt: ethers.ZeroHash
      },
      slot: recoveringSlot,
      slotInitInfo: recoveringSlotInitInfo,
      keystore,
      newKey
    }

    const result = await api.guardian.createRecoverRecord(params)
    const recoveryRecordID = result.data.recoveryRecordID
    setRecoverRecordId(recoveryRecordID)
  }

  const handleNext = async (values: any) => {
    const { password } = values

    try {
      setLoaing(true)
      console.log('loading s', password)
      let newKey = await keystore.createNewAddress(false);
      newKey = ethers.zeroPadValue(newKey, 32)
      console.log('newKey', newKey)
      setNewKey(newKey)
      setRecoverRecordId(null)

      console.log('recoveringSlot', recoveringSlot)
      console.log('recoveringSlotInitInfo', recoveringSlotInitInfo)
      if (recoveringSlot && recoveringSlotInitInfo) {
        await createRecoverRecord(newKey)
        dispatch({
          type: StepActionTypeEn.JumpToTargetStep,
          payload: RecoverStepEn.GuardiansChecking
        });
      }

      setLoaing(false)
    } catch (e: any) {
      setLoaing(false)
      toast({
        title: e.message,
        status: "error",
      })
    }
  };

  return (
    <Box width="350px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingBottom="20px">
      <Box marginBottom="12px" paddingRight="24px">
        <Steps backgroundColor="#1E1E1E" foregroundColor="white" count={4} activeIndex={1} marginTop="24px" onStepChange={onStepChange} showBackButton />
      </Box>
      <Heading1>
        Reset wallet password
      </Heading1>
      <Box marginBottom="0.75em">
        <TextBody textAlign="center" maxWidth="500px">
          Please set a new password to begin recovery
        </TextBody>
      </Box>
      <PasswordForm onSubmit={handleNext} loading={loading} />
    </Box>
  );
}
