import { ethers } from 'ethers';
import { getMessageType } from '@/lib/tools';
// IMPORTANT TODO, still available on newer structure?
import useWalletContext from '@/context/hooks/useWalletContext';
import useConfig from './useConfig';
import { useAddressStore } from '@/store/address';
import bg from '@/background';
import { Methods } from '@safe-global/safe-apps-sdk';

export default function useDapp() {
  const { ethersProvider } = useWalletContext();
  const { chainConfig } = useConfig();
  const { selectedAddress } = useAddressStore();

  const getAccounts = () => {
    return selectedAddress;
    // const account = await windowBus.send("getAccounts")
    // return [account];
  };

  const switchChain = async (params: any) => {
    // return await windowBus.send("switchChain", params[0]);
  };

  const sendTransaction = async (params: any) => {
    params.forEach((item: any) => {
      if (!item.value) {
        item.value = '0x0';
      }
    });

    // bg.execute()

    // const opData: any = await windowBus.send("approve", { txns: params });

    // try {
    //     return await windowBus.send("execute", opData);
    // } catch (err) {
    //     throw new Error("Failed to execute");
    // }
  };

  const estimateGas = async (params: any) => {
    return await ethersProvider.estimateGas(params[0]);
  };

  const gasPrice = async () => {
    const feeData = await ethersProvider.getFeeData();

    // TODO, changed
    return feeData.gasPrice?.toString();
  };

  const getCode = async (params: any) => {
    return await ethersProvider.getCode(params[0], params[1]);
  };

  const getBalance = async (params: any) => {
    return await ethersProvider.getBalance(params[0], params[1]);
  };

  const getTransactionReceipt = async (params: any) => {
    return await ethersProvider.getTransactionReceipt(params[0]);
  };

  const getTransactionByHash = async (params: any) => {
    return await ethersProvider.getTransaction(params[0]);
  };

  const signTypedDataV4 = async (params: any) => {
    // const res = await windowBus.send("signMessageV4", {
    //     data: params[1],
  // });
    // console.log("signTypeV4 sig: ", res);
    // return res;
  };

  const personalSign = async (params: any) => {
    const msg = params[0];
    // const msgToSign = getMessageType(params[0]) === "hash" ? msg : ethers.utils.toUtf8String(msg);
    // console.log('before send personal sign', msgToSign)
    // const res = await windowBus.send("signMessage", {
    //     data: msg,
    // });
    // return res;
  };

  const personalRecover = async (params: string[]) => {
    // judge msg type
    const msgType = getMessageType(params[0]);
    const signature = params[1];

    let msgHash = '';

    if (msgType === 'text') {
      const text = ethers.toUtf8String(params[0]);
      msgHash = ethers.hashMessage(text);
    } else if (msgType === 'hash') {
      msgHash = params[0];
    }

    // const walletAddress = await windowBus.send("getAccounts");
    // const walletContract = new ethers.Contract(walletAddress as string, WalletABI, ethersProvider);
    // const isValid = await walletContract.isValidSignature(msgHash, signature);

    // if (isValid === config.magicValue) {
    //     return walletAddress;
    // }
  };

  const chainId = async () => {
    return chainConfig.chainIdHex;
  };

  const blockNumber = async () => {
    return await ethersProvider.getBlockNumber();
  };

  const ethCall = async (params: any) => {
    console.log('params', params);
    // TODO
    // return await ethersProvider.call(params[0], params[1]);
  };

  const getSafeInfo = () => {
    const account = getAccounts();

    const safeInfo = {
      safeAddress: account,
      chainId: parseInt(chainConfig.chainIdHex, 10),
      owners: [account],
      threshold: 1,
      isReadOnly: false,
      network: 'ETHEREUM',
    }

    return safeInfo
  }

  const makeResponse = (id: string, data: any) => {
    return {
      id,
      success: true,
      version: '1.18.0',
      data
    }
  }

  const makeError = (id: string, data: any) => {
    return {
      id,
      success: false,
      version: '1.18.0'
    }
  }

  const handleRpcCall = async (call, params) => {
    switch (call) {
      case 'eth_chainId':
        return await chainId(chainConfig);
      case 'eth_blockNumber':
        return await blockNumber();
      case 'eth_accounts':
        return await getAccounts();
      case 'eth_requestAccounts':
        return await getAccounts();
      case 'eth_sendTransaction':
        return await sendTransaction(params);
      case 'eth_estimateGas':
        return await estimateGas(params);
      case 'eth_call':
        return await ethCall(params);
      case 'eth_getCode':
        return await getCode(params);
      case 'eth_getBalance':
        return await getBalance(params);
      case 'eth_gasPrice':
        return await gasPrice();
      case 'eth_getTransactionReceipt':
        return await getTransactionReceipt(params);
      case 'eth_getTransactionByHash':
        return await getTransactionByHash(params);
      case 'personal_sign':
        return await personalSign(params);
      case 'personal_ecRecover':
        return await personalRecover(params);
      case 'eth_signTypedData_v4':
        return await signTypedDataV4(params);
      case 'wallet_switchEthereumChain':
        return await switchChain(params);
    }
  }

  const handleRequest = async (request: any) => {
    switch (request.method) {
      case Methods.getChainInfo:
        return;
      case Methods.getEnvironmentInfo:
        return;
      case Methods.getOffChainSignature:
        return;
      case Methods.getSafeBalances:
        return;
      case Methods.getSafeInfo:
        return getSafeInfo();
      case Methods.getTxBySafeTxHash:
        return;
      case Methods.requestAddressBook:
        return;
      case Methods.rpcCall:
        if (request.params) {
          const { call, params } = request.params
          return await handleRpcCall(call, params)
        } else {
          return;
        }
      case Methods.sendTransactions:
        return;
      case Methods.signMessage:
        return;
      case Methods.signTypedMessage:
        return;
      case Methods.wallet_getPermissions:
        return;
      case Methods.wallet_requestPermissions:
        return;
    }
  }

  return {
    getAccounts,
    switchChain,
    sendTransaction,
    estimateGas,
    gasPrice,
    getCode,
    getBalance,
    getTransactionReceipt,
    getTransactionByHash,
    signTypedDataV4,
    personalSign,
    personalRecover,
    chainId,
    blockNumber,
    ethCall,
    getSafeInfo,
    makeResponse,
    makeError,
    handleRequest
  };
}
