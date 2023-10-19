import { KeyStoreTypedDataType, L1KeyStore } from '@soulwallet/sdk';
import { useGuardianStore } from '@/store/guardian';
import useConfig from './useConfig';
import { ethers } from 'ethers';
import useWalletContext from '@/context/hooks/useWalletContext';

export default function useKeystore() {
  const { chainConfig } = useConfig();
  const { slotInitInfo, slot } = useGuardianStore();
  const { showSignMessage } = useWalletContext();

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
    initialGuardianSafePeriod: number = L1KeyStore.days * 2,
  ) => {
    const initalkeys = L1KeyStore.initialKeysToAddress(initialKeys);
    const initialKeyHash = L1KeyStore.getKeyHash(initalkeys);
    return L1KeyStore.getSlot(initialKeyHash, initialGuardianHash, initialGuardianSafePeriod);
  };

  const getKeyStoreInfo = (slot: string) => {
    return keystore.getKeyStoreInfo(slot);
  };

  const getActiveGuardianHash = async () => {
    const { initialKeys, initialGuardianHash, initialGuardianSafePeriod } = slotInitInfo;
    const slot = getSlot(initialKeys, initialGuardianHash, initialGuardianSafePeriod);
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
    const { guardianHash, pendingGuardianHash, guardianActivateAt } = res.OK;

    return {
      guardianHash,
      activeGuardianHash:
        pendingGuardianHash !== ethers.ZeroHash && guardianActivateAt < now ? pendingGuardianHash : guardianHash,
      guardianActivateAt,
      pendingGuardianHash,
    };
  };

  const getReplaceGuardianInfo = async (newGuardianHash: string) => {
    const { initialKeys, initialGuardianHash, initialGuardianSafePeriod } = slotInitInfo;
    const ret = await keystore.getTypedData(KeyStoreTypedDataType.TYPE_HASH_SET_GUARDIAN, slot, newGuardianHash);
    if (ret.isErr()) {
      throw new Error(ret.ERR.message);
    }
    const { domain, types, value: message } = ret.OK;

    // TODO, to be tested
    const keySignature = await showSignMessage({ domain, types, message }, 'typedData');

    return {
      newGuardianHash,
      keySignature,
      initialKeys,
      initialGuardianHash,
      initialGuardianSafePeriod,
    };
  };

  const getCancelSetGuardianInfo = async () => {
    const ret = await keystore.getTypedData(KeyStoreTypedDataType.TYPE_HASH_CANCEL_SET_GUARDIAN, slot);
    console.log('getCancelSetGuardianInfo', ret);
    if (ret.isErr()) {
      throw new Error(ret.ERR.message);
    }
    const { domain, types, value: message } = ret.OK;

    const keySignature = await showSignMessage({ domain, types, message }, 'typedData');

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
