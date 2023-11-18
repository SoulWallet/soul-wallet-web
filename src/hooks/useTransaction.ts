/**
 * In-wallet Transactions
 */

import { ethers } from 'ethers';
import BN from 'bignumber.js';
import Erc20ABI from '../contract/abi/ERC20.json';
import { useAddressStore } from '@/store/address';
import { Transaction } from '@soulwallet/sdk';
import useQuery from './useQuery';
import useSdk from '@/hooks/useSdk';
import useWalletContext from '@/context/hooks/useWalletContext';
import { ABI_ReceivePayment } from '@soulwallet/abi';

export default function useTransaction() {
  const { showSignTransaction } = useWalletContext();
  const { soulWallet } = useSdk();
  const { set1559Fee, getGasPrice } = useQuery();
  const { selectedAddress } = useAddressStore();


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
    const erc20Interface = new ethers.Interface(Erc20ABI);
    const callData = erc20Interface.encodeFunctionData('transfer', [to, amountInWei]);
    const tx = {
      from: selectedAddress,
      to: tokenAddress,
      data: callData,
    };
    return showSignTransaction([tx], '', to);
  };

  const getUserOp: any = async (txns: any, payToken: string) => {
    try {
      const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();

      const userOpRet = await soulWallet.fromTransaction(maxFeePerGas, maxPriorityFeePerGas, selectedAddress, txns);

      if (userOpRet.isErr()) {
        throw new Error(userOpRet.ERR.message);
      }

      let userOp = userOpRet.OK;
      userOp = await set1559Fee(userOp, payToken);

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
    payTask,
  };
}
