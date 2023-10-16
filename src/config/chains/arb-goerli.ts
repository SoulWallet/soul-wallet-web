/**
 * Arbitrum Goerli
 */

import IconArb from '@/assets/chains/arb.svg';
import IconArbFaded from '@/assets/chains/arb-faded.svg';

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
    l1Keystore: '0x20c466bb02603fa5585cd2a669bdaea92ee145a7',
    keyStoreModuleProxy: '0xed078ad51f9b6efb73ae08892d3e173c46231cd2',
    soulWalletFactory: '0x2090677ac3a678721463c8b758861a5ec44ea76f',
    defaultCallbackHandler: '0xa39defc0786f940862359f03e1aeb31a6d998e64',
    securityControlModule: '0x9848dfe5c26929390f798c2a34871f1232f93781',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    paymaster: '0xee4d0d07318dd076d588bccdf2383275b499f29f',
  },
};
