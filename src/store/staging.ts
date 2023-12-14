/**
 * Stores in this file should temporarily persist
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export interface IStagingStore {
    creatingGuardiansInfo: any;
    creatingCredentialsInfo: any;
}

const createStagingSlice = immer<IStagingStore>((set, get) => ({
    creatingGuardiansInfo: {},
    creatingCredentialsInfo: {},
}));

export const useStagingStore = create<IStagingStore>()(
  persist((...set) => ({ ...createStagingSlice(...set) }), {
    name: 'staging-storage',
    version: 3,
  }),
);
