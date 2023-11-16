/**
 * Arbitrum Goerli
 */

import IconOp from '@/assets/chains/op.svg';
import IconOpFaded from '@/assets/chains/op-faded.svg';
import { keystoreContracts } from './common';

export default {
  icon: IconOp,
  iconFaded: IconOpFaded,
  cardBg: 'radial-gradient(52.03% 100% at 100% 100%, #FF9595 0%, #E2FC89 100%)',
  cardBgUnactivated: 'radial-gradient(52.03% 100% at 100% 100%, #FF9595 0%, #D7D7D7 100%)',
  provider: `https://optimism-goerli.publicnode.com`,
  l1Provider: `https://goerli.infura.io/v3/36edb4e805524ba696b5b83b3e23ad18`,
  scanUrl: 'https://goerli-optimism.etherscan.io/',
  bundlerUrl: 'https://api-dev.soulwallet.io/bundler/op-goerli/rpc',
  maxCostMultiplier: 120,
  chainId: 420,
  chainIdHex: `0x${(420).toString(16)}`,
  defaultMaxFee: '0.135',
  defaultMaxPriorityFee: '0',
  chainName: 'Optimism Goerli',
  chainToken: 'ETH',
  addressPrefix: 'op:',
  // fileName: "arb-goerli",
  support1559: true,
  recovering: false,
  paymasterTokens: [
    // test u
    '0x7E07E15D2a87A24492740D16f5bdF58c16db0c4E',
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
