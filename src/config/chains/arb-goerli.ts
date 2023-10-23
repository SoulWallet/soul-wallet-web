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
    soulWalletFactory: '0x84e349541369e988685e253ba77c822550eda7ef',
    defaultCallbackHandler: '0xdef24914185b8205f38bcaf4404817735495cbdc',
    securityControlModule: '0x2e01dbcf407b499b0f6a0de7f5d95afad360dd70',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    paymaster: '0xee4d0d07318dd076d588bccdf2383275b499f29f',
  },
};
