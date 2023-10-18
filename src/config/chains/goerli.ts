/**
 * Goerli
 */

import IconEth from '@/assets/chains/eth.svg';
import IconEthFaded from '@/assets/chains/eth-faded.svg';
import { keystoreContracts } from './common';

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
    ...keystoreContracts,
    soulWalletFactory: '0xc61be1f9ebb4fc58ca4c6c8ef8ebb7d18fbf2633',
    defaultCallbackHandler: '0x3ffdcb8757ae93775fd076f13d2f185d6eb0d1a3',
    securityControlModule: '0x60c95b086a1403dec8aeb882c8aeff58853ff639',
    entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
    paymaster: '0xee4d0d07318dd076d588bccdf2383275b499f29f',
  },
};
