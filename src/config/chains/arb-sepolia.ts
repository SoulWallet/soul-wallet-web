/**
 * Arbitrum Sepolia
 */

import IconArbFaded from '@/assets/chains/arb-faded.svg';
import IconArbSquare from '@/assets/chains/arb-square.svg';
import { keystoreContracts } from './common';

const chainId = 421614;

export default {
  icon: IconArbSquare,
  iconFaded: IconArbFaded,
  iconSquare: IconArbSquare,
  cardBg: 'radial-gradient(52.03% 100.00% at 100.00% 100.00%, #73DDFF 0%, #E2FC89 100%)',
  cardBgUnactivated: 'radial-gradient(52.03% 100.00% at 100.00% 100.00%, #73DDFF 0%, #D7D7D7 100%)',
  provider: `https://arb-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY_ARB_SEPOLIA}`,
  l1Provider: `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`,
  scanUrl: 'https://sepolia.arbiscan.io',
  scanName: 'Arbiscan',
  bundlerUrl: `https://api-dev.soulwallet.io/bundler/arb-sepolia/rpc`,
  maxCostMultiplier: 120,
  chainId,
  chainIdHex: `0x${chainId.toString(16)}`,
  defaultMaxFee: '0.135',
  defaultMaxPriorityFee: '0',
  chainName: 'Arbitrum Sepolia',
  chainToken: 'ETH',
  addressPrefix: 'arb-sep:',
  support1559: true,
  paymasterTokens: [
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
