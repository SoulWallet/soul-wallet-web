import { useEffect, useState } from 'react';
import useKeyring from '@/hooks/useKeyring';
import { CreateStepEn, StepActionTypeEn, useStepDispatchContext } from '@/context/StepContext';
import WalletCard from '@/components/web/WalletCard';
import { Box, useToast } from '@chakra-ui/react';
import PasswordStrengthBar from '@/components/web/PasswordStrengthBar';
import Button from '@/components/web/Button';
import TextButton from '@/components/web/TextButton';
import FormInput from '@/components/web/Form/FormInput';
import useForm from '@/hooks/useForm';
import useWalletContext from '@/context/hooks/useWalletContext';
import PasswordForm from '@/components/web/PasswordForm';
import ArrowLeftIcon from '@/components/Icons/ArrowLeft';
import useBrowser from '@/hooks/useBrowser';
import Steps from '@/components/web/Steps';

export default function SetPassword({ setPassword, onStepChange }: any) {
  const dispatch = useStepDispatchContext();
  const keystore = useKeyring();
  const { getAccount } = useWalletContext();
  const toast = useToast();
  const [loading, setLoaing] = useState(false);
  const { navigate } = useBrowser();

  const handleNext = async (values: any) => {
    const { password } = values;

    if (password) {
      setPassword(password);
      dispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: CreateStepEn.SetGuardians,
      });
    }
  };

  const goBack = () => {
    navigate('launch');
  };

  return (
    <Box width="428px" marginTop="1em" display="flex" flexDirection="column" paddingBottom="20px">
      <WalletCard
        statusText="SETTING UP..."
        steps={
          <Steps
            backgroundColor="#29510A"
            foregroundColor="#E2FC89"
            count={3}
            activeIndex={0}
            marginTop="24px"
            onStepChange={onStepChange}
          />
        }
      />
      <TextButton
        color="#1E1E1E"
        fontSize="16px"
        fontWeight="800"
        width="57px"
        padding="0"
        alignItems="center"
        justifyContent="center"
        onClick={goBack}
      >
        <ArrowLeftIcon />
        <Box marginLeft="2px">Back</Box>
      </TextButton>
      <PasswordForm onSubmit={handleNext} loading={loading} />
    </Box>
  );
}
