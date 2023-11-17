/**
 * For GuardianForm use ONLY
 * temporary store user's input
 * Please refer to GLOBAL store for permanent use
 */
import { GuardianItem } from '@/lib/type';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { create } from 'zustand';

export interface GuardianStore {
  guardiansInfo: any;
  recoveringGuardiansInfo: any;
  editingGuardiansInfo: any;
  slotInfo: any;

  setGuardiansInfo: (value: any) => void;
  setRecoveringGuardiansInfo: (value: any) => void;
  setEditingGuardiansInfo: (value: any) => void;
  setSlotInfo: (value: any) => void;
  clearGuardianInfo: () => void;

  updateGuardiansInfo: (value: any) => void;
  updateRecoveringGuardiansInfo: (value: any) => void;
  updateEditingGuardiansInfo: (value: any) => void;
  updateSlotInfo: (value: any) => void;

  getGuardiansInfo: () => any;
  getRecoveringGuardiansInfo: () => any;
  getEditingGuardiansInfo: () => any;
  getSlotInfo: () => any;
}

const createGuardianSlice = immer<GuardianStore>((set, get) => ({
  guardiansInfo: {},
  recoveringGuardiansInfo: {},
  editingGuardiansInfo: {},
  slotInfo: {},

  setGuardiansInfo: (value: any) => set({ guardiansInfo: value || {} }),
  setRecoveringGuardiansInfo: (value: any) => set({ recoveringGuardiansInfo: value || {} }),
  setEditingGuardiansInfo: (value: any) => set({ editingGuardiansInfo: value || {} }),
  setSlotInfo: (value: any) => set({ slotInfo: value || {} }),

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
  updateSlotInfo: (value: any) => set({
    slotInfo: {
      ...get().slotInfo,
      ...value
    }
  }),

  clearGuardianInfo: () => set({
    guardiansInfo: {},
    recoveringGuardiansInfo: {},
    editingGuardiansInfo: {},
    slotInfo: {},
  }),

  getGuardiansInfo: () => get().guardiansInfo,
  getRecoveringGuardiansInfo: () => get().recoveringGuardiansInfo,
  getEditingGuardiansInfo: () => get().editingGuardiansInfo,
  getSlotInfo: () => get().slotInfo,
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
  }),
);
