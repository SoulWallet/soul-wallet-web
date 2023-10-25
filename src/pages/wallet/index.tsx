import Header from '@/components/Header';
import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import Tokens from './comp/Tokens';
import Activity from './comp/Activity';
import Balance from './comp/Balance';
import Feedback from './comp/Feedback';
import AppContainer from '@/components/AppContainer';
import DappList from '@/components/DappList';
import Footer from '@/components/Footer';
import { L1KeyStore } from '@soulwallet/sdk';

export default function Wallet() {
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
          <GridItem>
            <Balance />
          </GridItem>
          <GridItem>
            <Tokens />
          </GridItem>
          <GridItem>
            <Activity />
          </GridItem>
          <GridItem colSpan={2}>
            <DappList />
          </GridItem>
          <GridItem>
            <Feedback />
          </GridItem>
        </Grid>
        {/* <Grid templateColumns={'2fr 1fr'} gap="36px">
         
        </Grid> */}
        <Footer />
      </AppContainer>
    </Box>
  );
}
