import { useEffect, useState } from 'react';
import ListItem from '@/components/ListItem';
import useTools from '@/hooks/useTools';
import { numToFixed } from '@/lib/tools';
import BN from 'bignumber.js';
import { toShortAddress, getIconMapping } from '@/lib/tools';

export enum ActivityStatusEn {
  Success,
  Error,
  Pending,
}

export interface IActivityItem {
  functionName: string;
  txHash: string;
  status: ActivityStatusEn;
  amount?: string;
  to?: string;
}

export default function ActivityItem({ item, scanUrl }: any) {
  if (!item.functionName) {
    return <></>;
  }

  return (
    <a href={`${scanUrl}/tx/${item.trxHash}`} target="_blank">
      <ListItem
        idx={item.idx}
        icon={getIconMapping(item.functionName)}
        title={item.functionName}
        titleDesc={new Date(item.timestamp * 1000).toLocaleString()}
        amount={item.actualGasCost ? `${numToFixed(BN(item.actualGasCost).shiftedBy(-18).toString(), 6)} ETH` : ''}
        amountDesc={item && item.to ? `to ${toShortAddress(item.to || '')} ` : ''}
      />
    </a>
  );
}
