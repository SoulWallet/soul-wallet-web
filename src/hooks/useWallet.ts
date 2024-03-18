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
import BN from 'bignumber.js';
import useConfig from './useConfig';
import api from '@/lib/api';
import usePasskey from './usePasskey';
import { toHex } from '@/lib/tools';
import { useSignMessage } from 'wagmi';
import { useSignerStore } from '@/store/signer';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import { defaultGuardianSafePeriod } from '@/config';
import { sponsorMockSignature } from '@/config/constants';

export default function useWallet() {
  const { signByPasskey, register, authenticate } = usePasskey();
  const { set1559Fee } = useQuery();
  const { chainConfig } = useConfig();
  const { signMessageAsync } = useSignMessage();
  const { slotInfo, setSlotInfo, getSlotInfo } = useSlotStore();
  const { selectedChainId, setSelectedChainId } = useChainStore();
  const { setCredentials, getSelectedCredential } = useSignerStore();
  const { soulWallet, calcWalletAddress } = useSdk();
  const { selectedAddress, setAddressList, updateAddressItem, setSelectedAddress } = useAddressStore();
  const { getSelectedKeyType, setEoas } = useSignerStore();

  const createWallet = async (walletName: string, invitationCode: string) => {
    const createIndex = 0;
    const noGuardian = {
      initialGuardianHash: ethers.ZeroHash,
      initialGuardianSafePeriod: defaultGuardianSafePeriod,
    };

    // step 0: register passkey
    const credential = await register(walletName);
    console.log('res', credential);
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
    userOp.signature = sponsorMockSignature;

    try {
      const res = await api.sponsor.check(selectedChainId, chainConfig.contracts.entryPoint, {
        ...UserOpUtils.userOperationFromJSON(UserOpUtils.userOperationToJSON(userOp)),
        paymasterData:
          '0x0000000000000000000000000000000000000000000000000000000065f7e81e0000000000000000000000000000000000000000000000000000000000000000c8c1e4b029a76fc92119914dd1d9e6cf3a610b53c9913b1448ddfffb8c2af7cd18ad1ae71e18f98c9baf33a8468aca9cc4d9b0e92803b8cb7e22bd596d406b811c',
      });
      if (res.data && res.data.paymasterData) {
        console.log('sponsor info 1', res.data);
        userOp = {
          ...userOp,
          ...res.data,
          // paymasterData: res.data.paymasterData,
        };
        const receipt = await signAndSend(userOp);
        console.log('receipt is', receipt);
      }
    } catch (err) {}
  };

  const loginWallet = async () => {
    const { credential } = await authenticate();
  };

  const getActivateOp = async (index: number, _slotInfo: any, payToken: string) => {
    const { initialKeys, initialGuardianHash, initialGuardianSafePeriod } = _slotInfo;
    const userOpRet = await soulWallet.createUnsignedDeployWalletUserOp(
      index,
      initialKeys,
      initialGuardianHash,
      '0x',
      initialGuardianSafePeriod,
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

    userOp = await set1559Fee(userOp, payToken, SignkeyType.P256);

    userOp.preVerificationGas = `0x${BN(userOp.preVerificationGas.toString()).plus(75000).toString(16)}`;
    userOp.verificationGasLimit = `0x${BN(userOp.verificationGasLimit.toString()).plus(100000).toString(16)}`;

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

  const signAndSend = async (userOp: UserOperation, payToken?: string) => {
    // checkpaymaster
    if (payToken && payToken !== ethers.ZeroAddress && userOp.paymasterData === '0x') {
      userOp.paymasterData = addPaymasterData(payToken, chainConfig.contracts.paymaster);
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

  const signWithEoa = async (hash: any) => {
    return await signMessageAsync({
      message: {
        raw: hash,
      },
    });
  };

  return {
    createWallet,
    addPaymasterData,
    getActivateOp,
    signAndSend,
    signRawHash,
    signWithPasskey,
  };
}
