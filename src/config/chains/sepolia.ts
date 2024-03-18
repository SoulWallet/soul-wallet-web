/**
 * Goerli
 */

import IconEthFaded from '@/assets/chains/eth-faded.svg';
import IconEthSquare from '@/assets/chains/eth-square.svg';

const chainId = 11155111

export default {
  icon: IconEthSquare,
  iconFaded: IconEthFaded,
  iconSquare: IconEthSquare,
  cardBg: 'radial-gradient(51.95% 100.00% at 100.00% 100.00%, #A3B2FF 0%, #E2FC89 100%)',
  cardBgUnactivated: 'radial-gradient(52.03% 100.00% at 100.00% 100.00%, #A3B2FF 0%, #D7D7D7 100%)',
  provider: `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`,
  l1Provider: `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`,
  scanUrl: 'https://sepolia.etherscan.io',
  scanName: 'Etherscan',
  bundlerUrl: `https://api-dev.soulwallet.io/bundler/eth-sepolia/rpc`,
  maxCostMultiplier: 110,
  chainId,
  chainIdHex: `0x${(chainId).toString(16)}`,
  defaultMaxFee: '1700000000',
  defaultMaxPriorityFee: '1500000000',
  chainName: 'Sepolia',
  chainToken: 'ETH',
  addressPrefix: 'sep:',
  // fileName: "goerli",
  support1559: true,
  paymasterTokens: [
    // test u
    '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
  ],
  contracts: {
    soulWalletFactory: import.meta.env.VITE_SoulwalletFactory,
    defaultCallbackHandler: import.meta.env.VITE_DefaultCallbackHandler,
    entryPoint: import.meta.env.VITE_EntryPoint,
    paymaster: import.meta.env.VITE_Paymaster,
    defaultValidator: import.meta.env.VITE_SoulWalletDefaultValidator,
  },
};
