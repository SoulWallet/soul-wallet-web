/**
 * Goerli
 */

import IconEth from '@/assets/chains/eth.svg';
import IconEthFaded from '@/assets/chains/eth-faded.svg';

export default {
  icon: IconEth,
  iconFaded: IconEthFaded,
  cardBg: 'radial-gradient(51.95% 100.00% at 100.00% 100.00%, #A3B2FF 0%, #E2FC89 100%)',
  cardBgUnactivated: 'radial-gradient(52.03% 100.00% at 100.00% 100.00%, #A3B2FF 0%, #D7D7D7 100%)',
  provider: `https://goerli.infura.io/v3/36edb4e805524ba696b5b83b3e23ad18`,
  l1Provider: `https://goerli.infura.io/v3/36edb4e805524ba696b5b83b3e23ad18`,
  scanUrl: 'https://goerli.etherscan.io',
  bundlerUrl: 'https://api-dev.soulwallet.io/bundler/eth-goerli/rpc',
  maxCostMultiplier: 110,
  chainId: 5,
  chainIdHex: `0x${(5).toString(16)}`,
  defaultMaxFee: '1700000000',
  defaultMaxPriorityFee: '1500000000',
  chainName: 'Goerli',
  chainToken: 'ETH',
  addressPrefix: 'gor:',
  // fileName: "goerli",
  support1559: true,
  recovering: false,
  paymasterTokens: [
    // test u
    '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  ],
  contracts: {
    l1Keystore: '0x76a43ef7cc3b49736951759494d2aee8cae1cdec',
    keyStoreModuleProxy: '0x59b84bfaaa906a84152ded63d964cff913308921',
    soulWalletFactory: '0xace0d45d3c2a2cb1b6a799bb7442141add3f3914',
    defaultCallbackHandler: '0xd76ad4681b243633b564cd4d0928bc98affd5e08',
    securityControlModule: '0x09a7151602cc0b466fd00f3a16ddcaec5534bfb0',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    paymaster: '0xee4d0d07318dd076d588bccdf2383275b499f29f',
  },
};
