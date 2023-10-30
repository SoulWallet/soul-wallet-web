import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { storeVersion } from '@/config';

export interface ICredentialStore {
  selectedCredentialId: string;
  setSelectedCredentialId: (credentialId: string) => void;
  credentials: any;
  addCredential: (credential: any) => void;
  setCredentials: (credentials: any) => void;
  changeCredentialName: (credentialId: string, name: string) => void;
  clearCredentials: () => void;
}

export const getIndexByCredentialId = (credentials: any, id: string) => {
  return credentials.findIndex((item: any) => item.id === id);
};

const createCredentialSlice = immer<ICredentialStore>((set) => ({
  credentials: [],
  selectedCredentialId: "",
  setSelectedCredentialId: (credentialId: string) => {
    set(state=>{
      state.selectedCredentialId = credentialId;
    })
  },
  addCredential: (credential: any) => {
    set((state) => {
      state.credentials.push(credential);
    });
  },
  setCredentials: (credentials: any) => {
    set((state) => {
      state.credentials = credentials;
    })
  },
  changeCredentialName: (credentialId: string, name: string) => {
    set((state) => {
      const index = getIndexByCredentialId(state.credentials, credentialId);
      if (index > -1) {
        state.credentials[index].name = name;
      }
    });
  },
  clearCredentials: () => {
    set((state) => {
      state.credentials = [];
    });
  },
}));

export const useCredentialStore = create<ICredentialStore>()(
  persist((...set) => ({ ...createCredentialSlice(...set) }), {
    name: 'credential-storage',
    version: storeVersion,
  }),
);
