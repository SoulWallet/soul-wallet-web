import IconTwitter from '@/assets/socials/twitter.svg';
import IconTelegram from '@/assets/socials/telegram.svg';
import IconGithub from '@/assets/socials/github.svg';
// import IconLinkedin from '@/assets/socials/linkedin.svg';
import IconTwitterActivated from '@/assets/socials/twitter-activated.svg';
import IconTelegramActivated from '@/assets/socials/telegram-activated.svg';
import IconGithubActivated from '@/assets/socials/github-activated.svg';
// import IconLinkedinActivated from '@/assets/socials/linkedin-activated.svg';
// import IconOp from '@/assets/chains/op.svg';
// import IconArb from '@/assets/chains/arb.svg';
// import IconEth from '@/assets/chains/eth.svg';
import IconEthSquare from '@/assets/chains/eth-square.svg';
import IconOpSquare from '@/assets/chains/op-square.svg';
import IconArbSquare from '@/assets/chains/arb-square.svg';
import ArbConfig from './chains/arb-sepolia';
import OpConfig from './chains/op-sepolia';
import BaseConfig from './chains/sepolia';

export const chainIdMapping = {
  1: 'ETH Mainnet',
  5: 'Goerli',
  42: 'KOVAN',
  56: 'BSC Mainnet',
  128: 'HECO Mainnet',
  97: 'BSC Testnet',
  420: 'Optimism Goerli',
  42161: 'Arbitrum',
  11155111: 'Sepolia',
  11155420: 'Optimism Sepolia',
  421614: 'Arbitrum Sepolia',
  421613: 'Arbitrum Goerli',
};

// get all chainId mapping, especially for switch chain.
export const chainMapping = {
  '0x1': {
    icon: IconEthSquare,
    name: 'Ethereum',
  },
  '0x5': {
    icon: IconEthSquare,
    name: 'Goerli',
  },
  '0xaa36a7': {
    icon: IconEthSquare,
    name: 'Sepolia',
  },
  '0xa': {
    icon: IconOpSquare,
    name: 'Optimism',
  },
  '0x1a4': {
    icon: IconOpSquare,
    name: 'Optimism Goerli',
  },
  '0xaa37dc': {
    icon: IconOpSquare,
    name: 'Optimism Sepolia',
  },
  '0xa4b1': {
    icon: IconArbSquare,
    name: 'Arbitrum',
  },
  '0x66eed': {
    icon: IconArbSquare,
    name: 'Arbitrum Goerli',
  },
  '0x66eee': {
    icon: IconArbSquare,
    name: 'Arbitrum Sepolia',
  },
};
// This is an important store switch which will clear all users' data
export const storeVersion = '16';

export const defaultGuardianSafePeriod = 1;

// height of header
export const headerHeight = 60;

export const bundlerErrMapping: { [key: string]: string } = {
  'AA23 reverted (or OOG)': 'Operation Failed: Check signature or verificationGasLimit too small.',
  "AA21 didn't pay prefund": 'Not enough ETH balance in your wallet',
  'AA31 paymaster deposit too low': 'Insufficient Paymaster Funds',
  'AA33 reverted (or OOG)': 'Paymaster error or verificationGasLimit too small.',
  'AA10 sender already constructed': 'Wallet Already Exists',
};

export const ensContractAddress = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85';

export const supportedEoas = ['injected', 'walletConnect'];

export default {
  homepage: 'https://www.soulwallet.io',
  faviconUrl: 'https://www.google.com/s2/favicons?domain=',
  socials: [
    {
      icon: IconTwitter,
      iconActivated: IconTwitterActivated,
      link: 'https://twitter.com/soulwallet_eth',
    },
    {
      icon: IconTelegram,
      iconActivated: IconTelegramActivated,
      link: 'https://t.me/+XFUHusXFdTYyODQ9',
    },
    {
      icon: IconGithub,
      iconActivated: IconGithubActivated,
      link: 'https://github.com/SoulWallet',
    },
    // {
    //   icon: IconLinkedin,
    //   iconActivated: IconLinkedinActivated,
    //   link: 'https://www.linkedin.com/company/soul-wallet/',
    // },
  ],
  magicValue: '0x1626ba7e',
  backendURL: `${import.meta.env.VITE_BACKEND_URL}/appapi`,
  soulScanURL: `${import.meta.env.VITE_SCAN_URL}/opapi`,
  officialWebUrl: import.meta.env.VITE_OFFICIAL_WEB_URL,
  /* @vite-ignore */
  chainList: [ArbConfig, OpConfig, BaseConfig],
};
