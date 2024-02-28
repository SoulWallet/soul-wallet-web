import { toFixed } from '@/lib/tools';
import { Flex, Text, Tooltip, Box } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import BN from 'bignumber.js';
import { motion } from 'framer-motion';

export const TruncateString = ({ str, num }: any) => {
  if (str.length > num) {
    return (
      <Flex>
        <Tooltip label={str}>{str.substring(0, num)}</Tooltip>
        <Text>...</Text>
      </Flex>
    );
  }
  return <Text>{str}</Text>;
};

interface IListItem {
  idx: number;
  icon: any;
  title: string;
  tokenPrice: string;
  usdValue?: string;
  totalUsdValue?: string;
  // titleDesc: string;
  amount: string;
  lineColor: string;
  // amountDesc: string;
  onClick?: () => void;
}

export default function ListItem({
  icon,
  title,
  onClick,
  amount,
  idx,
  lineColor,
  tokenPrice,
  usdValue,
  totalUsdValue,
}: IListItem) {
  const percent = BN(usdValue || '0')
    .div(totalUsdValue || '0')
    .times(100)
    .toFixed(2);
  return (
    <Flex
      onClick={onClick}
      justify={'space-between'}
      align={'center'}
      cursor={'pointer'}
      pt={idx === 0 ? '0px' : ''}
      transition={'all'}
    >
      <Flex w={{ base: '50%', lg: '33%' }} gap="2" align={'center'}>
        {/* <ImageIcon src={icon} /> */}
        <Image src={icon} w="32px" h="32px" />
        <Box lineHeight={'1.25'}>
          <Text fontWeight={'800'} mb="2px" textTransform={'capitalize'}>
            {title}
          </Text>
          {tokenPrice && <Text fontSize={'12px'}>${tokenPrice}</Text>}
        </Box>
      </Flex>

      <Box w={{ base: '50%', lg: '33%' }} lineHeight={'1.25'} textAlign={'right'} pr={{ lg: '64px' }}>
        <Text fontWeight={'800'} mb="2px" textTransform={'capitalize'}>
          {amount}
        </Text>
        {usdValue && <Text fontSize={'12px'}>${usdValue}</Text>}
      </Box>
      <Flex w="33%" gap="3" align="center" display={{ base: 'none', lg: 'block' }}>
        <Box bg="#d9d9d9" rounded={'8px'} overflow={'hidden'} h="6px" pos="relative" w="150px" flex="0 0 150px">
          <Box
            as={motion.div}
            bg={lineColor}
            pos="absolute"
            h="6px"
            initial={{ width: '0' }}
            animate={{ width: `${percent}%` }}
          />
        </Box>
        <Text fontSize={'12px'}>{toFixed(percent, 2)}%</Text>
      </Flex>
    </Flex>
  );
}
