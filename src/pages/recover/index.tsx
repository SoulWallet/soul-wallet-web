import {
  RecoverStepEn,
  StepContextProvider,
  useStepContext,
  StepActionTypeEn,
  useStepDispatchContext,
} from "@/context/StepContext";
import React, { useEffect, useMemo, useState } from "react";
import FullscreenContainer from "@/components/FullscreenContainer";
import { RecoveryContextProvider } from "@/context/RecoveryContext";
import {EnHandleMode} from '@/lib/type'
import EnterWalletAddress from "@/pages/Recover/EnterWalletAddress";
import SetWalletPassword from "@/pages/Recover/SetWalletPassword";
import SignatureRequest from "@/pages/Recover/SignatureRequest";
import UploadGuardians from "@/pages/Recover/UploadGuardians";
import { useGuardianStore } from "@/store/guardian";
import useBrowser from "@/hooks/useBrowser";

type StepNodeInfo = {
  title: string;
  element: JSX.Element;
};

const StepComponent = () => {
  const dispatch = useStepDispatchContext();

  const [walletAddress, setWalletAddress] = useState("");
  const [payToken, setPayToken] = useState("");
  const [recoverStatus, setRecoverStatus] = useState("n/m");
  const { recoverRecordId, newKey } = useGuardianStore();
  const { navigate } = useBrowser()

  const onStepChange = (i: any) => {
    if (i === -1) {
      navigate('launch')
    } else {
      dispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: i,
      });
    }
  }

  const onRecoverSubmit = async (wAddress: string, pToken: string) => {
    setWalletAddress(wAddress);
    localStorage.setItem("walletAddress", wAddress);
    setPayToken(pToken);
  };

  const stepNodeMap: Record<number, StepNodeInfo> = useMemo(() => {
    return {
      [RecoverStepEn.Start]: {
        title: "Recover your wallet",
        element: <EnterWalletAddress onStepChange={onStepChange} onSubmit={onRecoverSubmit} />,
      },
      [RecoverStepEn.UploadGuardians]: {
        title: "Enter Guardian Address",
        element: <UploadGuardians onStepChange={onStepChange} />,
      },
      [RecoverStepEn.ResetPassword]: {
        title: "Set New Password",
        element: <SetWalletPassword onStepChange={onStepChange} />,
      },
      [RecoverStepEn.GuardiansChecking]: {
        title: "Enter Guardian Address",
        element: <SignatureRequest />,
      },
    };
  }, [walletAddress, payToken, recoverStatus]);

  const {
    step: { current },
  } = useStepContext();

  useEffect(() => {
    if (recoverRecordId && newKey) {
      dispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: RecoverStepEn.GuardiansChecking,
      });
    }
  }, []);

  return (
    <div>{stepNodeMap[current].element}</div>
  );
};

export default function RecoverPage() {
  return (
    <FullscreenContainer>
      <RecoveryContextProvider>
        <StepContextProvider>
          <StepComponent />
        </StepContextProvider>
      </RecoveryContextProvider>
    </FullscreenContainer>
  );
}
