import { useEffect, useState } from 'react';
import { ExternalLink } from '../HomeCard';
import ListItem from '@/components/ListItem';
import { ITokenBalanceItem, useBalanceStore } from '@/store/balance';
import useConfig from '@/hooks/useConfig';
import TransferAssets from '@/components/TransferAssets';
import useBrowser from '@/hooks/useBrowser';
import { useAddressStore } from '@/store/address';
import HomeCard from '../HomeCard';

export default function Tokens() {
  const { selectedAddress } = useAddressStore();
  const { tokenBalance, fetchTokenBalance } = useBalanceStore();
  const [transferVisible, setTransferVisible] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const { selectedChainItem } = useConfig();
  const { navigate } = useBrowser();

  useEffect(() => {
    const { chainIdHex, paymasterTokens } = selectedChainItem;

    if (!selectedAddress) {
      return;
    }

    const interval = setInterval(() => {
      fetchTokenBalance(selectedAddress, chainIdHex, paymasterTokens);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedAddress, selectedChainItem]);

  const showTransfer = (tokenAddress: string) => {
    setTokenAddress(tokenAddress);
    setTransferVisible(true);
  };

  return (
    <HomeCard title={'Tokens'} external={<ExternalLink title="View all" to="/asset" />} contentHeight="290px">
      {tokenBalance.map((item: ITokenBalanceItem, idx: number) => (
        <ListItem
          key={idx}
          idx={idx}
          icon={item.logoURI}
          title={item.name || 'Unknown'}
          titleDesc={'Token'}
          amount={item.tokenBalanceFormatted}
          amountDesc={item.symbol}
          onClick={() => showTransfer(item.contractAddress)}
        />
      ))}
      {transferVisible && <TransferAssets tokenAddress={tokenAddress} onClose={() => setTransferVisible(false)} />}
    </HomeCard>
  );
}
