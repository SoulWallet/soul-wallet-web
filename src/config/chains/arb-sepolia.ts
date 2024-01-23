/**
 * Arbitrum Sepolia
 */

import IconArb from '@/assets/chains/arb.svg';
import IconArbFaded from '@/assets/chains/arb-faded.svg';
import IconArbSquare from '@/assets/chains/arb-square.svg';
import { keystoreContracts } from './common';

const chainId = 421614

export default {
  icon: IconArb,
  iconFaded: IconArbFaded,
  iconSquare: IconArbSquare,
  cardBg: 'radial-gradient(52.03% 100.00% at 100.00% 100.00%, #73DDFF 0%, #E2FC89 100%)',
  cardBgUnactivated: 'radial-gradient(52.03% 100.00% at 100.00% 100.00%, #73DDFF 0%, #D7D7D7 100%)',
  provider: 'https://sepolia-rollup.arbitrum.io/rpc',
  l1Provider: `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`,
  scanUrl: 'https://sepolia.arbiscan.io',
  scanName: 'Arbiscan',
  bundlerUrl: `https://api-dev.soulwallet.io/bundler/arb-sepolia/rpc`,
  maxCostMultiplier: 120,
  chainId,
  chainIdHex: `0x${(chainId).toString(16)}`,
  defaultMaxFee: '0.135',
  defaultMaxPriorityFee: '0',
  chainName: 'Arbitrum Sepolia',
  chainToken: 'ETH',
  addressPrefix: 'arb:',
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
    defaultValidator: import.meta.env.VITE_SoulWalletDefaultValidator,
  },
};
