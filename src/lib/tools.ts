import { nanoid } from 'nanoid';
import { ethers, Contract } from 'ethers';
import BN from 'bignumber.js';
import { chainIdMapping, chainMapping } from '@/config';
import IconDefault from '@/assets/tokens/default.svg';
import storage from '@/lib/storage';
import ERC20ABI from '../abi/ERC20.json';
import { DecodeUserOp, DecodeResult } from '@soulwallet/decoder';
import { UserOperation } from '@soulwallet/sdk';
import IconSend from '@/assets/activities/send.svg';
import IconMint from '@/assets/activities/mint.svg';
import IconApprove from '@/assets/activities/approve.svg';
import IconTrade from '@/assets/activities/trade.svg';
import IconReceive from '@/assets/activities/receive.svg';
import IconContract from '@/assets/activities/contract.svg';
import IconEthSquare from '@/assets/chains/eth-square.svg';
import IconOpSquare from '@/assets/chains/op-square.svg';
import IconArbSquare from '@/assets/chains/arb-square.svg';

export const getChainIcon = (chainIdHex: string) => {
  switch (chainIdHex) {
    case '0x5':
      return IconEthSquare;
    case '0x66eed':
      return IconArbSquare;
    case '0x1a4':
      return IconOpSquare;
    default:
      return '';
  }
};

export function parseBase64url(base64url: string) {
  base64url = base64url.replace(/\-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64url), (c) => c.charCodeAt(0)).buffer;
}

export function arrayBufferToHex(arrayBuffer: any) {
  const uint8Array = new Uint8Array(arrayBuffer);
  return (
    '0x' +
    Array.from(uint8Array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  );
}

export function hexToUint8Array(hex: string) {
  if (hex.startsWith('0x')) hex = hex.slice(2);
  const len = hex.length;
  const uint8Array = new Uint8Array(len / 2);
  for (let i = 0; i < len; i += 2) {
    uint8Array[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return uint8Array;
}

export function stringToUint8Array(str: string) {
  return new TextEncoder().encode(str);
}

export function clearStorageWithCredentials() {
  storage.clear();
  // const credentialKey = 'local-credentials'
  // const credentialStorage = storage.getItem(credentialKey);
  // console.log('ready to do clear', storage.getItem('credential-storage'))
  // storage.clear();
  // if(credentialStorage){
  //     storage.setItem(credentialKey, credentialStorage)
  // }
}

export function copyText(value: string) {
  const copied = document.createElement('input');
  copied.setAttribute('value', value);
  document.body.appendChild(copied);
  copied.select();
  document.execCommand('copy');
  document.body.removeChild(copied);
}

export const validateEmail = (email?: string) => {
  if (!email) return false;
  const emialRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emialRegex.test(String(email).toLowerCase());
};

export const getMessageType = (msg: string) => {
  if (msg.startsWith('0x') && msg.length === 66) {
    return 'hash';
  } else {
    return 'text';
  }
};

export const nextRandomId = () => {
  return nanoid();
};

export const formatIPFS = (url: string) => {
  if (url && url.includes('ipfs://')) {
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
  } else {
    return url;
  }
};

export const addPaymasterAndData = (payToken: string, paymaster: string) => {
  if (payToken === ethers.ZeroAddress) {
    return '0x';
  }

  // TODO, consider decimals
  const paymasterAndData = `${paymaster}${new ethers.AbiCoder()
    .encode(['address', 'uint256'], [payToken, ethers.parseEther('1000')])
    .slice(2)}`;

  return paymasterAndData;
};

// export const checkAllowed = (origin: string) => {
//   const addressStorage = storage.getJson('address-storage');
//   const selectedAddress = addressStorage.state.selectedAddress;
//   const selectedAddressItem = addressStorage.state.addressList.filter(
//     (item: IAddressItem) => item.address === selectedAddress,
//   )[0];
//   const allowedOrigins = selectedAddressItem.allowedOrigins;
//   return {
//     isAllowed: allowedOrigins.includes(origin),
//     selectedAddress,
//   };
// };

export const checkShouldInject = (origin: string) => {
  const settingStorage = storage.getJson('setting-storage');
  const globalShouldInject = settingStorage.state.globalShouldInject;
  const shouldInjectList = settingStorage.state.shouldInjectList;
  const shouldNotInjectList = settingStorage.state.shouldNotInjectList;

  let flag = false;
  if (!origin.startsWith('http')) {
    flag = false;
  } else if (shouldInjectList.includes(origin)) {
    flag = true;
  } else if (shouldNotInjectList.includes(origin)) {
    flag = false;
  } else if (globalShouldInject) {
    flag = true;
  } else if (!globalShouldInject) {
    flag = false;
  }

  return flag;
};

export const getSelectedChainItem = () => {
  const chainStorage = storage.getJson('chain-storage');
  const selectedChainId = chainStorage.state.selectedChainId;
  const selectedChainItem = chainStorage.state.chainList.filter((item: any) => item.chainIdHex === selectedChainId)[0];
  return selectedChainItem;
};

const to10 = (n: any) => {
  return BN(n).toString();
};

export const getCurrentTimeFormatted = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}-${hour}:${minute}:${second}`;
};

export const isNativeMethod = (fn: any) => {
  return /\{\s*\[native code\]\s*\}/.test('' + fn);
};

export const base64ToBigInt = (base64String: string) => {
  const binaryString = atob(base64String);
  let result = BigInt(0);
  for (let i = 0; i < binaryString.length; i++) {
    result = (result << BigInt(8)) | BigInt(binaryString.charCodeAt(i));
  }
  return result;
};

export const base64ToBuffer = (base64String: string) => {
  let binaryString = atob(base64String);
  let len = binaryString.length;
  let bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const uint8ArrayToHexString = (byteArray: Uint8Array) => {
  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

// export const uint8ArrayToString = (byteArray: Uint8Array) => {
//   return Array.from(byteArray).map(byte => byte.toString(2).padStart(2, '0')).join('');
// }

export const printUserOp = (userOp: any) => {
  console.log(
    JSON.stringify([
      {
        sender: userOp.sender,
        nonce: userOp.nonce.toString(),
        initCode: userOp.initCode,
        callData: userOp.callData,
        callGasLimit: to10(userOp.callGasLimit),
        verificationGasLimit: to10(userOp.verificationGasLimit),
        preVerificationGas: to10(userOp.preVerificationGas),
        maxFeePerGas: to10(userOp.maxFeePerGas),
        maxPriorityFeePerGas: to10(userOp.maxPriorityFeePerGas),
        paymasterAndData: userOp.paymasterAndData,
        signature: userOp.signature,
      },
    ]),
  );
};

export const findMissingNumbers = (range: number[], existArray: number[]) => {
  return range.filter((item) => !existArray.includes(item));
};

export const truncateString = (str: string, num: number) => {
  if (str.length > num) {
    return str.substring(0, num) + '...';
  }
  return str;
};

export const hasCommonElement = (arr1: [], arr2: []) => {
  return arr1.some((item) => arr2.includes(item));
};

export const toShortAddress = (address: string, firstSlice: number = 6, lastSlice: number = 4) => {
  if (address.length > 10) {
    return `${address.slice(0, firstSlice)}...${address.slice(-lastSlice)}`;
  }

  return address;
};

export const numToFixed = (num: any, precision: number) => {
  const bn = BN(num);
  let str = bn.toFixed(precision);
  if (str.indexOf('.') > 0) {
    str = str.replace(/0+$/, '');
    if (str[str.length - 1] === '.') {
      str = str.substring(0, str.length - 1);
    }
  }
  return str;
};

export const getNetwork = (chainId: number) => {
  const name = chainIdMapping[chainId as keyof typeof chainIdMapping] || '';
  console.log('getNetwork', chainId, name);
  return name;
};

export const getChainInfo = (chainId: string) => {
  return (
    chainMapping[chainId as keyof typeof chainMapping] || { icon: IconDefault, name: `Chain ID: ${Number(chainId)}` }
  );
};

export const getStatus = (statusId: number) => {
  if (statusId === 1) {
    return 'Recovered';
  } else if (statusId === 0) {
    return 'Pending';
  }

  return 'Pending';
};

export const getKeystoreStatus = (statusId: number) => {
  if (statusId === 3) {
    return 'Recovered';
  }

  return 'Pending';
};

export const toHex = (num: any) => {
  let hexStr = num.toString(16);

  if (hexStr.length % 2 === 1) {
    hexStr = '0' + hexStr;
  }

  hexStr = '0x' + hexStr;

  return hexStr;
};

export const toCapitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const decodeCalldata = async (
  chainId: string,
  entrypoint: string,
  userOp: UserOperation,
  ethersProvider: any,
) => {
  const decodeRet = await DecodeUserOp(parseInt(chainId), entrypoint, userOp);
  // console.log('decoded tx:', decodeRet.OK)
  if (decodeRet.isErr()) {
    console.error(decodeRet.ERR);
    return [];
  }

  const decoded: any[] = decodeRet.OK;

  if (userOp.initCode !== '0x') {
    decoded.unshift({
      functionName: 'Create Wallet',
    });
  }

  for (let i of decoded) {
    if (!i.method && i.value) {
      i.functionName = 'Transfer ETH';
    }

    if (i.method && i.method.name === 'transfer') {
      // get erc20 info
      const tokenAddress = i.to;
      const tokenContract = new Contract(tokenAddress, ERC20ABI, ethersProvider);

      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();
      const amount = BN(i.method.params['1']).shiftedBy(-BN(decimals)).toFixed();

      i.sendErc20Amount = `${amount} ${symbol}`;
      i.sendErc20Address = i.method.params['0'];
    }
  }

  return decoded;
};

export const getIconMapping = (name: string) => {
  switch (name.toLowerCase()) {
    case 'transfer erc20':
      return IconSend;
    case 'transfer eth':
    return IconSend;
    case 'mint':
    case 'minttoken':
      return IconMint;
    case 'approve':
      return IconApprove;
    case 'swap':
    case 'deposit':
      return IconTrade;
    default:
      return IconContract;
  }
};
