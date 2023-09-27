import { ethers } from 'ethers';
import { getMessageType } from '@/lib/tools';
// IMPORTANT TODO, still available on newer structure?
import useWalletContext from '@/context/hooks/useWalletContext';
import useKeyring from '@/hooks/useKeyring';
import useConfig from './useConfig';
import { useAddressStore } from '@/store/address';
import { Methods } from '@safe-global/safe-apps-sdk';

export default function useDapp() {
  const { ethersProvider, showSignTransaction } = useWalletContext();
  const { chainConfig } = useConfig();
  const { selectedAddress } = useAddressStore();

  const keyring = useKeyring();

  const getAccounts = () => {
    return selectedAddress;
    // const account = await windowBus.send("getAccounts")
    // return [account];
  };

  const switchChain = async (params: any) => {
    // return await windowBus.send("switchChain", params[0]);
  };

  const getBlockByNumber = async (blockHashOrBlockTag: string, prefetchTxs: boolean) => {
    return await ethersProvider.getBlock(blockHashOrBlockTag, prefetchTxs);
  }

  const sendTransaction = async (txns: any) => {
    txns.forEach((item: any) => {
      if (!item.value) {
        item.value = '0x0';
      }
    });

    // return receipt
    return await showSignTransaction(txns);
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
    return await ethersProvider.call(params[0]);
    // TODO
    // return await ethersProvider.call(params[0], params[1]);
  };

  const getSafeInfo = () => {
    const account = getAccounts();

    const safeInfo = {
      safeAddress: account,
      chainId: chainConfig.chainId,
      owners: [account],
      threshold: 1,
      isReadOnly: false,
    };

    return safeInfo;
  };

  const makeResponse = (id: string, data: any) => {
    return {
      id,
      success: true,
      version: '1.18.0',
      data,
    };
  };

  const makeError = (id: string, data: any) => {
    return {
      id,
      success: false,
      version: '1.18.0',
    };
  };

  const handleRpcCall = async (call: string, params: any) => {
    switch (call) {
      case 'eth_chainId':
        return chainConfig.chainId;
      case 'eth_blockNumber':
        return await blockNumber();
      case 'eth_getBlockByNumber':
        return await getBlockByNumber(params[0], params[1]);
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
  };

  const handleRequest = async (request: any) => {
    // console.log('handle reqeust', request.params.call, request.method)
    switch (request.method) {
      case Methods.getSafeInfo:
        return getSafeInfo();
      case Methods.rpcCall:
        if (request.params) {
          const { call, params } = request.params;
          return await handleRpcCall(call, params);
        } else {
          return;
        }
      case Methods.signMessage:
        console.log('signMessage', request);
        return;
      case Methods.signTypedMessage:
        // {"types":{"type":"object","properties":{"EIP712Domain":{"type":"array"}},"additionalProperties":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"type":{"type":"string"}},"required":["name","type"]}},"required":["EIP712Domain"]},"primaryType":{"type":"string"},"domain":{"type":"object"},"message":{"type":"object"}}
        const params = request.params;
        const typedData = params.typedData;
        const signature = await keyring.signMessageV4(typedData);
        console.log('signTypedMessage data', signature);
        return;
      case Methods.getTxBySafeTxHash:
        const { safeTxHash } = request.params;
        console.log('safeTxHash', safeTxHash);
        return;
      case Methods.sendTransactions:
        console.log('sendTransactions', request.params.txs)
        const receipt = await sendTransaction(request.params.txs);
        return;
      case Methods.getChainInfo:
        console.log('getChainInfo', chainConfig);
        return {
          chainName: chainConfig.chainName,
          chainId: chainConfig.chainId,
          shortName: chainConfig.chainToken,
          nativeCurrency: {
            name: chainConfig.chainName,
            symbol: chainConfig.chainToken,
            decimals: 18,
            logoUri: 'https://safe-transaction-assets.gnosis-safe.io/chains/1/currency_logo.png',
          },
          blockExplorerUriTemplate: {
            address: 'https://blockscout.com/xdai/mainnet/address/{{address}}/transactions',
            txHash: 'https://blockscout.com/xdai/mainnet/tx/{{txHash}}/',
            api: 'https://blockscout.com/poa/xdai/api?module={{module}}&action={{action}}&address={{address}}&apiKey={{apiKey}}',
          },
        };
      case Methods.getEnvironmentInfo:
        return {
          origin: document.location.origin,
        };
      case Methods.requestAddressBook:
        return;
      case Methods.getOffChainSignature:
        return;
      case Methods.getSafeBalances:
        return;
      case Methods.wallet_getPermissions:
        return;
      case Methods.wallet_requestPermissions:
        return;
    }
  };

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
    handleRequest,
  };
}
