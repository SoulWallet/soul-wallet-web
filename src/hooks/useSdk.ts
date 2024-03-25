import { useMemo } from 'react';
import { SoulWallet } from '@soulwallet/sdk';
import { useChainStore } from '@/store/chain';
import { useSlotStore } from '@/store/slot';

export default function useSdk() {
  const { getSelectedChainItem, selectedChainId } = useChainStore();
  const { getSlotInfo } = useSlotStore();
  const { chainList } = useChainStore();
  const selectedChainItem = getSelectedChainItem();

  const soulWallet = useMemo(() => {
    return new SoulWallet(
      selectedChainItem.provider,
      selectedChainItem.bundlerUrl,
      selectedChainItem.contracts.soulWalletFactory,
      selectedChainItem.contracts.defaultValidator,
      selectedChainItem.contracts.defaultCallbackHandler,
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
  const calcWalletAddress = async (index: number, chainIdHex: string) => {
    const {initialKeys, initialGuardianHash, initialGuardianSafePeriod } = getSlotInfo();

    const wAddress = await soulWallet.calcWalletAddress(
      index,
      initialKeys,
      initialGuardianHash,
      Number(initialGuardianSafePeriod),
      chainIdHex,
    );

    return {
      address: wAddress.OK,
      chainIdHex,
    }
  };

  /**
   * Calculate wallet address for all chains
   */
  const calcWalletAddressAllChains = async (index: number) => {
    const walletAddressPromises = chainList.map((item) => {
      return calcWalletAddress(index, item.chainIdHex);
    });

    return await Promise.all(walletAddressPromises);
  };

  return { soulWallet, calcWalletAddress, calcWalletAddressAllChains };
}
