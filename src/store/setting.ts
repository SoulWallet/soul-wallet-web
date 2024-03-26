/**
 * Stores in this file should always persist
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export interface ISettingStore {
  ignoreWebauthnOverride: boolean;
  setIgnoreWebauthnOverride: (val: boolean) => void;
  isDepositAllChecked: boolean;
  setIsDepositAllChecked: (val: boolean) => void;
}

const createSettingSlice = immer<ISettingStore>((set, get) => ({
  isDepositAllChecked: false,
  setIsDepositAllChecked: (val: boolean) => {
    set({
      isDepositAllChecked: val,
    });
  },
  ignoreWebauthnOverride: false,
  setIgnoreWebauthnOverride: (val: boolean) => {
    set({
      ignoreWebauthnOverride: val,
    });
  },
}));

export const useSettingStore = create<ISettingStore>()(
  persist((...set) => ({ ...createSettingSlice(...set) }), {
    name: 'setting-storage',
    version: 4,
  }),
);
