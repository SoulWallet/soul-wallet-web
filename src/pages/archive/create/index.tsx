import { CreateStepEn, StepContextProvider, useStepContext, useStepDispatchContext, StepActionTypeEn } from "@/context/StepContext";
import { ReactNode, useMemo, useState, useRef } from "react";
import {EnHandleMode} from '@/lib/type'
import FullscreenContainer from "@/components/FullscreenContainer";
import SetPassword from "@/pages/Create/SetPassword";
import SetGuardians from "@/pages/Create/SetGuardians";
import SaveGuardians from "@/pages/Create/SaveGuardians";
import SetDefaultWallet from "@/pages/Create/SetDefaultWallet";
import SetWalletSuccess from "@/pages/Create/SetWalletSuccess";

type StepNodeInfo = {
  title: string;
  element: ReactNode;
  hint?: ReactNode;
};

const StepComponent = () => {
  const dispatch = useStepDispatchContext();
  const passwordRef = useRef('')

  const onStepChange = (i: any) => {
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: i,
    });
  }

  const setPassword = (password: any) => {
    passwordRef.current = password
  }

  const getPassword = () => {
    return passwordRef.current
  }
  console.log('password 222', passwordRef)

  const stepNodeMap: Record<number, StepNodeInfo> = useMemo(() => {
    return {
      // [CreateStepEn.CreatePWD]: {
      //   title: "Get Started",
      //   element: <SetPassword onStepChange={onStepChange} setPassword={setPassword} />,
      // },
      [CreateStepEn.SetGuardians]: {
        title: "Set up Guardians",
        element: <SetGuardians onStepChange={onStepChange} getPassword={getPassword} />
      },
      [CreateStepEn.SaveGuardian]: {
        title: "Save Guardian List",
        element: <SaveGuardians onStepChange={onStepChange} getPassword={getPassword} />,
      },
      // [CreateStepEn.SetSoulWalletAsDefault]: {
      //   title: "Set as default plugin wallet",
      //   element: <SetDefaultWallet />,
      // },
      [CreateStepEn.Completed]: {
        title: "Congratulation, your Soul Wallet is created!",
        element: (<SetWalletSuccess mode={EnHandleMode.Create} />) as any,
      },
    };
  }, []);

  const {
    step: { current },
  } = useStepContext();

  return (
    <div>
      {stepNodeMap[current].element}
    </div>
  );
};

export default function CreatePage() {
  return (
    <FullscreenContainer>
      <StepContextProvider>
        <StepComponent />
      </StepContextProvider>
    </FullscreenContainer>
  );
}
