/**
 * Arbitrum Sepolia
 */

import IconOpFaded from '@/assets/chains/op-faded.svg';
import IconOpSquare from '@/assets/chains/op-square.svg';

const chainId = 11155420;

export default {
  icon: IconOpSquare,
  iconFaded: IconOpFaded,
  iconSquare: IconOpSquare,
  cardBg: 'radial-gradient(52.03% 100% at 100% 100%, #FF9595 0%, #E2FC89 100%)',
  cardBgUnactivated: 'radial-gradient(52.03% 100% at 100% 100%, #FF9595 0%, #D7D7D7 100%)',
  provider: `https://sepolia.optimism.io`,
  scanUrl: 'https://sepolia-optimism.etherscan.io',
  scanName: 'Etherscan',
  bundlerUrl: `https://api-dev.soulwallet.io/bundler/op-sepolia/rpc`,
  maxCostMultiplier: 120,
  chainId,
  chainIdHex: `0x${(chainId).toString(16)}`,
  defaultMaxFee: '0.135',
  defaultMaxPriorityFee: '0',
  chainName: 'Optimism Sepolia',
  chainToken: 'ETH',
  addressPrefix: 'opsep:',
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
