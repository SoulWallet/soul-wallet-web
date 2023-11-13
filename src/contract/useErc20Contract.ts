import useWalletContext from '@/context/hooks/useWalletContext';
import {Contract} from 'ethers'
import ERC20ABI from './abi/ERC20.json';


export default function useErc20Contract() {
  const {ethersProvider} = useWalletContext();

  return {
    async tokenInfo(tokenAddress: string) {
      const tokenContract = new Contract(tokenAddress, ERC20ABI, ethersProvider);
      // todo, change to multicall
      return {
        symbol: await tokenContract.symbol(),
        decimals: await tokenContract.decimals(),
      }
    },
  };
}
