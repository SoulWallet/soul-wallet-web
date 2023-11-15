import IconTwitter from '@/assets/socials/twitter.svg';
import IconTelegram from '@/assets/socials/telegram.svg';
import IconGithub from '@/assets/socials/github.svg';
import IconTwitterActivated from '@/assets/socials/twitter-activated.svg';
import IconTelegramActivated from '@/assets/socials/telegram-activated.svg';
import IconGithubActivated from '@/assets/socials/github-activated.svg';
import IconOp from '@/assets/chains/op.svg';
import IconArb from '@/assets/chains/arb.svg';
import IconEth from '@/assets/chains/eth.svg';
import ArbConfig from './chains/arb-goerli';
import OpConfig from './chains/op-goerli';
import GoerliConfig from './chains/goerli';

export const chainIdMapping = {
  1: 'ETH Mainnet',
  5: 'Goerli',
  42: 'KOVAN',
  56: 'BSC Mainnet',
  128: 'HECO Mainnet',
  97: 'BSC Testnet',
  420: 'Optimism Goerli',
  421613: 'Arbitrum Goerli',
};

// get all chainId mapping, especially for switch chain.
export const chainMapping = {
  '0x1': {
    icon: IconEth,
    name: 'Ethereum',
  },
  '0x5': {
    icon: IconEth,
    name: 'Goerli',
  },
  '0xa': {
    icon: IconOp,
    name: 'Optimism',
  },
  '0x1a4': {
    icon: IconOp,
    name: 'Optimism Goerli',
  },
  '0xa4b1': {
    icon: IconArb,
    name: 'Arbitrum',
  },
  '0x66eed': {
    icon: IconArb,
    name: 'Arbitrum Goerli',
  },
};
// This is an important store switch which will clear all users' data
export const storeVersion = '3';

export const bundlerErrMapping: { [key: string]: string } = {
  'Operation Failed: AA23/OOG': 'Check signature or increase gas limit.',
  'Operation Failed: AA23': 'Signature issue.',
  'Insufficient ETH: AA21': 'Not enough ETH balance without paymaster.',
  'Insufficient Paymaster Funds: AA31': "Paymaster's balance is too low.",
  'Paymaster Issue: AA33/OOG': 'Paymaster error or low gas limit.',
  'Paymaster Issue: AA33': 'Specific paymaster problem.',
  'Wallet Already Created: AA10': 'This wallet already exists.',
};

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
      link: 'https://github.com/proofofsoulprotocol',
    },
  ],
  magicValue: '0x1626ba7e',
  backendURL: 'https://api-dev.soulwallet.io/appapi',
  soulScanURL: 'https://api-dev.soulwallet.io/opapi',
  officialWebUrl: import.meta.env.VITE_OFFICIAL_WEB_URL,
  /* @vite-ignore */
  chainList: [ArbConfig, OpConfig, GoerliConfig],
};
