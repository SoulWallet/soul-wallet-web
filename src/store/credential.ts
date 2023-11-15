import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export interface ICredentialStore {
  selectedCredentialId: string;
  setSelectedCredentialId: (credentialId: string) => void;
  walletName: string;
  setWalletName: (name: string) => void;
  credentials: any;
  getSelectedCredential: () => void;
  addCredential: (credential: any) => void;
  setCredentials: (credentials: any) => void;
  changeCredentialName: (credentialId: string, name: string) => void;
  clearCredentials: () => void;
}

export const getIndexByCredentialId = (credentials: any, id: string) => {
  return credentials.findIndex((item: any) => item.id === id);
};

const createCredentialSlice = immer<ICredentialStore>((set, get) => ({
  credentials: [],
  selectedCredentialId: '',
  walletName: '',
  setWalletName: (name: string) => {
    set({
      walletName: name,
    });
  },
  setSelectedCredentialId: (credentialId: string) => {
    set((state) => {
      state.selectedCredentialId = credentialId;
    });
  },
  addCredential: (credential: any) => {
    set((state) => {
      state.credentials.push(credential);
    });
  },
  setCredentials: (credentials: any) => {
    set((state) => {
      state.credentials = credentials;
      // set the first one as default
      state.selectedCredentialId = credentials[0].id;
    });
  },
  clearCredentials: ()=>{
    set(state=>{
      state.credentials = [];
    });
  },
  getSelectedCredential: () => {
    const index = getIndexByCredentialId(get().credentials, get().selectedCredentialId);
    return get().credentials[index];
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
    name: 'credential-storage',
  }),
);
