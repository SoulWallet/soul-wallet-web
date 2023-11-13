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


export const faqList = [
  {
    title: `What is passkey?`,
    content: `A passkey is a FIDO credential stored on your computer or phone. Soul Wallet users use passkey to sign transactions without directly touching the private keys. <a href="#" style="color:#2D5AF6; text-decoration: underline;">See more details here.</a>`,
  },
  {
    title: `Where is the private key and seed phrase?`,
    content: `Your private key is the passkey on your device. It's more convenient and secure to back up the wallet by adding another device or setting guardians. Currently Soul Wallet doesn't have seed phrases.`,
  },
  {
    title: `Will using Soul Wallet leak my biometrics like fingerprint?`,
    content: `No. Your device verifies your identity with biometrics to use passkeys. Your biometrics won't leave your device and won't be shared on blockchain. `,
  },
  {
    title: `If Soul Wallet's website is down, would I lose my wallet?`,
    content: `No. In any circumstance, your funds are safe. If in extreme cases, the Soul Wallet website is unanaliable, users can host their own website and use self-signed certificates to use the passkey.`,
  },
  {
    title: `What is KeyStore?`,
    content: `Keystore is a special smart contract that stores the owner of wallet. Currently Soul Wallet keystore is on L1 to achieve the highest security. <a href="#" style="color:#2D5AF6; text-decoration: underline;">See more details here.</a>`,
  },
]