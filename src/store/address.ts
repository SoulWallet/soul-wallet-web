import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export interface IAddressItem {
  address: string;
  chainIdHex:string;
  activated?: boolean;
  recovering?: boolean;
}

export interface IAddressStore {
  walletName: string;
  setWalletName: (walletName: string) => void;
  selectedAddress: string;
  addressList: IAddressItem[];
  setSelectedAddress: (address: string) => void;
  setAddressList: (addressList: IAddressItem[]) => void;
  clearAddresses: () => void;
  addAddressItem: (addressItem: IAddressItem) => void;
  updateAddressItem: (address: string, addressItem: Partial<IAddressItem>) => void;
  deleteAddress: (address: string) => void;
  getIsActivated: (address: string, chainId: string) => boolean | undefined;
  getSelectedAddressItem: () => IAddressItem;
  clearAddressList: () => void;
}

export const getIndexByAddress = (addressList: IAddressItem[], address: string) => {
  if(!addressList || !addressList.length || !address) return -1;
  return addressList.findIndex((item: IAddressItem) => item.address.toLowerCase() === address.toLowerCase());
};

const createAddressSlice = immer<IAddressStore>((set, get) => ({
  selectedAddress: '',
  walletName: '',
  setWalletName: (walletName: string) =>
    set({
      walletName,
    }),
  addressList: [],
  getSelectedAddressItem: () => {
    const index = getIndexByAddress(get().addressList, get().selectedAddress);
    return get().addressList[index];
  },

  setSelectedAddress: (address: string) =>
    set({
      selectedAddress: address,
    }),

  setAddressList: (addressList: IAddressItem[]) => {
    set((state) => {
      state.addressList = addressList;
      state.selectedAddress = addressList[0].address;
    });
  },

  clearAddresses: () => {
    set((state) => {
      state.addressList = [];
      state.selectedAddress = '';
    });
  },
  addAddressItem: (addressItem: IAddressItem) => {
    set((state) => {
      state.addressList.push(addressItem);
    });
  },
  updateAddressItem: (address: string, addressItem: Partial<IAddressItem>) => {
    set((state) => {
      const index = getIndexByAddress(state.addressList, address);
      const item = state.addressList.filter((item: IAddressItem) => item.address === address)[0];
      const itemToSet = {
        ...item,
        ...addressItem,
      };
      state.addressList[index] = itemToSet;
    });
  },
  getIsActivated: (address) => {
    const index = getIndexByAddress(get().addressList, address);
    const addressInfo = get().addressList[index];
    return addressInfo && addressInfo.activated;
  },
  deleteAddress: (address: string) => {
    set((state: IAddressStore) => {
      const index = getIndexByAddress(state.addressList, address);
      state.addressList.splice(index, 1);
    });
  },
  clearAddressList: () => {
    set((state: IAddressStore) => {
      state.addressList = [];
    });
  },
}));

export const useAddressStore = create<IAddressStore>()(
  persist((...set) => ({ ...createAddressSlice(...set) }), {
    name: 'address-storage',
    version: 5,
  }),
);
