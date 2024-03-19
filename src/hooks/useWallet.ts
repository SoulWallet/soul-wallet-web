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

export default function useWallet() {
  const { signByPasskey, register, authenticate } = usePasskey();
  const { estimateGasFee } = useQuery();
  const { chainConfig } = useConfig();
  const { setSlotInfo } = useSlotStore();
  const { selectedChainId } = useChainStore();
  const { setCredentials, getSelectedCredential } = useSignerStore();
  const { soulWallet } = useSdk();
  const { getUserOp } = useTransaction();
  const { selectedAddress, setSelectedAddress } = useAddressStore();

  const createWallet = async (credential: any, walletName: string, invitationCode: string) => {
    const createIndex = 0;
    const noGuardian = {
      initialGuardianHash: ethers.ZeroHash,
      initialGuardianSafePeriod: defaultGuardianSafePeriod,
    };
 
    // step 1: calculate address
    const initialKeys = [credential.publicKey as string];

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

    const createSlotInfo = {
      initialKeys,
      initialGuardianHash: noGuardian.initialGuardianHash,
      initialGuardianSafePeriod: toHex(noGuardian.initialGuardianSafePeriod),
    };
    // save slot info to api
    await api.account.create({
      address,
      chainID: selectedChainId,
      name: walletName,
      initInfo: {
        index: createIndex,
        ...createSlotInfo,
      },
      invitationCode,
    });

    setSlotInfo(createSlotInfo);

    setCredentials([credential as any]);
    // step 2: get User op
    let userOp = await getActivateOp(createIndex, createSlotInfo, chainConfig.paymasterTokens[0]);
    
    signAndSend(userOp);

  };

  const withdrawAssets = async (amount: string, to: string) => {
    const userOp = await getWithdrawOp(amount, to);
    signAndSend(userOp);
  }

  const loginWallet = async () => {
    const { credential } = await authenticate();
    const res = await api.account.get({
      ownerKey: credential.publicKey,
    });

    console.log('account info', res);
  };

  const getWithdrawOp = async (amount: string, to: string) => {
    const aaveUsdcPool = new ethers.Interface(aaveUsdcPoolAbi);
    const erc20 = new ethers.Interface(erc20Abi);

    const withdrawTx = {
      from: selectedAddress,
      to: import.meta.env.VITE_AAVE_USDC_POOL,
      data: aaveUsdcPool.encodeFunctionData('withdraw(address,uint256,address)', [import.meta.env.VITE_TOKEN_USDC , ethers.parseUnits(amount, 6), selectedAddress])
    };

    // TODO, transfer all amount
    const transferOutTx = {
      from: selectedAddress,
      to: import.meta.env.VITE_TOKEN_USDC,
      data: erc20.encodeFunctionData('transfer', [to, ethers.parseUnits(amount, 6)]),
    }

    return await getUserOp([withdrawTx, transferOutTx])
  }

  const getActivateOp = async (index: number, _slotInfo: any, payToken: string) => {
    const { initialKeys, initialGuardianHash } = _slotInfo;
    const userOpRet = await soulWallet.createUnsignedDeployWalletUserOp(
      index,
      initialKeys,
      initialGuardianHash,
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
      import.meta.env.VITE_AaveUsdcSaveAutomationSepolia,
      MaxUint256,
    ]);

    const approveCalldatas = [...new Array(approveTos.length)].map(() => approveCalldata);

    const finalValues = [...new Array(approveTos.length).fill('0x0')];

    const executions: string[][] = approveTos.map((to, index) => [to, finalValues[index], approveCalldatas[index]]);

    userOp.callData = soulAbi.encodeFunctionData('executeBatch((address,uint256,bytes)[])', [executions]);

    userOp = await estimateGasFee(userOp, SignkeyType.P256);

    return userOp;
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

  const signAndSend = async (userOp: UserOperation) => {
    userOp.signature = (await soulWallet.getSemiValidSignature(import.meta.env.VITE_SoulWalletDefaultValidator, userOp, SignkeyType.P256)).OK;

    const res = await api.sponsor.check(
      selectedChainId,
      chainConfig.contracts.entryPoint,
      JSON.parse(UserOpUtils.userOperationToJSON(userOp)),
    );
    if (res.data && res.data.paymasterData) {
      userOp = {
        ...userOp,
        ...res.data,
      };
    }

    const validAfter = Math.floor(Date.now() / 1000 - 300);
    const validUntil = validAfter + 3600;

    const packedUserOpHashRet = await soulWallet.packUserOpHash(userOp, validAfter, validUntil);

    if (packedUserOpHashRet.isErr()) {
      throw new Error(packedUserOpHashRet.ERR.message);
    }
    const packedUserOpHash = packedUserOpHashRet.OK;

    userOp.signature = await getPasskeySignature(packedUserOpHash.packedUserOpHash, packedUserOpHash.validationData);

    return await executeTransaction(userOp, chainConfig);
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
    createWallet,
    withdrawAssets,
    addPaymasterData,
    getActivateOp,
    signAndSend,
    signRawHash,
    signWithPasskey,
  
  };
}
