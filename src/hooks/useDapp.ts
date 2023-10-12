import { ethers } from 'ethers';
import { getMessageType } from '@/lib/tools';
// IMPORTANT TODO, still available on newer structure?
import useWalletContext from '@/context/hooks/useWalletContext';
import useKeyring from '@/hooks/useKeyring';
import useConfig from './useConfig';
import {TypedDataEncoder} from 'ethers'
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain'
import {
  Methods,
  SafeInfo,
  ChainInfo,
  SafeBalances,
  SendTransactionsResponse,
  BaseTransaction,
  GetTxBySafeTxHashParams,
  SendTransactionRequestParams,
  SendTransactionsParams,
  SignMessageParams,
  TypedDataDomain,
  TypedDataTypes,
  EIP712TypedData,
  SignTypedMessageParams,
  OffChainSignMessageResponse,
  GatewayTransactionDetails,
  SignMessageResponse,
  EnvironmentInfo,
  PostMessageOptions,
  AddressBookItem,
  MessageFormatter,
  getSDKVersion,
  TransactionStatus
} from '@safe-global/safe-apps-sdk';

export interface MethodToResponse {
  [Methods.sendTransactions]: SendTransactionsResponse;
  [Methods.rpcCall]: unknown;
  [Methods.getSafeInfo]: SafeInfo;
  [Methods.getChainInfo]: ChainInfo;
  [Methods.getTxBySafeTxHash]: GatewayTransactionDetails;
  [Methods.getSafeBalances]: SafeBalances[];
  [Methods.signMessage]: SignMessageResponse;
  [Methods.signTypedMessage]: SignMessageResponse;
  [Methods.getEnvironmentInfo]: EnvironmentInfo;
  [Methods.getOffChainSignature]: string;
  [Methods.requestAddressBook]: AddressBookItem[];
}

export default function useDapp() {
  const { ethersProvider, showSignTransaction, showSignMessage } = useWalletContext();
  const { getSelectedChainItem } = useChainStore();
  const { selectedAddress, getSelectedAddressItem } = useAddressStore();

  const getAccounts = () => {
    return getSelectedAddressItem().address;
    // const account = await windowBus.send("getAccounts")
    // return [account];
  };

  const switchChain = async (params: any) => {
    // return await windowBus.send("switchChain", params[0]);
  };

  const getBlockByNumber = async (blockHashOrBlockTag: string, prefetchTxs: boolean) => {
    return await ethersProvider.getBlock(blockHashOrBlockTag, prefetchTxs);
  };

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
    const msg = params[1]
    return await showSignMessage(msg, 'typedData');
    // const res = await windowBus.send("signMessageV4", {
    //     data: params[1],
  // });
    // console.log("signTypeV4 sig: ", res);
    // return res;
  };

  const signMessage = async (params: any) => {
    const msg = params[0];
    const signature = await showSignMessage(msg, 'message');
    return signature;
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
    return getSelectedChainItem().chainIdHex;
  };

  const blockNumber = async () => {
    return await ethersProvider.getBlockNumber();
  };

  const ethCall = async (params: any) => {
    return await ethersProvider.call(params[0]);
    // TODO
    // return await ethersProvider.call(params[0], params[1]);
  };

  const getSafeInfo = (): SafeInfo => {
    const account = getAccounts();

    const safeInfo = {
      safeAddress: account,
      chainId: getSelectedChainItem().chainId,
      owners: [account],
      threshold: 1,
      isReadOnly: false,
    };

    return safeInfo;
  };

  const sendSafeTransaction = async (request: any): Promise<SendTransactionsResponse> => {
    const receipt: any = await sendTransaction(request.params.txs);
    return { safeTxHash: receipt.transactionHash };
  };

  const makeResponse = (requestId: string, data: any) => {
    return MessageFormatter.makeResponse(requestId, data, getSDKVersion());
  };

  const makeError = (requestId: string, data: string) => {
    return MessageFormatter.makeErrorResponse(requestId, data, getSDKVersion());
  };

  const handleRpcCall = async (call: string, params: any) => {
    switch (call) {
      case 'eth_chainId':
        return getSelectedChainItem().chainId;
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
        const { ...receipt }: any = await getTransactionReceipt(params);
        receipt.transactionHash = receipt.hash;
        receipt.transactionIndex = receipt.index;
        receipt.logs = receipt.logs || [];
        return receipt;
      case 'eth_getTransactionByHash':
        return await getTransactionByHash(params);
      case 'personal_sign':
        return await signMessage(params);
      case 'personal_ecRecover':
        return await personalRecover(params);
      case 'eth_signTypedData_v4':
        return await signTypedDataV4(params);
      case 'wallet_switchEthereumChain':
        return await switchChain(params);
    }
  };// eth_getTransactionReceipt

  const handleRequest = async (request: any) => {
    console.log('safe message request', request)
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
        const signature = await signMessage([request.params.message]);
        return { messageHash: signature as any };
      case Methods.signTypedMessage:
        const params = request.params;
        const typedData = params.typedData;
        const signatureV4 = await signTypedDataV4([, typedData])
        return { messageHash: signatureV4 as any };
      case Methods.getTxBySafeTxHash:
        const { safeTxHash } = request.params;
        return await getTransactionByHash([safeTxHash]);

        // return {
        //   safeAddress: getAccounts(),
    //   txId: receipt.hash,
    //   txStatus: receipt.status === 1 ? 'SUCCESS' : 'FAILED',
    //   txInfo: {
        //     type: 'custom',
        //     to: { value: receipt.to },
    //     dataSize: String((receipt.data.length / 2) - 1),
    //     value: String(receipt.value),
    //     isCancellation: false
        //   }
        // };
      case Methods.sendTransactions:
        return await sendSafeTransaction(request);
      case Methods.getChainInfo:
        return {
          chainName: getSelectedChainItem().chainName,
          chainId: getSelectedChainItem().chainId,
          shortName: getSelectedChainItem().chainToken,
          nativeCurrency: {
            name: getSelectedChainItem().chainName,
            symbol: getSelectedChainItem().chainToken,
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
    signMessage,
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
