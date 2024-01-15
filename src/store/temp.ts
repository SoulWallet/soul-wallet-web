/**
 * Stores in this file should temporarily persist
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

const createStagingSlice = immer<any>((set, get) => ({
  createInfo: {},
  updateCreateInfo: (value: any) => set({
    createInfo: {
      ...get().createInfo,
      ...value
    }
  }),
}));

export const useTempStore = create<any>()(
  persist((...set) => ({ ...createStagingSlice(...set) }), {
    name: 'staging-storage',
    version: 3,
  }),
);
