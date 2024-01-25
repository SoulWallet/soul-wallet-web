import ListItem from '@/components/ListItem';
import { Image, Link, Flex, Text, Box } from '@chakra-ui/react';
import { numToFixed } from '@/lib/tools';
import BN from 'bignumber.js';
import { toShortAddress, getIconMapping } from '@/lib/tools';
import IconEth from '@/assets/chains/eth.svg';

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
    <Link
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      href={`${scanUrl}/tx/${item.trxHash}`}
      target="_blank"
    >
      <Flex gap="3" align={'center'}>
        <Image src={getIconMapping(item.functionName)} w="32px" h="32px" />
        <Box>
          <Flex align={'center'} gap="2" mb="1" maxW={"90%"}>
            <Text fontSize={'14px'} fontWeight={'800'} textTransform={"capitalize"}>
              {item.functionName}
            </Text>
          </Flex>
          {/* <Text fontSize={'12px'} color="#5b606d">
            To: {item.to ? toShortAddress(item.to) : ''}
          </Text> */}
        </Box>
      </Flex>
      <Flex gap="2">
        <Text fontSize={'16px'} textAlign={"right"} fontWeight={'700'}>
          {item.actualGasCost ? `${numToFixed(BN(item.actualGasCost).shiftedBy(-18).toString(), 6)} ETH` : ''}
        </Text>
        <Image src={IconEth} />
      </Flex>
      {/* <ListItem
        // titleDesc={new Date(item.timestamp * 1000).toLocaleString()}
        amount={item.actualGasCost ? `${numToFixed(BN(item.actualGasCost).shiftedBy(-18).toString(), 6)} ETH` : ''}
        // amountDesc={item && item.to ? `to ${toShortAddress(item.to || '')} ` : ''}
      /> */}
    </Link>
  );
}
