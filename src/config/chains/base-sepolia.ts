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
  cardBg: 'radial-gradient(52.03% 100.00% at 100.00% 100.00%, #73DDFF 0%, #E2FC89 100%)',
  cardBgUnactivated: 'radial-gradient(52.03% 100.00% at 100.00% 100.00%, #73DDFF 0%, #D7D7D7 100%)',
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
  addressPrefix: 'basesep:',
  support1559: true,
  paymasterTokens: [
  ],
  contracts: {
    soulWalletFactory: import.meta.env.VITE_SoulwalletFactory,
    defaultCallbackHandler: import.meta.env.VITE_DefaultCallbackHandler,
    entryPoint: import.meta.env.VITE_EntryPoint,
    paymaster: import.meta.env.VITE_Paymaster,
    defaultValidator: import.meta.env.VITE_SoulWalletDefaultValidator,
  },
};
