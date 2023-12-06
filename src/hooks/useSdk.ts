import { useMemo } from 'react';
import { L1KeyStore, SoulWallet } from '@soulwallet/sdk';
import { useChainStore } from '@/store/chain';
import { useSlotStore } from '@/store/slot';

export default function useSdk() {
  const { getSelectedChainItem, selectedChainId } = useChainStore();
  const { getSlotInfo } = useSlotStore();
  const selectedChainItem = getSelectedChainItem();

  const soulWallet = useMemo(() => {
    return new SoulWallet(
      selectedChainItem.provider,
      selectedChainItem.bundlerUrl,
      selectedChainItem.contracts.soulWalletFactory,
      selectedChainItem.contracts.defaultCallbackHandler,
      selectedChainItem.contracts.keyStoreModuleProxy,
      selectedChainItem.contracts.securityControlModule,
    );
  }, [selectedChainId]);

  /**
   * Calculate wallet address
   * @param index, index of wallet address to calculate
   * @param initialKey, initial signer key address
   * @param initialGuardians, initial guardian address list
   * @param threshold, initial guardian threshold
   * @returns
   */
  const calcWalletAddress = async (index: number) => {
    const { initialKeys, initialGuardianHash, initialGuardianSafePeriod } = getSlotInfo();
    const wAddress = await soulWallet.calcWalletAddress(
      index,
      initialKeys,
      initialGuardianHash,
      Number(initialGuardianSafePeriod),
    );
    return wAddress.OK;
  };

  return { soulWallet, calcWalletAddress };
}
