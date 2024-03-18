import { MaxUint256, ZeroHash, ethers } from 'ethers';
import useSdk from './useSdk';
import useQuery from './useQuery';
import { ABI_SoulWallet } from '@soulwallet/abi';
import { useGuardianStore } from '@/store/guardian';
import { useSlotStore } from '@/store/slot';
import { addPaymasterData } from '@/lib/tools';
import { erc20Abi, verifyMessage } from 'viem';
import { L1KeyStore, SignkeyType, UserOperation } from '@soulwallet/sdk';
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
import useWalletContext from '@/context/hooks/useWalletContext';
import { useTempStore } from '@/store/temp';
import { useSettingStore } from '@/store/setting';
import { getWalletAddress } from '@/pages/recover/RecoverProgress';
import { defaultGuardianSafePeriod } from '@/config';
import { sponsorMockSignature } from '@/config/constants';

export default function useWallet() {
  const { signByPasskey, register } = usePasskey();
  const { set1559Fee } = useQuery();
  const { chainConfig } = useConfig();
  const { ethersProvider } = useWalletContext();
  const { signMessageAsync } = useSignMessage();
  const { updateGuardiansInfo } = useGuardianStore();
  const { slotInfo, setSlotInfo, getSlotInfo } = useSlotStore();
  const { selectedChainId, setSelectedChainId } = useChainStore();
  const { setCredentials, getSelectedCredential } = useSignerStore();
  const { soulWallet, calcWalletAddress } = useSdk();
  const { selectedAddress, setAddressList, updateAddressItem, setSelectedAddress } = useAddressStore();
  const { getSelectedKeyType, setEoas } = useSignerStore();
  const { setSignerIdAddress, setFinishedSteps, saveAddressName, getRecoverRecordId } = useSettingStore();
  const { clearCreateInfo, recoverInfo, setRecoverInfo, updateRecoverInfo, clearTempStore } = useTempStore();

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
    userOp.paymasterData =
      '0x0000000000000000000000000000000000000000000000000000000065f7e81e0000000000000000000000000000000000000000000000000000000000000000c8c1e4b029a76fc92119914dd1d9e6cf3a610b53c9913b1448ddfffb8c2af7cd18ad1ae71e18f98c9baf33a8468aca9cc4d9b0e92803b8cb7e22bd596d406b811c';

    try {
      const res = await api.sponsor.check(
        selectedChainId,
        chainConfig.contracts.entryPoint,
        UserOpUtils.userOperationFromJSON(UserOpUtils.userOperationToJSON(userOp)),
      );
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

  const getSetGuardianCalldata = async (slot: string, guardianHash: string, keySignature: string) => {
    const soulAbi = new ethers.Interface(ABI_SoulWallet);
    return soulAbi.encodeFunctionData('setGuardian(bytes32,bytes32,bytes32)', [slot, guardianHash, keySignature]);
  };

  const getEoaSignature = async (packedHash: any, validationData: string) => {
    const signatureData: any = await signWithEoa(packedHash);

    console.log('packUserEoaSignature params:', signatureData, validationData);

    const packedSignatureRet = await soulWallet.packUserOpEOASignature(
      chainConfig.contracts.defaultValidator,
      signatureData,
      validationData,
    );

    if (!packedSignatureRet) {
      throw new Error('failed to sign');
    }

    if (packedSignatureRet.isErr()) {
      throw new Error(packedSignatureRet.ERR.message);
    }

    return packedSignatureRet.OK;
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
    const selectedKeyType = getSelectedKeyType();
    // checkpaymaster
    if (payToken && payToken !== ethers.ZeroAddress && userOp.paymasterData === '0x') {
      userOp.paymasterData = addPaymasterData(payToken, chainConfig.contracts.paymaster);
    }

    const validAfter = Math.floor(Date.now() / 1000 - 300);
    const validUntil = validAfter + 3600;
    // const validAfter = '0';
    // const validUntil = '0';

    const packedUserOpHashRet = await soulWallet.packUserOpHash(userOp, validAfter, validUntil);

    if (packedUserOpHashRet.isErr()) {
      throw new Error(packedUserOpHashRet.ERR.message);
    }
    const packedUserOpHash = packedUserOpHashRet.OK;

    console.log('selected key type', selectedKeyType);

    if (selectedKeyType === SignkeyType.EOA) {
      userOp.signature = await getEoaSignature(packedUserOpHash.packedUserOpHash, packedUserOpHash.validationData);
    } else if (selectedKeyType === SignkeyType.P256 || selectedKeyType === SignkeyType.RS256) {
      userOp.signature = await getPasskeySignature(packedUserOpHash.packedUserOpHash, packedUserOpHash.validationData);
    } else {
      console.error('No sign key type selected');
    }

    return await executeTransaction(userOp, chainConfig);
  };

  const signRawHash = async (hash: string) => {
    const selectedKeyType = getSelectedKeyType();

    const packed1271HashRet = await soulWallet.getEIP1271TypedData(selectedAddress, hash);
    const packedHashRet = await soulWallet.packRawHash(packed1271HashRet.OK.typedMessage);

    let signature;

    if (selectedKeyType === SignkeyType.EOA) {
      signature = await getEoaSignature(packedHashRet.OK.packedHash, packedHashRet.OK.validationData);
    } else if (selectedKeyType === SignkeyType.P256 || selectedKeyType === SignkeyType.RS256) {
      signature = await getPasskeySignature(packedHashRet.OK.packedHash, packedHashRet.OK.validationData);
    }
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

  const retrieveSlotInfo = (initInfo: any) => {
    // set slot info
    const initialKeysAddress = L1KeyStore.initialKeysToAddress(initInfo.initialKeys);
    const initialKeyHash = L1KeyStore.getKeyHash(initialKeysAddress);

    setSlotInfo({
      initialKeys: initInfo.initialKeys,
      initialKeyHash,
      initialKeysAddress,
      slot: initInfo.slot,
      initialGuardianHash: initInfo.slotInitInfo.initialGuardianHash,
      initialGuardianSafePeriod: initInfo.slotInitInfo.initialGuardianSafePeriod,
    });
  };

  // will be executed only once after recover process finished
  const boostAfterRecovered = async (_recoverInfo: any) => {
    retrieveSlotInfo({
      ..._recoverInfo,
      initialKeys: _recoverInfo.initialKeysAddress,
    });
    const addressList = _recoverInfo.recoveryRecord.addresses.map((item: any) => ({
      address: item.address,
      chainIdHex: item.chain_id,
    }));
    console.log('yoooo', addressList);
    setAddressList(addressList);
    const credentialsInStore = _recoverInfo.signers.filter((signer: any) => signer.type === 'passkey');
    const eoasInStore = _recoverInfo.signers.filter((signer: any) => signer.type === 'eoa');
    if (credentialsInStore.length) setCredentials(credentialsInStore);
    if (eoasInStore.length) setEoas(eoasInStore.map((signer: any) => signer.signerId));
    // set mainnet if no selected chainId
    setSelectedChainId(import.meta.env.VITE_MAINNET_CHAIN_ID);

    updateGuardiansInfo({
      guardianDetails: _recoverInfo.guardianDetails,
      guardianHash: _recoverInfo.guardianHash,
      guardianNames: _recoverInfo.guardianNames,
      keystore: _recoverInfo.keystore,
      slot: _recoverInfo.slot,
    });

    const res = await api.operation.finishStep({
      slot: _recoverInfo.slot,
      steps: [5],
    });

    setFinishedSteps(res.data.finishedSteps);

    // set new signerIds and remove old ones
    const credentialIds = credentialsInStore.map((item: any) => item.id);
    const eoaIds = eoasInStore.map((item: any) => item.address);

    const chainIdAddress = addressList.reduce((obj: any, item: any) => {
      return {
        ...obj,
        [item.chainIdHex]: item.address,
      };
    }, {});

    const newSignerIds = [...credentialIds, ...eoaIds].filter((item) => item);
    // set new signerIdAddress
    newSignerIds.forEach((item) => {
      setSignerIdAddress(item, chainIdAddress);
    });

    updateRecoverInfo({
      enabled: true,
    });
  };

  const checkRecoverStatus = async (_recoverInfo: any) => {
    const { recoveryRecordID } = _recoverInfo;
    if (!recoveryRecordID) {
      return;
    }

    const res = (await api.guardian.getRecoverRecord({ recoveryRecordID })).data;
    updateRecoverInfo({
      recoveryRecord: res,
    });

    // check if should replace key
    if (res.status >= 3) {
      if (!_recoverInfo.enabled) {
        await boostAfterRecovered(_recoverInfo);
      }
    }

    // recover process finished
    if (res.status === 4) {
      setRecoverInfo({});
    }

    const chainRecoverStatus = res.statusData.chainRecoveryStatus;
    for (let item of chainRecoverStatus) {
      const addressToSet = getWalletAddress(item.chainId, res.addresses);
      updateAddressItem(addressToSet, {
        recovering: item.status === 0,
      });
    }
  };

  return {
    createWallet,
    addPaymasterData,
    getActivateOp,
    getSetGuardianCalldata,
    signAndSend,
    signRawHash,
    signWithPasskey,
    signWithEoa,
    retrieveSlotInfo,
    boostAfterRecovered,
    checkRecoverStatus,
  };
}
