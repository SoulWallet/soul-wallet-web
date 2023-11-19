import { ethers } from 'ethers';
import useSdk from './useSdk';
import useQuery from './useQuery';
import { ABI_SoulWallet } from '@soulwallet/abi';
import { useGuardianStore } from '@/store/guardian';
import { addPaymasterAndData } from '@/lib/tools';
import Erc20ABI from '../contract/abi/ERC20.json';
import { L1KeyStore, UserOperation } from '@soulwallet/sdk';
import { executeTransaction } from '@/lib/tx';
import BN from 'bignumber.js';
import useConfig from './useConfig';
import api from '@/lib/api';
import usePasskey from './usePasskey';
import { useCredentialStore } from '@/store/credential';
import { useAddressStore } from '@/store/address';
import { useChainStore } from '@/store/chain';
import useWalletContext from '@/context/hooks/useWalletContext';

export default function useWallet() {
  const { sign } = usePasskey();
  const { set1559Fee } = useQuery();
  const { chainConfig } = useConfig();
  const { ethersProvider } = useWalletContext();
  const {
    slotInfo,
    setSlotInfo,
    updateGuardiansInfo,
    recoveringGuardiansInfo,
    updateRecoveringGuardiansInfo,
    setRecoveringGuardiansInfo,
  } = useGuardianStore();
  const { updateChainItem, setSelectedChainId, selectedChainId } = useChainStore();
  const { setCredentials, getSelectedCredential } = useCredentialStore();
  const { soulWallet, calcWalletAddress } = useSdk();
  const { selectedAddress, addAddressItem, setSelectedAddress, setAddressList } = useAddressStore();

  const getActivateOp = async (index: number, payToken: string, extraTxs: any = []) => {
    console.log('extraTxs', extraTxs);
    const { initialKeys, initialGuardianHash, initialGuardianSafePeriod } = slotInfo;
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
    const erc20Abi = new ethers.Interface(Erc20ABI);
    const approveTos = chainConfig.paymasterTokens;
    const approveCalldata = erc20Abi.encodeFunctionData('approve', [
      chainConfig.contracts.paymaster,
      ethers.parseEther('1000'),
    ]);

    const approveCalldatas = [...new Array(approveTos.length)].map(() => approveCalldata);

    const finalTos = [...approveTos, ...extraTxs.map((tx: any) => tx.to)];

    const finalCalldatas = [...approveCalldatas, ...extraTxs.map((tx: any) => tx.data)];

    const hasValue = extraTxs.some((tx: any) => tx.value && tx.value !== '0x' && tx.value !== '0x0');

    const finalValues = [...new Array(approveTos.length).fill('0x0'), ...extraTxs.map((tx: any) => tx.value || '0x0')];

    if (hasValue) {
      userOp.callData = soulAbi.encodeFunctionData('executeBatch(address[],uint256[],bytes[])', [
        finalTos,
        finalValues,
        finalCalldatas,
      ]);
    } else {
      userOp.callData = soulAbi.encodeFunctionData('executeBatch(address[],bytes[])', [finalTos, finalCalldatas]);
    }

    userOp = await set1559Fee(userOp, payToken);

    let callGasLimit = BN(approveTos.length * 50000);

    for (let i = 0; i < extraTxs.length; i++) {
      // get gas from tx or onchain
      const gas = BN(extraTxs[i].gas).isGreaterThan(0)
        ? BN(extraTxs[i].gas)
        : await ethersProvider.estimateGas(extraTxs[i]);
      callGasLimit = callGasLimit.plus(gas);
    }

    console.log('estimate callGaslimit', callGasLimit);

    userOp.callGasLimit = `0x${
      BN(callGasLimit).isGreaterThan(finalTos.length * 50000)
        ? callGasLimit.toString(16)
        : Number(finalTos.length * 50000).toString(16)
    }`;
    userOp.preVerificationGas = `0x${BN(userOp.preVerificationGas.toString()).plus(15000).toString(16)}`;
    userOp.verificationGasLimit = `0x${BN(userOp.verificationGasLimit.toString()).plus(30000).toString(16)}`;

    return userOp;
  };

  const getSetGuardianCalldata = async (slot: string, guardianHash: string, keySignature: string) => {
    const soulAbi = new ethers.Interface(ABI_SoulWallet);
    return soulAbi.encodeFunctionData('setGuardian(bytes32,bytes32,bytes32)', [slot, guardianHash, keySignature]);
  };

  const getSignature = async (packedHash: string, validationData: string) => {
    const selectedCredential: any = getSelectedCredential();
    const signatureData: any = await sign(selectedCredential, packedHash);

    console.log('packUserOp256Signature params:', signatureData, validationData);
    const packedSignatureRet =
      selectedCredential.algorithm === 'ES256'
        ? await soulWallet.packUserOpP256Signature(signatureData, validationData)
        : selectedCredential.algorithm === 'RS256'
        ? await soulWallet.packUserOpRS256Signature(signatureData, validationData)
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
    if (payToken && payToken !== ethers.ZeroAddress && userOp.paymasterAndData === '0x') {
      const paymasterAndData = addPaymasterAndData(payToken, chainConfig.contracts.paymaster);
      userOp.paymasterAndData = paymasterAndData;
    }

    const validAfter = Math.floor(Date.now() / 1000);
    const validUntil = validAfter + 3600;

    console.log('before pack', userOp);

    const packedUserOpHashRet = await soulWallet.packUserOpHash(userOp, validAfter, validUntil);

    if (packedUserOpHashRet.isErr()) {
      throw new Error(packedUserOpHashRet.ERR.message);
    }
    const packedUserOpHash = packedUserOpHashRet.OK;

    userOp.signature = await getSignature(packedUserOpHash.packedUserOpHash, packedUserOpHash.validationData);

    return await executeTransaction(userOp, chainConfig);
  };

  const signRawHash = async (hash: string) => {
    const packed1271HashRet = await soulWallet.getEIP1271TypedData(selectedAddress, hash);
    const packedHashRet = await soulWallet.packRawHash(packed1271HashRet.OK.typedMessage);
    const signature = await getSignature(packedHashRet.OK.packedHash, packedHashRet.OK.validationData);
    return signature;
  };

  const signWithPasskey = async (hash: string) => {
    const packedHashRet = await soulWallet.packRawHash(hash);
    const signature = await getSignature(packedHashRet.OK.packedHash, packedHashRet.OK.validationData);
    return signature;
  };

  const retrieveForNewDevice = async (initInfo: any, credential: any) => {
    // set init info
    retrieveSlotInfo(initInfo);
    // calc first address
    const newAddress = await calcWalletAddress(0);
    setAddressList([
      {
        title: `Account 1`,
        address: newAddress,
        activatedChains: [],
      },
    ]);
    // IMPORTANT TODO, get wallet name from credential storage
    // set credentials
    const credentialKey = {
      id: credential.credentialId,
      publicKey: credential.publicKey,
      algorithm: credential.algorithm,
      name: 'Passkey 1',
      // coords,
    };

    setCredentials([credentialKey]);
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

  const boostAfterRecovered = async () => {
    console.log('trigger bootstAfterRecovered')
    retrieveSlotInfo({
      ...recoveringGuardiansInfo,
      initialKeys: recoveringGuardiansInfo.initialKeysAddress,
    });
    const newAddress = await calcWalletAddress(0);

    setAddressList([
      {
        title: `Account 1`,
        address: newAddress,
        // TODO, check activate status
        activatedChains: [],
      },
    ]);

    setCredentials(recoveringGuardiansInfo.credentials);
    // set goerli if no selected chainId
    if(!selectedChainId){
      setSelectedChainId('0x5');
    }

    updateGuardiansInfo({
      guardianDetails: recoveringGuardiansInfo.guardianDetails,
      guardianHash: recoveringGuardiansInfo.guardianHash,
      guardianNames: recoveringGuardiansInfo.guardianNames,
      keystore: recoveringGuardiansInfo.keystore,
      slot: recoveringGuardiansInfo.slot,
    });
    updateRecoveringGuardiansInfo({
      enabled: true,
    });
  };

  const checkRecoverStatus = async (recoveryRecordID: string) => {
    const res = (await api.guardian.getRecoverRecord({ recoveryRecordID })).data;
    updateRecoveringGuardiansInfo({
      recoveryRecord: res,
    });
    const { addressList } = useAddressStore.getState();
    if (addressList.length === 0) {
      for (let [index, item] of Object.entries(res.addresses)) {
        addAddressItem({
          title: `Account ${index + 1}`,
          address: item as any,
          activatedChains: [],
        });
      }
      console.log('to set selected address: ', res.addresses);
    }

    // check if should replace key
    if (res.status >= 3) {
      // new credential
      // const stagingKeysRaw = await Promise.all(credentials.map((credential: any) => credential.publicKey))
      // const stagingKeys = L1KeyStore.initialKeysToAddress(stagingKeysRaw);
      // const stagingKeyHash = L1KeyStore.getKeyHash(stagingKeys);
      // const stagingCredentials = []
      // const currentCredentials = []
      // const onchainCredentials = res.newOwners;
      // if(onchainCredentials.include(stagingCredentials) && !onchainCredentials.include(currentCredentials) ){
      if (!recoveringGuardiansInfo.enabled) {
        await boostAfterRecovered();
      }
    }

    // recover process finished
    if (res.status === 4) {
      setRecoveringGuardiansInfo({});
    }

    const chainRecoverStatus = res.statusData.chainRecoveryStatus;
    for (let item of chainRecoverStatus) {
      updateChainItem(item.chainId, {
        recovering: item.status === 0,
      });
    }
  };

  return {
    addPaymasterAndData,
    getActivateOp,
    getSetGuardianCalldata,
    signAndSend,
    signRawHash,
    signWithPasskey,
    retrieveForNewDevice,
    retrieveSlotInfo,
    boostAfterRecovered,
    checkRecoverStatus,
  };
}
