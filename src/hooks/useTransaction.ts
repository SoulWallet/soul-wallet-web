/**
 * In-wallet Transactions
 */

import { ethers } from 'ethers';
import BN from 'bignumber.js';
import useKeyring from './useKeyring';
import Erc20ABI from '../contract/abi/ERC20.json';
import { useAddressStore } from '@/store/address';
import { Transaction } from '@soulwallet/sdk';
import useQuery from './useQuery';
import { SignkeyType } from '@soulwallet/sdk';
import useSdk from '@/hooks/useSdk';
import useWalletContext from '@/context/hooks/useWalletContext';

export default function useTransaction() {
  const { showSignTransaction } = useWalletContext();
  const { soulWallet } = useSdk();
  const { set1559Fee, getGasPrice } = useQuery();
  const { selectedAddress } = useAddressStore();

  const sendEth = async (to: string, amount: string) => {

    const amountInWei = new BN(amount).shiftedBy(18).toString();
    const tx: Transaction = {
      to,
      value: amountInWei,
      data: '0x',
    };

    showSignTransaction([tx], '', to);
  
  };

  const sendErc20 = async (tokenAddress: string, to: string, amount: string, decimals: number) => {
    const amountInWei = new BN(amount).shiftedBy(decimals).toString();
    const erc20Interface = new ethers.Interface(Erc20ABI);
    const callData = erc20Interface.encodeFunctionData('transfer', [to, amountInWei]);
    const tx: Transaction = {
      to: tokenAddress,
      data: callData,
    };

    showSignTransaction([tx], '', to);
 
  };

  const getUserOp: any = async (txns: any, payToken: string) => {
    try {
      const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();

      const userOpRet = await soulWallet.fromTransaction(maxFeePerGas, maxPriorityFeePerGas, selectedAddress, txns);

      if (userOpRet.isErr()) {
        throw new Error(userOpRet.ERR.message);
      }

      let userOp = userOpRet.OK;

      // set preVerificationGas
      // const gasLimit = await soulWallet.estimateUserOperationGas(userOp, SignkeyType.P256);

      // if (gasLimit.isErr()) {
      //   throw new Error(gasLimit.ERR.message);
      // }

      userOp = await set1559Fee(userOp, payToken);

      // paymasterAndData length calc 1872 = ((236 - 2) / 2) * 16;
      // userOp.preVerificationGas = `0x${BN(userOp.preVerificationGas.toString()).plus(1872).toString(16)}`;
      // for send transaction with activate
      userOp.preVerificationGas = `0x${BN(userOp.preVerificationGas.toString()).plus(15000).toString(16)}`;
      userOp.verificationGasLimit = `0x${BN(userOp.verificationGasLimit.toString()).plus(30000).toString(16)}`;

      return userOp;
    } catch (err) {
      console.log(err);
    }
  };

  return {
    sendErc20,
    sendEth,
    getUserOp,
  };
}
