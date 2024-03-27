import { MaxUint256, ZeroHash, ethers } from 'ethers';
import useSdk from './useSdk';
import useQuery from './useQuery';
import { ABI_SoulWallet } from '@soulwallet/abi';
import { useSlotStore } from '@/store/slot';
import { addPaymasterData } from '@/lib/tools';
import { erc20Abi, verifyMessage } from 'viem';
import { SignkeyType, UserOperation } from '@soulwallet/sdk';
import { executeTransaction } from '@/lib/tx';
import { UserOpUtils } from '@soulwallet/sdk';
import useConfig from './useConfig';
import api from '@/lib/api';
import usePasskey from './usePasskey';
import { toHex } from '@/lib/tools';
import { useSignerStore } from '@/store/signer';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import { defaultGuardianSafePeriod } from '@/config';
import { aaveUsdcPoolAbi } from '@/contracts/abis';
import useTransaction from './useTransaction';
import useTools from './useTools';
import BN from 'bignumber.js';
import useBrowser from './useBrowser';
import { useBalanceStore } from '@/store/balance';
import { useToast } from '@chakra-ui/react';

const noGuardian = {
  initialGuardianHash: ethers.ZeroHash,
  initialGuardianSafePeriod: defaultGuardianSafePeriod,
};

export default function useWallet() {
  const { signByPasskey, authenticate } = usePasskey();
  const { chainConfig } = useConfig();
  const { setSlotInfo } = useSlotStore();
  const { selectedChainId, setSelectedChainId } = useChainStore();
  const { setCredentials, getSelectedCredential, selectedKeyType } = useSignerStore();
  const { soulWallet } = useSdk();
  const { navigate } = useBrowser();
  const toast = useToast();
  const { getTokenBalance, maxFeePerGas, maxPriorityFeePerGas } = useBalanceStore();
  const { clearLogData } = useTools();
  const { selectedAddress, setSelectedAddress, setWalletName } = useAddressStore();

  const loginWallet = async () => {
    const { credential } = await authenticate();
    try {
      const res: any = await api.account.list({
        ownerKey: credential.publicKey,
      });

      if (!res || !res.data || !res.data.length || res.code !== 200) {
        toast({
          title: 'Failed to login',
          description: res.msg,
          status: 'error',
          duration: 5000,
        });
        throw new Error('Failed to login');
      }

      // consider first item only for now
      const item = res.data[0];

      setCredentials([credential as any]);
      setWalletName(item.name);
      setSelectedAddress(item.address);
      setSelectedChainId(item.chainID);
      setSlotInfo(item.initInfo);
    } catch (e: any) {
      toast({
        title: 'Failed to login',
        description: e.response.data.data.message,
        status: 'error',
        duration: 5000,
      });
      throw new Error('Failed to login');
    }
  };

  const logoutWallet = async () => {
    clearLogData();
    navigate('/landing');
  };

  const getWithdrawOp = async (amount: string, to: string) => {
    const aaveUsdcPool = new ethers.Interface(aaveUsdcPoolAbi);
    const erc20 = new ethers.Interface(erc20Abi);

    const usdcBalance = getTokenBalance(import.meta.env.VITE_TOKEN_USDC)?.tokenBalanceFormatted;
    const ausdcBalance = getTokenBalance(import.meta.env.VITE_TOKEN_AUSDC)?.tokenBalanceFormatted;

    let txs = [];

    if (BN(amount).isGreaterThan(BN(usdcBalance).plus(ausdcBalance))) {
      toast({
        title: 'Insufficient balance',
        status: 'error',
      });
      return;
    }

    const withdrawAmount = BN(amount).minus(usdcBalance);

    if (withdrawAmount.isGreaterThan(0)) {
      txs.push({
        from: selectedAddress,
        to: import.meta.env.VITE_AAVE_USDC_POOL,
        data: aaveUsdcPool.encodeFunctionData('withdraw(address,uint256,address)', [
          import.meta.env.VITE_TOKEN_USDC,
          ethers.parseUnits(withdrawAmount.toString(), 6),
          selectedAddress,
        ]),
      });
    }

    txs.push({
      from: selectedAddress,
      to: import.meta.env.VITE_TOKEN_USDC,
      data: erc20.encodeFunctionData('transfer', [to, ethers.parseUnits(String(amount), 6)]),
    });

    return await getUserOp(txs);
  };

  const initWallet = async (credential: any, walletName: string, invitationCode: string) => {
    const createIndex = 0;

    const initialKeys = [credential.publicKey as string];

    const createSlotInfo = {
      initialKeys,
      initialGuardianHash: noGuardian.initialGuardianHash,
      initialGuardianSafePeriod: toHex(noGuardian.initialGuardianSafePeriod),
    };

    // do time consuming jobs
    const address = (
      await soulWallet.calcWalletAddress(
        createIndex,
        initialKeys,
        noGuardian.initialGuardianHash,
        Number(noGuardian.initialGuardianSafePeriod),
        selectedChainId,
      )
    ).OK;

    setSelectedAddress(address);
    setWalletName(walletName);
    const res: any = await api.account.create({
      address,
      chainID: selectedChainId,
      name: walletName,
      initInfo: {
        index: createIndex,
        ...createSlotInfo,
      },
      invitationCode,
    });
    if (res.code !== 200) {
      toast({
        title: 'Create wallet failed',
        description: res.msg,
        status: 'error',
      });
      throw new Error('Create wallet failed');
    }

    setSlotInfo(createSlotInfo);

    setCredentials([credential as any]);

    return {
      initialKeys,
    };
  };

  const getActivateOp = async (_initialKeys: any) => {
    const createIndex = 0;
    const userOpRet = await soulWallet.createUnsignedDeployWalletUserOp(
      createIndex,
      _initialKeys,
      noGuardian.initialGuardianHash,
      '0x',
    );

    if (userOpRet.isErr()) {
      throw new Error(userOpRet.ERR.message);
    }

    let userOp = userOpRet.OK;

    // approve paymaster to spend ERC-20
    const soulAbi = new ethers.Interface(ABI_SoulWallet);
    const erc20Interface = new ethers.Interface(erc20Abi);
    // approve defi contract to spend token
    const approveTos = [import.meta.env.VITE_TOKEN_USDC];
    const approveCalldata = erc20Interface.encodeFunctionData('approve', [
      import.meta.env.VITE_AaveUsdcSaveAutomation,
      MaxUint256,
    ]);

    const approveCalldatas = [...new Array(approveTos.length)].map(() => approveCalldata);

    const finalValues = [...new Array(approveTos.length).fill('0x0')];

    const executions: string[][] = approveTos.map((to, index) => [to, finalValues[index], approveCalldatas[index]]);

    userOp.callData = soulAbi.encodeFunctionData('executeBatch((address,uint256,bytes)[])', [executions]);

    userOp.maxFeePerGas = maxFeePerGas;
    userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

    userOp = await getSponsor(userOp);

    return userOp;
  };

  const getUserOp: any = async (txns: any) => {
    try {
      const userOpRet = await soulWallet.fromTransaction(maxFeePerGas, maxPriorityFeePerGas, selectedAddress, txns);

      if (userOpRet.isErr()) {
        throw new Error(userOpRet.ERR.message);
      }

      let userOp = userOpRet.OK;

      userOp = await getSponsor(userOp);

      return userOp;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const getPasskeySignature = async (packedHash: string, validationData: string) => {
    const selectedCredential: any = getSelectedCredential();
    const signatureData: any = await signByPasskey(selectedCredential, packedHash);
    console.log('packUserOp256Signature params:', signatureData, validationData);
    const packedSignatureRet =
      selectedCredential.algorithm === 'ES256'
        ? await soulWallet.packUserOpP256Signature(
            chainConfig.contracts.defaultValidator,
            signatureData,
            validationData,
          )
        : selectedCredential.algorithm === 'RS256'
          ? await soulWallet.packUserOpRS256Signature(
              chainConfig.contracts.defaultValidator,
              signatureData,
              validationData,
            )
          : null;

    if (!packedSignatureRet) {
      throw new Error('algorithm not supported');
    }

    if (packedSignatureRet.isErr()) {
      throw new Error(packedSignatureRet.ERR.message);
    }

    return packedSignatureRet.OK;
  };

  const getSponsor = async (userOp: UserOperation) => {
    userOp.signature = (
      await soulWallet.getSemiValidSignature(import.meta.env.VITE_SoulWalletDefaultValidator, userOp, selectedKeyType)
    ).OK;

    let res: any;

    try {
      res = await api.sponsor.check(
        selectedChainId,
        chainConfig.contracts.entryPoint,
        JSON.parse(UserOpUtils.userOperationToJSON(userOp)),
      );

      if (res.code !== 200) {
        toast({
          title: 'Sponsor check failed',
          description: res.msg,
          status: 'error',
        });
        throw new Error('Sponsor check failed');
      }
    } catch (e: any) {
      toast({
        title: 'Sponsor check failed',
        description: e.response.data.data.message,
        status: 'error',
        duration: 5000,
      });
      throw new Error('Sponsor check failed');
    }

    if (res.data && res.data.paymasterData) {
      userOp = {
        ...userOp,
        ...res.data,
      };
    }

    return userOp;
  };

  const signAndSend = async (userOp: UserOperation) => {
    const validAfter = Math.floor(Date.now() / 1000 - 300);
    const validUntil = validAfter + 3600;

    const packedUserOpHashRet = await soulWallet.packUserOpHash(userOp, validAfter, validUntil);

    if (packedUserOpHashRet.isErr()) {
      throw new Error(packedUserOpHashRet.ERR.message);
    }
    const packedUserOpHash = packedUserOpHashRet.OK;

    userOp.signature = await getPasskeySignature(packedUserOpHash.packedUserOpHash, packedUserOpHash.validationData);

    try {
      return await executeTransaction(userOp, chainConfig);
    } catch (err) {
      toast({
        title: 'Transaction failed',
        status: 'error',
        description: String(err),
      });
      throw new Error(String(err));
    }
  };

  const signRawHash = async (hash: string) => {
    const packed1271HashRet = await soulWallet.getEIP1271TypedData(selectedAddress, hash);
    const packedHashRet = await soulWallet.packRawHash(packed1271HashRet.OK.typedMessage);

    let signature;

    signature = await getPasskeySignature(packedHashRet.OK.packedHash, packedHashRet.OK.validationData);
    return signature;
  };

  const signWithPasskey = async (hash: string) => {
    const selectedCredential: any = getSelectedCredential();
    return await signByPasskey(selectedCredential, hash);
  };

  return {
    loginWallet,
    getWithdrawOp,
    addPaymasterData,
    getActivateOp,
    signAndSend,
    signRawHash,
    signWithPasskey,
    logoutWallet,
    getSponsor,
    initWallet,
  };
}
