import api from '@/lib/api';
import QRCode from 'qrcode';
import { useToast } from '@chakra-ui/react';
import { useSignerStore } from '@/store/signer';
import { useAddressStore } from '@/store/address';
import { useBalanceStore } from '@/store/balance';
import { useHistoryStore } from '@/store/history';
import { useChainStore } from '@/store/chain';
import { useSlotStore } from '@/store/slot';
import { useSettingStore } from '@/store/setting';
import { useTempStore } from '@/store/temp';

export default function useTools() {
  const toast = useToast();
  const { clearSigners } = useSignerStore();
  const { clearAddresses } = useAddressStore();
  const { clearBalance } = useBalanceStore();
  const { clearHistory } = useHistoryStore();
  const { clearChainStore } = useChainStore();
  const { clearSlotStore } = useSlotStore();
  const { clearTempStore } = useTempStore();

  const clearLogData = () => {
    clearAddresses();
    clearBalance();
    clearChainStore();
    clearSigners();
    clearHistory();
    clearSlotStore();
    clearTempStore();
  };

  const generateJsonName = (name: string) => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${name}.json`;
  };

  const doCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
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
    getJsonFromFile,
    generateQrCode,
    generateJsonName,
    doCopy,
    clearLogData,
  };
}
