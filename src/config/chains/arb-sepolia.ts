/**
 * Arbitrum Sepolia
 */

import IconArbFaded from '@/assets/chains/arb-faded.svg';
import IconArbSquare from '@/assets/chains/arb-square.svg';

const chainId = 421614;

export default {
  icon: IconArbSquare,
  iconFaded: IconArbFaded,
  iconSquare: IconArbSquare,
  provider: `https://arb-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY_ARB_SEPOLIA}`,
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
  contracts: {
    soulWalletFactory: import.meta.env.VITE_SoulwalletFactory,
    defaultCallbackHandler: import.meta.env.VITE_DefaultCallbackHandler,
    entryPoint: import.meta.env.VITE_EntryPoint,
    defaultValidator: import.meta.env.VITE_SoulWalletDefaultValidator,
  },
};
