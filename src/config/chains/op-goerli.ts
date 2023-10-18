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
    soulWalletFactory: '0xc61be1f9ebb4fc58ca4c6c8ef8ebb7d18fbf2633',
    defaultCallbackHandler: '0x3ffdcb8757ae93775fd076f13d2f185d6eb0d1a3',
    securityControlModule: '0x60c95b086a1403dec8aeb882c8aeff58853ff639',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    paymaster: '0xee4d0d07318dd076d588bccdf2383275b499f29f',
  },
};
