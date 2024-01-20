/**
 * Stores in this file should temporarily persist
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

const createStagingSlice = immer<any>((set, get) => ({
  createInfo: {},
  getCreatingGuardianInfo: () => {
    return get().createInfo && get().createInfo.creatingGuardianInfo
  },
  updateCreateInfo: (value: any) => set({
    createInfo: {
      ...get().createInfo,
      ...value
    }
  }),
  updateCreatingGuardianInfo: (value: any) => set({
    createInfo: {
      ...get().createInfo,
      creatingGuardianInfo: {
        ...(get().createInfo || {}),
        ...value
      }
    }
  }),
  clearCreateInfo: () => set({
    createInfo: {},
  }),

  loginInfo: {},
  getLoginInfo: () => {
    return get().loginInfo
  },
  updateLoginInfo: (value: any) => set({
    loginInfo: {
      ...get().loginInfo,
      ...value
    }
  }),
  clearTempStore: () => set({
    loginInfo: {},
    createInfo: {},
  }),
}));

export const useTempStore = create<any>()(
  persist((...set) => ({ ...createStagingSlice(...set) }), {
    name: 'temp-storage',
    version: 3,
  }),
);
