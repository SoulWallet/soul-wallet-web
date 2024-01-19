/**
 * Stores in this file should always persist
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

interface IChainIdAddress{
  [chainIdHex: string]: string;
}

interface ISignerIdAddress {
  [id: string]: IChainIdAddress
}

export interface ISettingStore {
  collapseGuidance: boolean;
  setCollapseGuidance: (val: boolean) => void;
  ignoreWebauthnOverride: boolean;
  setIgnoreWebauthnOverride: (val: boolean) => void;
  setFinishedSteps: (steps: number[]) => void;
  finishedSteps: number[];
  // 1. guardian address -> name 2. slot address -> name
  addressName: { [address: string]: string };
  // signer id -> wallet address mapping
  signerIdAddress: ISignerIdAddress;
  setSignerIdAddress: (signerId: string, chainIdAddress: IChainIdAddress) => void;
  saveAddressName: (address: string, name: string, checkExists?: boolean) => void;
  removeAddressName: (address: string) => void;
  getAddressName: (address: string) => string;
}

const createSettingSlice = immer<ISettingStore>((set, get) => ({
  collapseGuidance: false,
  ignoreWebauthnOverride: false,
  finishedSteps: [],
  addressName: {},
  signerIdAddress: {},
  getSignerIdAddress: () => {
    return get().signerIdAddress;
  },
  setSignerIdAddress: (signerId: string, chainIdAddress: IChainIdAddress) => {
    set((state) => {
      state.signerIdAddress[signerId] = chainIdAddress;
    });
  },
  setIgnoreWebauthnOverride: (val: boolean) => {
    set({
      ignoreWebauthnOverride: val,
    });
  },
  setCollapseGuidance: (val: boolean) => {
    set({
      collapseGuidance: val,
    });
  },
  setFinishedSteps: (steps: number[]) => {
    set((state) => {
      state.finishedSteps = steps;
    });
  },
  getAddressName: (address) => {
    return get().addressName[address] || '';
  },
  saveAddressName: (address, name, checkExists = false) => {
    if(checkExists && get().addressName[address]){
      return;
    }
    set((state) => ({
      addressName: {
        ...state.addressName,
        [address]: name,
      },
    }));
  },
  removeAddressName: (address) => {
    set((state) => {
      const newState = {
        ...state.addressName,
      };
      delete newState[address];
      return {
        addressName: newState,
      };
      // state.addressName = newState;
    });
  },
}));

export const useSettingStore = create<ISettingStore>()(
  persist((...set) => ({ ...createSettingSlice(...set) }), {
    name: 'setting-storage',
    version: 4,
  }),
);
