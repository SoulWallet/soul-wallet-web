import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { SignkeyType } from '@soulwallet/sdk';

export interface ISignerStore {
  signerId: string;
  setSignerId: (signerId: string) => void;
  eoas: string[];
  setEoas: (eoas: string[]) => void;
  credentials: any;
  getSelectedKeyType: () => SignkeyType;
  getSelectedCredential: () => void;
  addCredential: (credential: any) => void;
  setCredentials: (credentials: any) => void;
  changeCredentialName: (credentialId: string, name: string) => void;
  clearSigners: () => void;
}

export const getIndexByCredentialId = (credentials: any, id: string) => {
  if (!credentials || !credentials.length || !id) return -1;
  return credentials.findIndex((item: any) => item.credentialId === id);
};

const createCredentialSlice = immer<ISignerStore>((set, get) => ({
  // eoa address, credential id
  signerId: '',
  setSignerId: (signerId: string) => {
    set({
      signerId,
    });
  },
  eoas: [],
  setEoas: (eoas: string[]) => {
    console.log('setEOAs', eoas);
    set({
      eoas: eoas,
      signerId: eoas[0],
    });
  },
  credentials: [],
  getSelectedKeyType: () => {
    if (get().eoas.includes(get().signerId)) {
      return SignkeyType.EOA;
    } else {
      const index = getIndexByCredentialId(get().credentials, get().signerId);
      const algorithm = get().credentials[index].algorithm;
      return algorithm === 'ES256' ? SignkeyType.P256 : SignkeyType.RS256;
    }
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
      state.signerId = credentials[0].credentialId;
    });
  },
  clearSigners: () => {
    set(state => {
      state.credentials = [];
      state.eoas = [];
      state.signerId = '';
    })
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
