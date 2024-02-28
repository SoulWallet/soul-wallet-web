import ListItem from '@/components/ListItem';
import { Image, Link, Flex, Text, Box } from '@chakra-ui/react';
import { Link as RLink } from 'react-router-dom';
import { toFixed } from '@/lib/tools';
import BN from 'bignumber.js';
import { getIconMapping } from '@/lib/tools';
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
      as={RLink}
      justifyContent={'space-between'}
      alignItems={'center'}
      to="/activity"
    >
      <Flex gap="3" align={'center'}>
        <Image src={getIconMapping(item.functionName)} w="32px" h="32px" />
        <Box>
          <Flex align={'center'} gap="2" mb="1" maxW={'90%'}>
            <Text fontSize={'14px'} fontWeight={'800'} textTransform={'capitalize'}>
              {item.functionName}
            </Text>
          </Flex>
        </Box>
      </Flex>
      <Flex gap="2">
        <Text fontSize={'16px'} textAlign={'right'} fontWeight={'700'}>
          {item.actualGasCost ? `${toFixed(BN(item.actualGasCost).shiftedBy(-18).toString(), 6)} ETH` : ''}
        </Text>
        <Image src={IconEth} />
      </Flex>
    </Link>
  );
}
