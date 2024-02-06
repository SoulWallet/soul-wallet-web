/**
 * For GuardianForm use ONLY
 * temporary store user's input
 * Please refer to GLOBAL store for permanent use
 */
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { create } from 'zustand';

export interface GuardianStore {
  showGuardianTip1: any,
  showGuardianTip2: any,

  guardiansInfo: any;
  recoveringGuardiansInfo: any;
  editingGuardiansInfo: any;

  setGuardiansInfo: (value: any) => void;
  setRecoveringGuardiansInfo: (value: any) => void;
  setEditingGuardiansInfo: (value: any) => void;
  clearGuardianInfo: () => void;

  updateGuardiansInfo: (value: any) => void;
  updateRecoveringGuardiansInfo: (value: any) => void;
  updateEditingGuardiansInfo: (value: any) => void;

  getGuardiansInfo: () => any;
  getRecoveringGuardiansInfo: () => any;
  getEditingGuardiansInfo: () => any;
}

const createGuardianSlice = immer<GuardianStore>((set, get) => ({
  showGuardianTip1: true,
  showGuardianTip2: true,
  guardiansInfo: {},
  recoveringGuardiansInfo: {},
  editingGuardiansInfo: {},

  setGuardiansInfo: (value: any) => set({ guardiansInfo: value || {} }),
  setRecoveringGuardiansInfo: (value: any) => set({ recoveringGuardiansInfo: value || {} }),
  setEditingGuardiansInfo: (value: any) => set({ editingGuardiansInfo: value || {} }),

  closeGuardianTip1: (value: any) => set({
    showGuardianTip1: false
  }),

  closeGuardianTip2: (value: any) => set({
    showGuardianTip2: false
  }),

  updateGuardiansInfo: (value: any) => set({
    guardiansInfo: {
      ...get().guardiansInfo,
      ...value
    }
  }),
  updateRecoveringGuardiansInfo: (value: any) => set({
    recoveringGuardiansInfo: {
      ...get().recoveringGuardiansInfo,
      ...value
    }
  }),
  updateEditingGuardiansInfo: (value: any) => set({
    editingGuardiansInfo: {
      ...get().editingGuardiansInfo,
      ...value
    }
  }),
  clearGuardianInfo: () => set({
    guardiansInfo: {},
    recoveringGuardiansInfo: {},
    editingGuardiansInfo: {},
  }),

  getGuardiansInfo: () => get().guardiansInfo,
  getRecoveringGuardiansInfo: () => get().recoveringGuardiansInfo,
  getEditingGuardiansInfo: () => get().editingGuardiansInfo,
}));

export type GuardianState = ReturnType<typeof createGuardianStore>;

// type GuardianStoreInitialProps = {
//   guardians: GuardianItem[];
// };

export const createGuardianStore = (initProps?: any) =>
  create<GuardianStore>()((...a) => ({ ...createGuardianSlice(...a), ...initProps }));

export const useGuardianStore = create<GuardianStore>()(
  persist((...set) => ({ ...createGuardianSlice(...set) }), {
    name: 'guardian-storage',
    version: 5,
  }),
);
