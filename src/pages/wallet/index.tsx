import { useState } from 'react';
import Header from '@/components/Header';
import AccountCard from '@/components/AccountCard';
import { Box } from '@chakra-ui/react';
import Operations from './comp/Operations';
import ActivateHint from './comp/ActivateHint';
import SetGuardianHint from './comp/SetGuardianHint';
import AppContainer from '@/components/AppContainer';
import Actions from './comp/Actions';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import { useGuardianStore } from '@/store/guardian';
import storage from '@/lib/storage';

export default function Wallet() {
  const { selectedAddress, getIsActivated } = useAddressStore();
  const { selectedChainId } = useChainStore();
  const { guardians } = useGuardianStore();
  const isActivated = getIsActivated(selectedAddress, selectedChainId);
  const [skipSet, setSkipSet] = useState(false);

  const showSetGuardian =
    isActivated &&
    guardians.length === 0 &&
    (!storage.getItem('skipSet') || storage.getItem('skipSet') !== 'true') &&
    !skipSet;

  return (
    <Box>
      <Header />
      <AppContainer>
        <AccountCard />
        {!isActivated ? <ActivateHint /> : <Actions showSetGuardian={showSetGuardian && !skipSet} />}
        {showSetGuardian && !skipSet && <SetGuardianHint onSkip={() => setSkipSet(true)} />}
        <Operations />
      </AppContainer>
    </Box>
  );
}
