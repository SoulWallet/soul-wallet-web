// @ts-nocheck
import { openWindow, checkAllowed, checkShouldInject, getSelectedChainItem } from '@/lib/tools';
import { executeTransaction } from '@/lib/tx';
import { UserOpUtils } from '@soulwallet_test/sdk';
import { notify } from '@/lib/tools';

export default {
  async execute(userOp: any, chainConfig: any) {
    const receipt = await executeTransaction(userOp, chainConfig);
    notify('Transaction success', 'Your transaction was confirmed on chain');
  },

  async getAccounts() {
    const { isAllowed, selectedAddress } = checkAllowed(msg.data.origin);

    if (isAllowed) {
      return selectedAddress;
    } else {
      openWindow(`${msg.url}&tabId=${senderTabId}&origin=${msg.data.origin}&id=${id}`, windowWidth);
    }
  },
  async switchChain() {
    console.log('Swith chain msg', msg);
    const targetChainId = msg.data.chainId;
    openWindow(
      `${msg.url}&tabId=${senderTabId}&origin=${msg.data.origin}&id=${id}&targetChainId=${targetChainId}`,
      windowWidth,
    );
  },
  async getChainConfig() {
    const chainConfig = getSelectedChainItem();
    console.log('SO you see', chainConfig);
    return chainConfig;
  },
  async shouldInject() {
    return checkShouldInject(msg.data.origin);
  },
  async approve() {
    const { origin, txns } = msg.data;
    openWindow(`${msg.url}&tabId=${senderTabId}&origin=${origin}&txns=${JSON.stringify(txns)}&id=${id}`, windowWidth);
  },
  async signMessage() {
    openWindow(`${msg.url}&tabId=${senderTabId}&origin=${msg.data.origin}&data=${msg.data.data}&id=${id}`, windowWidth);
  },
  async signMessageV4() {
    openWindow(`${msg.url}&tabId=${senderTabId}&origin=${msg.data.origin}&data=${msg.data.data}&id=${id}`, windowWidth);
  },
};
