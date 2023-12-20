/**
 * Stores in this file should temporarily persist
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export interface ITempStore {
    creatingGuardiansInfo: any;
    creatingCredentialsInfo: any;
}

const createStagingSlice = immer<ITempStore>((set, get) => ({
    creatingGuardiansInfo: {},
    creatingCredentialsInfo: {},
}));

export const useTempStore = create<ITempStore>()(
  persist((...set) => ({ ...createStagingSlice(...set) }), {
    name: 'staging-storage',
    version: 3,
  }),
);
