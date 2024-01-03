import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export interface ISettingStore {
  ignoreWebauthnOverride: boolean;
  ignoreDeviceSupport: boolean;
  setIgnoreWebauthnOverride: (val: boolean) => void;
  setIgnoreDeviceSupport: (val: boolean) => void;
}

const createSettingSlice = immer<ISettingStore>((set, get) => ({
  ignoreWebauthnOverride: false,
  ignoreDeviceSupport: false,
  setIgnoreWebauthnOverride: (val: boolean) => {
    set({
      ignoreWebauthnOverride: val,
    });
  },
  setIgnoreDeviceSupport: (val: boolean) => {
    set({
      ignoreDeviceSupport: val,
    });
  },
}));

export const useSettingStore = create<ISettingStore>()(
  persist((...set) => ({ ...createSettingSlice(...set) }), {
    name: 'setting-storage',
  }),
);
