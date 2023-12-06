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
  provider: `https://goerli.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`,
  l1Provider: `https://goerli.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`,
  scanUrl: 'https://goerli.etherscan.io',
  scanName: 'Etherscan',
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
    soulWalletFactory: import.meta.env.VITE_SoulwalletFactory,
    defaultCallbackHandler: import.meta.env.VITE_DefaultCallbackHandler,
    securityControlModule: import.meta.env.VITE_SecurityControlModule,
    entryPoint: import.meta.env.VITE_EntryPoint,
    paymaster: import.meta.env.VITE_Paymaster,
  },
};
