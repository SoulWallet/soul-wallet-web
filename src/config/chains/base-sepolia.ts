/**
 * Arbitrum Sepolia
 */

import IconArbFaded from '@/assets/chains/arb-faded.svg';
import IconArbSquare from '@/assets/chains/arb-square.svg';

const chainId = 84532;

export default {
  icon: IconArbSquare,
  iconFaded: IconArbFaded,
  iconSquare: IconArbSquare,
  provider: `https://base-sepolia-rpc.publicnode.com`,
  scanUrl: 'https://base-sepolia.blockscout.com',
  scanName: 'Arbiscan',
  bundlerUrl: `https://api-dev.soulwallet.io/appapi/bundler/base-sepolia/rpc`,
  maxCostMultiplier: 120,
  chainId,
  chainIdHex: `0x${chainId.toString(16)}`,
  defaultMaxFee: '0.135',
  defaultMaxPriorityFee: '0',
  chainName: 'Base Sepolia',
  chainToken: 'ETH',
  contracts: {
    soulWalletFactory: import.meta.env.VITE_SoulwalletFactory,
    defaultCallbackHandler: import.meta.env.VITE_DefaultCallbackHandler,
    entryPoint: import.meta.env.VITE_EntryPoint,
    defaultValidator: import.meta.env.VITE_SoulWalletDefaultValidator,
  },
};
