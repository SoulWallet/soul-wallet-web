/**
 * Arbitrum Goerli
 */

import IconArb from '@/assets/chains/arb.svg';
import IconArbFaded from '@/assets/chains/arb-faded.svg';
import { keystoreContracts } from './common';

export default {
  icon: IconArb,
  iconFaded: IconArbFaded,
  cardBg: 'radial-gradient(52.03% 100.00% at 100.00% 100.00%, #73DDFF 0%, #E2FC89 100%)',
  cardBgUnactivated: 'radial-gradient(52.03% 100.00% at 100.00% 100.00%, #73DDFF 0%, #D7D7D7 100%)',
  provider: `https://arbitrum-goerli.publicnode.com`,
  l1Provider: `https://goerli.infura.io/v3/36edb4e805524ba696b5b83b3e23ad18`,
  scanUrl: 'https://testnet.arbiscan.io/',
  bundlerUrl: 'https://api-dev.soulwallet.io/bundler/arb-goerli/rpc',
  maxCostMultiplier: 120,
  chainId: 421613,
  chainIdHex: `0x${(421613).toString(16)}`,
  defaultMaxFee: '0.135',
  defaultMaxPriorityFee: '0',
  chainName: 'Arbitrum Goerli',
  chainToken: 'ETH',
  addressPrefix: 'arb:',
  // fileName: "arb-goerli",
  support1559: true,
  recovering: false,
  paymasterTokens: [
    // test u
    '0xfd064A18f3BF249cf1f87FC203E90D8f650f2d63',
  ],
  contracts: {
    ...keystoreContracts,
    soulWalletFactory: '0xc61be1f9ebb4fc58ca4c6c8ef8ebb7d18fbf2633',
    defaultCallbackHandler: '0x3ffdcb8757ae93775fd076f13d2f185d6eb0d1a3',
    securityControlModule: '0x60c95b086a1403dec8aeb882c8aeff58853ff639',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    paymaster: '0xee4d0d07318dd076d588bccdf2383275b499f29f',
  },
};
