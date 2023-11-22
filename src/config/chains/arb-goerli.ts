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
  provider: `https://goerli-rollup.arbitrum.io/rpc`,
  l1Provider: `https://goerli.infura.io/v3/36edb4e805524ba696b5b83b3e23ad18`,
  scanUrl: 'https://testnet.arbiscan.io/',
  scanName: 'Arbiscan',
  bundlerUrl: 'https://api-dev.soulwallet.io/bundler/arb-goerli/rpc',
  // bundlerUrl: 'https://arb-goerli.g.alchemy.com/v2/M3uND7od01QVjQN9Px8TCxnMcPRgWTCH',
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
    '0x8FB1E3fC51F3b789dED7557E680551d93Ea9d892',
  ],
  contracts: {
    ...keystoreContracts,
    soulWalletFactory: import.meta.env.VITE_SoulwalletFactory,
    defaultCallbackHandler: import.meta.env.VITE_DefaultCallbackHandler,
    securityControlModule: import.meta.env.VITE_SecurityControlModule,
    entryPoint: import.meta.env.VITE_EntryPoint,
    paymaster: import.meta.env.VITE_Paymaster,
  },
};
