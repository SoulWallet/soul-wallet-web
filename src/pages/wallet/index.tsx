import { useState } from 'react';
import Header from '@/components/Header';
import AccountCard from '@/components/AccountCard';
import { Box, Flex } from '@chakra-ui/react';
import Operations from './comp/Operations';
import ActivateHint from './comp/ActivateHint';
import SetGuardianHint from './comp/SetGuardianHint';
import PassKeyList from '@/components/web/PassKeyList';
import Tokens from '@/components/Tokens';
import AppContainer from '@/components/AppContainer';
import Actions from './comp/Actions';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import { useGuardianStore } from '@/store/guardian';
import DappList from '@/components/DappList';
import Transactions from '@/components/Transactions';
import TransferAssets from '@/components/TransferAssets';
import { useCredentialStore } from '@/store/credential';

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
    <Box color="#1e1e1e">
      <Header />
      <AppContainer minH="calc(100vh - 100px)">
        <Flex gap="30px">
          <Box flex="1">
            <AccountCard />
            <Tokens />
          </Box>
          <Box flex="1">
            <PassKeyList titleStyle={{fontWeight: "800", fontSize: "18px"}} passKeys={credentials} setPassKeyName={changeCredentialName} />
            <Transactions />
          </Box>
          <Box w="368px">
            <TransferAssets />
          </Box>
        </Flex>
        <DappList />
        {/* {!isActivated ? <ActivateHint /> : <Actions showSetGuardian={showSetGuardian && !skipSet} />}
        {showSetGuardian && !skipSet && <SetGuardianHint onSkip={() => setSkipSet(true)} />}
        <Operations /> */}
      </AppContainer>
    </Box>
  );
}
