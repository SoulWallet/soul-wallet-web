import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export interface ICredentialStore {
  credentials: any;
  addCredential: (credential: any) => void;
}

const createCredentialSlice = immer<ICredentialStore>((set) => ({
  credentials: [],
  addCredential: (credential: any) => {
    set((state) => {
      state.credentials.push(credential);
    });
  },
  // removeCredential: (credentialId: string) => {
  //     set((state) => {
  //         state.shouldNotInjectList.push(origin);
  //         const removeIndex = state.shouldInjectList.indexOf(origin);
  //         if (removeIndex > -1) {
  //             state.shouldInjectList.splice(removeIndex, 1);
  //         }
  //     });
  // },
}));

export const useCredentialStore = create<ICredentialStore>()(
  persist((...set) => ({ ...createCredentialSlice(...set) }), {
    name: "credential-storage",
  }),
);
