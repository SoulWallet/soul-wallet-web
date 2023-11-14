import IconUniswap from '@/assets/dapps/uniswap.png';
import IconAave from '@/assets/dapps/aave.png';
import IconFeature0 from '@/assets/icons/features/0.svg';
import IconFeature1 from '@/assets/icons/features/1.svg';
import IconFeature2 from '@/assets/icons/features/2.svg';
import IconFeature3 from '@/assets/icons/features/3.svg';
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
    content: `A passkey is a FIDO credential stored on your computer or phone. Soul Wallet users use passkey to sign transactions without directly touching the private keys. <a href="https://blog.google/inside-google/googlers/ask-a-techspert/how-passkeys-work/" target='_blank' style="color:#2D5AF6; text-decoration: underline;">See more details here.</a>`,
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
    content: `Keystore is a special smart contract that stores the owner of wallet. Currently Soul Wallet keystore is on L1 to achieve the highest security. <a href="https://vitalik.ca/general/2023/06/20/deeperdive.html" target='_blank' style="color:#2D5AF6; text-decoration: underline;">See more details here.</a>`,
  },
];

export const featureList = [
  {
    icon: IconFeature0,
    title: 'Self-custody<br/> with passkey',
    content: 'Sign every transaction with FaceID/TouchID/Pin. Achieve hardware wallet level security with passkey.',
  },
  {
    icon: IconFeature1,
    title: 'Easy to use<br/> web wallet',
    content: 'No Browser Extension. No Install. Pay gas fees with stable coins and get sponsors for transactions.',
  },
  {
    icon: IconFeature2,
    title: 'Free access<br/> to Dapps',
    content: 'Use Soul Wallet on Ethereum L2. Connect to dapps with web sdk. See the demo dapp',
  },
  {
    icon: IconFeature3,
    title: 'Social recovery<br/>with built-in.',
    content:
      'Use wallet on your Mac/PC/Phone. Find your wallet back with Social Recovery, even if all your devices are lost.',
  },
];
