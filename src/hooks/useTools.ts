import api from '@/lib/api';
import QRCode from 'qrcode';
import { GuardianItem } from '@/lib/type';
import { copyText } from '@/lib/tools';
import { useToast } from '@chakra-ui/react';
import { useSignerStore } from '@/store/signer';
import { useAddressStore } from '@/store/address';
import useBrowser from './useBrowser';
import useWalletContext from '@/context/hooks/useWalletContext';
import { useGuardianStore } from '@/store/guardian';
import { useBalanceStore } from '@/store/balance';
import { useHistoryStore } from '@/store/history';
import { useChainStore } from '@/store/chain';
import { useSlotStore } from '@/store/slot';
import { useSettingStore } from '@/store/setting';
import { useTempStore } from '@/store/temp';

export default function useTools() {
  const toast = useToast();
  const { showSetGuardianHintModal } = useWalletContext();
  const { clearSigners } = useSignerStore();
  const { clearAddresses } = useAddressStore();
  const { clearGuardianInfo } = useGuardianStore();
  const { clearBalance } = useBalanceStore();
  const { clearHistory } = useHistoryStore();
  const { clearChainStore } = useChainStore();
  const { clearSlotStore, slotInfo } = useSlotStore();
  const { clearTempStore } = useTempStore();
  const { getAddressName, saveAddressName } = useSettingStore();
  const { showClaimAssets, showSend } = useWalletContext();
  const { navigate } = useBrowser();

  const checkInitialized = (showHintModal = false) => {
    if (!slotInfo.initialGuardianHash) {
      if (showHintModal) {
        showSetGuardianHintModal();
      }
      return false;
    }
    return true;
  };

  const getWalletName = () => {
    return getAddressName(slotInfo.slot);
  };

  const setWalletName = (name: string) => {
    saveAddressName(slotInfo.slot, name);
  };

  const clearLogData = () => {
    clearAddresses();
    clearBalance();
    clearChainStore();
    clearSigners();
    clearGuardianInfo();
    clearHistory();
    clearSlotStore();
    clearTempStore();
  };

  const goGuideAction = (id: number) => {
    switch (id) {
      case 0:
        showClaimAssets();
        break;
      case 1:
        showSend();
        break;
      case 2:
        navigate('/security/guardian');
        break;
      case 3:
        navigate(`/apps?appUrl=${encodeURIComponent('https://app.uniswap.org')}`);
        break;
      case 4:
        navigate(`/apps?appUrl=${encodeURIComponent('https://staging.aave.com')}`);
        break;
      case 5:
        navigate(`/recover`);
        break;
    }
  };

  const formatGuardianFile = (walletAddress: string, guardiansList: GuardianItem[] = []) => {
    // remove id
    const guardians = guardiansList.map((item) => {
      return {
        address: item.address,
        name: item.name,
      };
    });
    return {
      walletAddress: walletAddress,
      guardians,
    };
  };

  const generateJsonName = (name: string) => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${name}.json`;
  };

  const doCopy = (text: string) => {
    copyText(text);
    toast({
      title: 'Copied',
      status: 'success',
    });
  };

  const downloadJsonFile = (jsonToSave: any) => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(jsonToSave))}`;

    const link = document.createElement('a');

    link.setAttribute('href', dataStr);

    link.setAttribute('target', '_blank');

    link.setAttribute('download', generateJsonName('guardian'));

    link.click();
  };

  const getJsonFromFile = async (jsonFile: File) => {
    const reader = new FileReader();
    reader.readAsText(jsonFile);

    return new Promise((resolve) => {
      reader.onload = (e: any) => {
        const data = JSON.parse(e.target.result);
        resolve(data);
      };
    });
  };

  const emailJsonFile = async (jsonToSave: any, email: string) => {
    const res: any = await api.notification.backup({
      email,
      filename: generateJsonName('guardian'),
      backupObject: jsonToSave,
    });
    if (res.code === 200) {
      toast({
        title: 'Email sent.',
        status: 'success',
      });
      return res;
    }
  };

  const verifyAddressFormat = (address: string) => {
    return /^0x[0-9a-fA-F]{40}$/.test(address);
  };

  const generateQrCode = async (text: string) => {
    return await QRCode.toDataURL(text, { margin: 2 });
  };

  return {
    verifyAddressFormat,
    downloadJsonFile,
    emailJsonFile,
    formatGuardianFile,
    getJsonFromFile,
    generateQrCode,
    generateJsonName,
    doCopy,
    clearLogData,
    goGuideAction,
    getWalletName,
    setWalletName,
    checkInitialized,
  };
}
