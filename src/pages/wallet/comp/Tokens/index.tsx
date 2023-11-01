import { useState } from 'react';
import { ExternalLink } from '../HomeCard';
import ListItem from '@/components/ListItem';
import { ITokenBalanceItem, useBalanceStore } from '@/store/balance';
import HomeCard from '../HomeCard';
import useWalletContext from '@/context/hooks/useWalletContext';

export default function Tokens() {
  const { showTransferAssets } = useWalletContext();
  const { tokenBalance } = useBalanceStore();

  const showTransfer = (tokenAddress: string) => {
    showTransferAssets(tokenAddress);
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
    </HomeCard>
  );
}
