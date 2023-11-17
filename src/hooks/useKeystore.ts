import { KeyStoreTypedDataType, L1KeyStore } from '@soulwallet/sdk';
import { useGuardianStore } from '@/store/guardian';
import useConfig from './useConfig';
import { ethers } from 'ethers';
import useWalletContext from '@/context/hooks/useWalletContext';
import { defaultGuardianSafePeriod } from '@/config';

export default function useKeystore() {
  const { chainConfig } = useConfig();
  const { getSlotInfo } = useGuardianStore();
  const { showSignMessage } = useWalletContext();
  const slotInfo = getSlotInfo();
  const slot = slotInfo.slot;

  const keystore = new L1KeyStore(chainConfig.l1Provider, chainConfig.contracts.l1Keystore);

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
    const { initialKeyHash, initialGuardianHash, initialGuardianSafePeriod, } = slotInitInfo;
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

  const getReplaceGuardianInfo = async (newGuardianHash: string) => {
    const slotInfo = getSlotInfo();
    const slot = slotInfo.slot;
    const ret = await keystore.getTypedData(KeyStoreTypedDataType.TYPE_HASH_SET_GUARDIAN, slot, newGuardianHash);
    if (ret.isErr()) {
      throw new Error(ret.ERR.message);
    }
    const { domain, types, value } = ret.OK;

    const keySignature = await showSignMessage({ domain, types, value }, 'passkey');

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
    const { domain, types, value } = ret.OK;

    const keySignature = await showSignMessage({ domain, types, value }, 'passkey');

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
  };
}
