import { useState } from 'react';
import Header from '@/components/Header';

import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
// import Operations from './comp/Operations';
// import ActivateHint from './comp/ActivateHint';
// import SetGuardianHint from './comp/SetGuardianHint';
import PassKeyList from '@/components/web/PassKeyList';
import Tokens from './comp/Tokens';
import Transactions from './comp/Transactions';
import Balance from './comp/Balance';
import AppContainer from '@/components/AppContainer';
// import Actions from './comp/Actions';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
// import { useGuardianStore } from '@/store/guardian';
import DappList from '@/components/DappList';
import TransferAssets from '@/components/TransferAssets';
import { useCredentialStore } from '@/store/credential';
import Footer from '@/components/Footer';

export default function Wallet() {
  const { selectedAddress, getIsActivated } = useAddressStore();
  const { selectedChainId } = useChainStore();
  const { credentials, changeCredentialName } = useCredentialStore();
  // const { guardians } = useGuardianStore();
  // const isActivated = getIsActivated(selectedAddress, selectedChainId);
  // const [skipSet, setSkipSet] = useState(false);

  // const setPassKeyName = ({ id, name }: any) => {
  //   changeCredentialName(id, name);
  // };

  // const showSetGuardian =
  //   isActivated &&
  //   guardians.length === 0 &&
  //   (!storage.getItem('skipSet') || storage.getItem('skipSet') !== 'true') &&
  //   !skipSet;

  return (
    <Box color="#000">
      <Header />
      <AppContainer minH="calc(100vh - 100px)">
        <Grid templateColumns={'repeat(3, 1fr)'} gap="30px" mb="12">
          <Box flex="1">
            <Balance />
          </Box>
          <Box flex="1">
            <Tokens />
          </Box>
          <Box flex="1">
            <Transactions />
          </Box>
        </Grid>
        <DappList />
        <Footer />
        {/* {!isActivated ? <ActivateHint /> : <Actions showSetGuardian={showSetGuardian && !skipSet} />}
        {showSetGuardian && !skipSet && <SetGuardianHint onSkip={() => setSkipSet(true)} />}
        <Operations /> */}
      </AppContainer>
    </Box>
  );
}
