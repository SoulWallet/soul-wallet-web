import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { create } from 'zustand';

export interface SlotStore {
  slotInfo: any;
  setSlotInfo: (value: any) => void;
  clearSlotInfo: () => void;
  updateSlotInfo: (value: any) => void;
  getSlotInfo: () => any;
}

const createSlotSlice = immer<SlotStore>((set, get) => ({
  slotInfo: {},
  setSlotInfo: (value: any) => set({ slotInfo: value || {} }),
  updateSlotInfo: (value: any) => set({
    slotInfo: {
      ...get().slotInfo,
      ...value
    }
  }),
  clearSlotInfo: () => set({
    slotInfo: {},
  }),
  getSlotInfo: () => get().slotInfo,
}));

export type SlotState = ReturnType<typeof createSlotStore>;

export const createSlotStore = (initProps?: any) =>
  create<SlotStore>()((...a) => ({ ...createSlotSlice(...a), ...initProps }));

export const useSlotStore = create<SlotStore>()(
  persist((...set) => ({ ...createSlotSlice(...set) }), {
    name: 'slot-storage',
  }),
);
