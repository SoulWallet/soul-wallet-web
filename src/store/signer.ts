import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { SignkeyType } from '@soulwallet/sdk';

export interface ISignerStore {
  signerId: string;
  setSignerId: (signerId: string) => void;
  credentials: ICredentialItem[];
  getSelectedKeyType: () => SignkeyType;
  getSelectedCredential: () => void;
  addCredential: (credential: ICredentialItem) => void;
  setCredentials: (credentials: ICredentialItem[]) => void;
  changeCredentialName: (credentialId: string, name: string) => void;
  clearSigners: () => void;
}

export interface ICredentialItem {
  id: string;
  algorithm: string;
  name: string;
  publicKey: string;
}

export const getIndexByCredentialId = (credentials: ICredentialItem[], id: string) => {
  if (!credentials || !credentials.length || !id) return -1;
  return credentials.findIndex((item: ICredentialItem) => item.id === id);
};

const createCredentialSlice = immer<ISignerStore>((set, get) => ({
  // eoa address, credential id
  signerId: '',
  setSignerId: (signerId: string) => {
    set({
      signerId,
    });
  },

  credentials: [],
  getSelectedKeyType: () => {
    const index = getIndexByCredentialId(get().credentials, get().signerId);
    const algorithm = get().credentials[index].algorithm;
    return algorithm === 'ES256' ? SignkeyType.P256 : SignkeyType.RS256;
  },
  addCredential: (credential: ICredentialItem) => {
    set((state) => {
      state.credentials.push(credential);
    });
  },
  setCredentials: (credentials: ICredentialItem[]) => {
    set((state) => {
      state.credentials = credentials;
      // set the first one as default
      state.signerId = credentials[0].id;
    });
  },
  clearSigners: () => {
    set((state) => {
      state.credentials = [];
      state.signerId = '';
    });
  },
  getSelectedCredential: () => {
    const index = getIndexByCredentialId(get().credentials, get().signerId);
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

export const useSignerStore = create<ISignerStore>()(
  persist((...set) => ({ ...createCredentialSlice(...set) }), {
    name: 'signer-storage',
  }),
);
