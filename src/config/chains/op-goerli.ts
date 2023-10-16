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
    '0xe05606174bac4A6364B31bd0eCA4bf4dD368f8C6',
  ],
  contracts: {
    ...keystoreContracts,
    soulWalletFactory: '0xcf73a2848c1de2da12e2dd2d3b7a86bd700c68c1',
    defaultCallbackHandler: '0xe8753f3a52e76203b25822f4d83b1647e09e81cb',
    securityControlModule: '0x480238a37ada43feaa686416e1309eb1078c8e62',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    paymaster: '0xee4d0d07318dd076d588bccdf2383275b499f29f',
  },
};
