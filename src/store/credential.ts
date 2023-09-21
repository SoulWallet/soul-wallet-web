import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export interface ICredentialStore {
  credentials: any;
  addCredential: (credential: any) => void;
  changeCredentialName: (credentialId: string, name: string) => void;
}

export const getIndexByCredentialId = (credentials: any, id: string) => {
  return credentials.findIndex((item: any) => item.id === id);
};

const createCredentialSlice = immer<ICredentialStore>((set) => ({
  credentials: [],
  addCredential: (credential: any) => {
    set((state) => {
      state.credentials.push(credential);
    });
  },
  changeCredentialName: (credentialId: string, name: string) => {
    set((state) => {
      const index = getIndexByCredentialId(state.credentials, credentialId);
      if (index > -1) {
        state.credentials[index].name = name;
      }
    });
  },
}));

export const useCredentialStore = create<ICredentialStore>()(
  persist((...set) => ({ ...createCredentialSlice(...set) }), {
    name: "credential-storage",
  }),
);
