import { KeyStoreTypedDataType, L1KeyStore, SignkeyType } from '@soulwallet/sdk';
import { useSlotStore } from '@/store/slot';
import useConfig from './useConfig';
import { useMemo } from 'react';
import { ethers } from 'ethers';
import useWalletContext from '@/context/hooks/useWalletContext';
import { defaultGuardianSafePeriod } from '@/config';
import { useSignerStore } from '@/store/signer';
import { useVerifyTypedData } from 'wagmi';

export default function useKeystore() {
  const { chainConfig } = useConfig();
  const { getSlotInfo } = useSlotStore();
  const { showSignMessage } = useWalletContext();
  const { getSelectedKeyType } = useSignerStore();

  const slotInfo = getSlotInfo();
  const slot = slotInfo.slot;

  const keystore = useMemo(() => {
    return new L1KeyStore(chainConfig.l1Provider, chainConfig.contracts.l1Keystore);
  }, [chainConfig.l1Provider, chainConfig.contracts.l1Keystore]);

  /**
   * Calculate guardian hash
   * @params guardians, guardian address list
   * @returns
   */
  const calcGuardianHash = (guardians: string[], threshold: number, salt?: string) => {
    return L1KeyStore.calcGuardianHash(guardians, threshold, salt);
  };

  /**
   * Get slot info
   *
   */
  const getSlot = (
    initialKeys: string[],
    initialGuardianHash: string,
    initialGuardianSafePeriod: number = defaultGuardianSafePeriod,
  ) => {
    const initalkeys = L1KeyStore.initialKeysToAddress(initialKeys);
    const initialKeyHash = L1KeyStore.getKeyHash(initalkeys);
    return L1KeyStore.getSlot(initialKeyHash, initialGuardianHash, initialGuardianSafePeriod);
  };

  const getKeyStoreInfo = (slot: string) => {
    return keystore.getKeyStoreInfo(slot);
  };

  const getActiveGuardianHash = async (slotInitInfo: any) => {
    const { initialKeyHash, initialGuardianHash, initialGuardianSafePeriod } = slotInitInfo;
    const slot = L1KeyStore.getSlot(initialKeyHash, initialGuardianHash, initialGuardianSafePeriod);
    const now = Math.floor(Date.now() / 1000);
    const res = await getKeyStoreInfo(slot);
    if (res.isErr()) {
      return {
        guardianHash: null,
        activeGuardianHash: null,
        guardianActivateAt: null,
        pendingGuardianHash: null,
      };
    }
    const { guardianHash, pendingGuardianHash, guardianActivateAt, key } = res.OK;

    // todo, judge initial guardian slot when empty slot
    if (BigInt(key) > 0) {
      return {
        guardianHash,
        activeGuardianHash:
          pendingGuardianHash !== ethers.ZeroHash && guardianActivateAt < now ? pendingGuardianHash : guardianHash,
        guardianActivateAt,
        pendingGuardianHash,
      };
    } else {
      return {
        guardianHash: initialGuardianHash,
        activeGuardianHash: initialGuardianHash,
        guardianActivateAt: 0,
        pendingGuardianHash: ethers.ZeroHash,
      };
    }
  };

  const packKeystoreSignature = async (signature: any) => {
    const signType = getSelectedKeyType();
    let result;
    if (signType === SignkeyType.EOA) {
      result = await keystore.packKeystoreEOASignature(signature);
    } else if (signType === SignkeyType.P256) {
      result = await keystore.packKeystoreP256Signature(signature);
    } else if (signType === SignkeyType.RS256) {
      result = await keystore.packKeystoreRS256Signature(signature);
    } else {
      throw new Error('invalid sign type');
    }

    if (result.isErr()) {
      throw new Error(result.ERR.message);
    } else {
      return result.OK;
    }
  };

  const getReplaceGuardianInfo = async (newGuardianHash: string) => {
    const slotInfo = getSlotInfo();
    const slot = slotInfo.slot;
    const ret = await keystore.getTypedData(KeyStoreTypedDataType.TYPE_HASH_SET_GUARDIAN, slot, newGuardianHash);
    if (ret.isErr()) {
      throw new Error(ret.ERR.message);
    }
    const { domain, types, message, primaryType } = ret.OK;

    types['EIP712Domain'] = [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'version',
        type: 'string',
      },
      {
        name: 'chainId',
        type: 'uint256',
      },
      {
        name: 'verifyingContract',
        type: 'address',
      },
    ];

    const signType = getSelectedKeyType() === SignkeyType.EOA ? 'eoa' : 'passkey';

    const signature = await showSignMessage({ domain, types, message, primaryType }, signType);

    const keySignature = await packKeystoreSignature(signature);

    return {
      slot,
      newGuardianHash,
      keySignature,
    };
  };

  const getCancelSetGuardianInfo = async () => {
    const ret = await keystore.getTypedData(KeyStoreTypedDataType.TYPE_HASH_CANCEL_SET_GUARDIAN, slot);
    console.log('getCancelSetGuardianInfo', ret);
    if (ret.isErr()) {
      throw new Error(ret.ERR.message);
    }

    const signType = getSelectedKeyType() === SignkeyType.EOA ? 'eoa' : 'passkey';

    const { domain, types, message, primaryType } = ret.OK;

    types['EIP712Domain'] = [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'version',
        type: 'string',
      },
      {
        name: 'chainId',
        type: 'uint256',
      },
      {
        name: 'verifyingContract',
        type: 'address',
      },
    ];

    const signature = await showSignMessage({ domain, types, message, primaryType }, signType);

    const keySignature = await packKeystoreSignature(signature);

    return {
      slot,
      keySignature,
    };
  };

  return {
    keystore,
    calcGuardianHash,
    getSlot,
    getKeyStoreInfo,
    getActiveGuardianHash,
    getReplaceGuardianInfo,
    getCancelSetGuardianInfo,
    packKeystoreSignature,
  };
}
