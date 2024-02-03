import { paymentABI } from './abis';

export const paymentContractConfig = {
  address: import.meta.env.VITE_PAYMENT,
  abi: paymentABI,
};
