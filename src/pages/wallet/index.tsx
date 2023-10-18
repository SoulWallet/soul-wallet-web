import Header from '@/components/Header';
import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import Tokens from './comp/Tokens';
import History from './comp/History';
import Balance from './comp/Balance';
import AppContainer from '@/components/AppContainer';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import DappList from '@/components/DappList';
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
            <History />
          </Box>
        </Grid>
        <DappList />
        <Footer />
      </AppContainer>
    </Box>
  );
}
