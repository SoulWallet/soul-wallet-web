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
  provider: `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`,
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
  paymasterTokens: [
    // test u
    '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
  ],
  contracts: {
    soulWalletFactory: import.meta.env.VITE_SoulwalletFactory,
    defaultCallbackHandler: import.meta.env.VITE_DefaultCallbackHandler,
    entryPoint: import.meta.env.VITE_EntryPoint,
    defaultValidator: import.meta.env.VITE_SoulWalletDefaultValidator,
  },
};
