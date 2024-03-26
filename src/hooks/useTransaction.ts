/**
 * In-wallet Transactions
 */

import { ethers } from 'ethers';
import BN from 'bignumber.js';
import { erc20Abi } from 'viem'
import { useAddressStore } from '@/store/address';
import { SignkeyType, Transaction } from '@soulwallet/sdk';
import useQuery from './useQuery';
import useSdk from '@/hooks/useSdk';
import useWalletContext from '@/context/hooks/useWalletContext';
import { ABI_ReceivePayment } from '@soulwallet/abi';
import { useBalanceStore } from '@/store/balance';

export default function useTransaction() {
  const { showSignTransaction } = useWalletContext();
  const { soulWallet } = useSdk();
  const { selectedAddress } = useAddressStore();
  const {maxFeePerGas, maxPriorityFeePerGas} = useBalanceStore();

  const payTask = async (contractAddress: string, amount: string, paymentId: string) => {
    const soulAbi = new ethers.Interface(ABI_ReceivePayment);
    const callData = soulAbi.encodeFunctionData('pay(bytes32)', [paymentId]);
    const tx: Transaction = {
      to: contractAddress,
      data: callData,
      value: BN(amount).toString()
    };

    return showSignTransaction([tx], '', '');
  };

  const sendEth = async (to: string, amount: string) => {

    const amountInWei = new BN(amount).shiftedBy(18).toString();
    const tx = {
      from: selectedAddress,
      to,
      value: amountInWei,
      data: '0x',
    };
    return await showSignTransaction([tx], '', to);
  };

  const sendErc20 = async (tokenAddress: string, to: string, amount: string, decimals: number) => {
    const amountInWei = new BN(amount).shiftedBy(decimals).toString();
    const erc20Interface = new ethers.Interface(erc20Abi);
    const callData = erc20Interface.encodeFunctionData('transfer', [to, amountInWei]);
    const tx = {
      from: selectedAddress,
      to: tokenAddress,
      data: callData,
    };
    return showSignTransaction([tx], '', to);
  };

  const getUserOp: any = async (txns: any) => {
    try {
      const userOpRet = await soulWallet.fromTransaction(maxFeePerGas, maxPriorityFeePerGas, selectedAddress, txns);

      if (userOpRet.isErr()) {
        throw new Error(userOpRet.ERR.message);
      }

      let userOp = userOpRet.OK;
   
      return userOp;
    } catch (err:any) {
      throw new Error(err.message);
    }
  };

  return {
    sendErc20,
    sendEth,
    getUserOp,
    payTask,
  };
}
