import IconUniswap from '@/assets/dapps/uniswap.png';
import IconAave from '@/assets/dapps/aave.png';
// import IconDefault from '@/assets/icons/default.svg';

export const dappList = [
  {
    icon: IconUniswap,
    title: 'Uniswap',
    category: 'DeFi',
    url: 'https://app.uniswap.org',
    desc: 'Swap or provide liquidity on the Uniswap protocol',
  },
  {
    icon: IconAave,
    title: 'AAVE',
    category: 'DeFi',
    url: 'https://staging.aave.com/',
    desc: 'Earn interest, borrow assets, and build applications',
  },
  // {
  //   icon: IconDefault,
  //   title: 'Local Dapp',
  //   category: 'DeFi',
  //   url: 'http://localhost:3000',
  //   desc: 'For developers only',
  // },
];
