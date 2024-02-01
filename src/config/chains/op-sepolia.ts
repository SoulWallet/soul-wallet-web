/**
 * Arbitrum Sepolia
 */

import IconOp from '@/assets/chains/op.svg';
import IconOpFaded from '@/assets/chains/op-faded.svg';
import IconOpSquare from '@/assets/chains/op-square.svg';

import { keystoreContracts } from './common';

const chainId = 11155420;

export default {
  icon: IconOp,
  iconFaded: IconOpFaded,
  iconSquare: IconOpSquare,
  cardBg: 'radial-gradient(52.03% 100% at 100% 100%, #FF9595 0%, #E2FC89 100%)',
  cardBgUnactivated: 'radial-gradient(52.03% 100% at 100% 100%, #FF9595 0%, #D7D7D7 100%)',
  provider: `https://sepolia.optimism.io`,
  l1Provider: `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`,
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
  recovering: false,
  paymasterTokens: [
    // test u
    '0x7E07E15D2a87A24492740D16f5bdF58c16db0c4E',
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
