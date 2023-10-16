import { useEffect, useState } from 'react';
import ListItem from '@/components/ListItem';
import useTools from '@/hooks/useTools';
import { numToFixed } from '@/lib/tools';
import BN from 'bignumber.js';
import { toShortAddress } from '@/lib/tools';

enum ActivityStatusEn {
  Success,
  Error,
  Pending,
}

interface IActivityItem {
  functionName: string;
  txHash: string;
  status: ActivityStatusEn;
  amount?: string;
  to?: string;
}

export default function ActivityItem({ item, scanUrl }: any) {
  const { decodeCalldata, getIconMapping } = useTools();
  const [detail, setDetail] = useState<IActivityItem>();

  const formatItem = async () => {
    const callDataDecodes = await decodeCalldata(item.chainId, item.entrypointAddress, item.userOp);
    // TODO, skip decode when exists in store
    // console.log('activity decoded', callDataDecodes);

    const functionNames = callDataDecodes.map((item: any) => item.functionName || item.method.name).join(', ');

    const status = item.success ? ActivityStatusEn.Success : ActivityStatusEn.Error;

    setDetail({
      functionName: functionNames,
      txHash: item.trxHash,
      to: callDataDecodes[0].to,
      status,
    });
  };

  useEffect(() => {
    if (!item) {
      return;
    }
    formatItem();
  }, [item]);

  if (!detail) {
    return <></>;
  }

  return (
    <a href={`${scanUrl}/tx/${detail.txHash}`} target="_blank">
      <ListItem
        idx={item.idx}
        icon={getIconMapping(detail.functionName)}
        title={detail.functionName}
        titleDesc={new Date(item.timestamp * 1000).toLocaleString()}
        amount={item.actualGasCost ? `${numToFixed(BN(item.actualGasCost).shiftedBy(-18).toString(), 6)} ETH` : ''}
        amountDesc={detail && detail.to ? `to ${toShortAddress(detail.to || '')} ` : ''}
      />
    </a>
  );
}
