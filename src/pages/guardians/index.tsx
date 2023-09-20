import { GuardiansStepEn, StepContextProvider, useStepContext } from "@/context/StepContext";
import React, { ReactNode, useMemo } from "react";
import { EnHandleMode } from '@/lib/type'
import FullscreenContainer from "@/components/FullscreenContainer";
import EditGuardians from "@/pages/Guardians/EditGuardians";
import SaveGuardians from "@/pages/Guardians/SaveGuardians";

type StepNodeInfo = {
  title: string;
  element: ReactNode;
  hint?: ReactNode;
};

const StepComponent = () => {
  const stepNodeMap: Record<number, StepNodeInfo> = useMemo(() => {
    return {
      [GuardiansStepEn.Edit]: {
        title: "Get Started",
        element: <EditGuardians />,
      },
      [GuardiansStepEn.Save]: {
        title: "Get Started",
        element: <SaveGuardians />,
      }
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

export default function EditGuardiansPage() {
  return (
    <FullscreenContainer>
      <StepContextProvider>
        <StepComponent />
      </StepContextProvider>
    </FullscreenContainer>
  );
}
