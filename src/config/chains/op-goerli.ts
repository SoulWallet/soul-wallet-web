/**
 * Arbitrum Goerli
 */

import IconOp from '@/assets/chains/op.svg';
import IconOpFaded from '@/assets/chains/op-faded.svg';

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
    l1Keystore: '0x49e9a08bee0ec9bdc61c7e1d35e20027acf3d642',
    keyStoreModuleProxy: '0x9c912981ef0e19bd718ed45f91f7c10873f84763',
    soulWalletFactory: '0xd71b96d8db1ead41dcafd89cbb62d04cbbcec60e',
    defaultCallbackHandler: '0xabe5c51c4740cf807f5f1d4367be4c221a6d8595',
    securityControlModule: '0xdda2c26e49cfbca5787d22de3657ae7979187b6e',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    paymaster: '0xee4d0d07318dd076d588bccdf2383275b499f29f',
  },
};
