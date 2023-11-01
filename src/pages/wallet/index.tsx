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
import { AccountSelectFull } from '@/components/AccountSelect';

export default function Wallet() {
  return (
    <Box color="#000">
      <Header />
      <AppContainer minH="calc(100vh - 100px)">
        <Grid templateColumns={{base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)'}} gap={{base: 4, lg: 6}} mb="12">
          <GridItem>
            <AccountSelectFull display={{base: "flex", lg: "none"}} w="100%" />
            <Balance />
          </GridItem>
          <GridItem>
            <Tokens />
          </GridItem>
          <GridItem>
            <Activity />
          </GridItem>
          <GridItem colSpan={{base: 1, lg: 2}}>
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
